import React, { useState, useEffect } from 'react';
import { 
  X, UploadCloud, Download, Check, AlertCircle, CheckCircle, ChevronRight,
  HelpCircle, Trash2, Settings, ArrowRight, Table, AlertTriangle, UserCheck
} from 'lucide-react';
import { UserRole, UserProfile, School } from '../types';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSchool: School;
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  addNotification: (title: string, message: string, role: UserRole | 'all') => void;
}

interface ColumnMapping {
  name: string;
  email: string;
  role: string;
  grade: string;
  section: string;
  subjects: string;
}

interface ParsedRecord {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent';
  grade: string;
  section: string;
  subjects: string[];
  isValid: boolean;
  errors: string[];
}

export function BulkUploadModal({ isOpen, onClose, activeSchool, addUser, addNotification }: BulkUploadModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [csvFileName, setCsvFileName] = useState('');
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  // Mapping state
  const [mapping, setMapping] = useState<ColumnMapping>({
    name: '',
    email: '',
    role: '',
    grade: '',
    section: '',
    subjects: ''
  });

  // Default values when not mapped
  const [defaults, setDefaults] = useState({
    role: 'student' as 'student' | 'teacher' | 'parent',
    grade: 'Class 9',
    section: 'Section A',
    subjects: 'Artificial Intelligence'
  });

  // Fully parsed and validated rows for Step 3
  const [previewRows, setPreviewRows] = useState<ParsedRecord[]>([]);

  // Parse CSV function supporting quotes
  const parseCSV = (text: string): string[][] => {
    const result: string[][] = [];
    let row: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        row.push(current.trim());
        current = '';
        if (row.length > 0 && row.some(cell => cell !== '')) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \n
        }
      } else {
        current += char;
      }
    }
    if (current || row.length > 0) {
      row.push(current.trim());
      if (row.some(cell => cell !== '')) {
        result.push(row);
      }
    }
    return result;
  };

  // Auto-mapping logic
  const detectAutoMapping = (headers: string[]) => {
    const newMapping: ColumnMapping = {
      name: '',
      email: '',
      role: '',
      grade: '',
      section: '',
      subjects: ''
    };

    const lowercaseHeaders = headers.map(h => h.toLowerCase().trim());

    lowercaseHeaders.forEach((h, index) => {
      const originalHeader = headers[index];
      
      // Name heuristics
      if (['name', 'fullname', 'full name', 'student name', 'teacher name', 'member name', 'beneficiary', 'username'].includes(h)) {
        newMapping.name = originalHeader;
      }
      // Email heuristics
      else if (['email', 'mail', 'email address', 'emailid', 'email_id', 'contact email'].includes(h)) {
        newMapping.email = originalHeader;
      }
      // Role heuristics
      else if (['role', 'type', 'user role', 'classification', 'category', 'role classification'].includes(h)) {
        newMapping.role = originalHeader;
      }
      // Grade heuristics
      else if (['grade', 'class', 'standard', 'grade level', 'level', 'class block'].includes(h)) {
        newMapping.grade = originalHeader;
      }
      // Section heuristics
      else if (['section', 'class section', 'sec', 'group'].includes(h)) {
        newMapping.section = originalHeader;
      }
      // Subjects heuristics
      else if (['subject', 'subjects', 'topic', 'courses', 'subjects taught'].includes(h)) {
        newMapping.subjects = originalHeader;
      }
    });

    setMapping(newMapping);
  };

  const handleFileChange = (file: File) => {
    if (!file) return;
    setCsvFileName(file.name);
    setCsvError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          setCsvError("This CSV file appears to be empty.");
          return;
        }

        const rows = parseCSV(text);
        if (rows.length === 0) {
          setCsvError("Could not parse any rows in the CSV file.");
          return;
        }

        const headers = rows[0].map(h => h.trim());
        if (headers.length === 0 || headers.every(h => !h)) {
          setCsvError("Invalid CSV. Ensure your file contains a valid header row.");
          return;
        }

        setRawHeaders(headers);
        setRawRows(rows.slice(1));
        detectAutoMapping(headers);
        setStep(2); // Go to mapping step
      } catch (err: any) {
        setCsvError(`Failed to read CSV: ${err.message || 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  // Apply mapping and default fallbacks to generate rows for Step 3
  const generatePreviewRows = () => {
    const nameIdx = rawHeaders.indexOf(mapping.name);
    const emailIdx = rawHeaders.indexOf(mapping.email);
    const roleIdx = rawHeaders.indexOf(mapping.role);
    const gradeIdx = rawHeaders.indexOf(mapping.grade);
    const sectionIdx = rawHeaders.indexOf(mapping.section);
    const subjectsIdx = rawHeaders.indexOf(mapping.subjects);

    const parsed: ParsedRecord[] = rawRows.map((row, idx) => {
      const rawName = nameIdx !== -1 ? row[nameIdx] : '';
      const rawEmail = emailIdx !== -1 ? row[emailIdx] : '';
      const rawRoleVal = roleIdx !== -1 ? row[roleIdx] : '';
      const rawGrade = gradeIdx !== -1 ? row[gradeIdx] : '';
      const rawSection = sectionIdx !== -1 ? row[sectionIdx] : '';
      const rawSubjects = subjectsIdx !== -1 ? row[subjectsIdx] : '';

      // Clean up parsed fields
      const name = (rawName || '').trim();
      const email = (rawEmail || '').trim();
      
      // Resolve role
      let role: 'student' | 'teacher' | 'parent' = defaults.role;
      if (rawRoleVal) {
        const normalizedRole = rawRoleVal.toLowerCase().trim();
        if (normalizedRole.includes('teach') || normalizedRole.includes('facult') || normalizedRole.includes('prof')) {
          role = 'teacher';
        } else if (normalizedRole.includes('stud') || normalizedRole.includes('pupil') || normalizedRole.includes('child')) {
          role = 'student';
        } else if (normalizedRole.includes('parent') || normalizedRole.includes('guard')) {
          role = 'parent';
        }
      }

      // Resolve grade, section, subjects
      const grade = (rawGrade || '').trim() || defaults.grade;
      const section = (rawSection || '').trim() || defaults.section;
      const subjectsStr = (rawSubjects || '').trim();
      const subjects = subjectsStr 
        ? subjectsStr.split(/[;,]/).map(s => s.trim()).filter(Boolean) 
        : [defaults.subjects];

      // Run validations
      const errors: string[] = [];
      if (!name) {
        errors.push("Name cannot be empty");
      }
      if (!email) {
        errors.push("Email cannot be empty");
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push("Invalid email syntax");
      }

      return {
        id: `preview-${idx}-${Date.now()}`,
        name,
        email,
        role,
        grade,
        section,
        subjects,
        isValid: errors.length === 0,
        errors
      };
    });

    setPreviewRows(parsed);
    setStep(3);
  };

  // Re-evaluate a row after inline changes
  const handleRowChange = (id: string, updatedFields: Partial<ParsedRecord>) => {
    setPreviewRows(prev => prev.map(row => {
      if (row.id !== id) return row;

      const merged = { ...row, ...updatedFields };
      
      // Re-run validation on edited fields
      const errors: string[] = [];
      if (!merged.name.trim()) {
        errors.push("Name cannot be empty");
      }
      if (!merged.email.trim()) {
        errors.push("Email cannot be empty");
      } else if (!/\S+@\S+\.\S+/.test(merged.email)) {
        errors.push("Invalid email syntax");
      }

      return {
        ...merged,
        errors,
        isValid: errors.length === 0
      };
    }));
  };

  const handleRowDelete = (id: string) => {
    setPreviewRows(prev => prev.filter(row => row.id !== id));
  };

  // Submit the mapped users to the DB
  const handleCommitUpload = () => {
    const validRows = previewRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      alert("No valid rows found. Please fix validation errors or import a different file.");
      return;
    }

    // Add users to store
    validRows.forEach(row => {
      addUser({
        name: row.name,
        email: row.email,
        role: row.role as UserRole,
        schoolId: activeSchool.id,
        avatar: row.role === 'student' ? '👦' : row.role === 'teacher' ? '👨‍🏫' : '👨',
        grade: row.role === 'student' ? row.grade : undefined,
        section: row.role === 'student' ? row.section : undefined,
        streak: row.role === 'student' ? 1 : undefined,
        points: row.role === 'student' ? 100 : undefined,
        badges: row.role === 'student' ? ['First Steps'] : undefined,
        subjects: row.role === 'teacher' ? row.subjects : undefined
      });
    });

    // Notify SaaS
    addNotification(
      'Bulk Roster Onboarded! 🚀',
      `Successfully bulk onboarded ${validRows.length} students & teachers via CSV smart mapping on ${activeSchool.name}.`,
      'all'
    );

    alert(`Successfully processed and bulk-imported ${validRows.length} campus accounts!`);
    
    // Reset state and close
    resetModal();
    onClose();
  };

  const resetModal = () => {
    setStep(1);
    setCsvFileName('');
    setRawHeaders([]);
    setRawRows([]);
    setCsvError(null);
    setMapping({
      name: '',
      email: '',
      role: '',
      grade: '',
      section: '',
      subjects: ''
    });
    setPreviewRows([]);
  };

  const downloadSampleTemplate = (type: 'student' | 'teacher' | 'unified') => {
    let csvContent = '';
    let fileName = '';

    if (type === 'student') {
      csvContent = "Full Name,Mail Address,Student Grade,Campus Section\n" +
                   "Aarav Patel,aarav@school.edu,Class 9,Section A\n" +
                   "Ishita Sharma,ishita@school.edu,Class 10,Section B";
      fileName = "Students_Mapped_Sample.csv";
    } else if (type === 'teacher') {
      csvContent = "Faculty Name,Contact Email,Subjects Taught\n" +
                   "Suman Sharma,suman@school.edu,Artificial Intelligence;Python Basics\n" +
                   "Rahul Varma,rahul@school.edu,Data Science;Mathematics";
      fileName = "Teachers_Mapped_Sample.csv";
    } else {
      csvContent = "Name,Email Address,Member Role,Grade Level,Section Block,Specializations\n" +
                   "Alok Roy,alok@school.edu,student,Class 9,Section A,\n" +
                   "Kiran Bedi,kiran@school.edu,teacher,,,Artificial Intelligence;Robotics\n" +
                   "Suresh Rao,suresh@school.edu,parent,,,";
      fileName = "Unified_Mapped_Sample.csv";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div id="bulk-upload-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div id="bulk-upload-modal-container" className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Table className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Smart CSV Roster Onboarding</h3>
              <p className="text-[11px] text-slate-500">Bulk map CSV files to {activeSchool.name} database dynamically.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => { resetModal(); onClose(); }} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium select-none">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step === 1 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-800'}`}>
              {step > 1 ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span className={step === 1 ? 'font-extrabold text-indigo-600' : 'text-slate-600'}>Upload File</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step === 2 ? 'bg-indigo-600 text-white shadow-xs' : step > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-400'}`}>
              {step > 2 ? <Check className="w-3 h-3" /> : '2'}
            </span>
            <span className={step === 2 ? 'font-extrabold text-indigo-600' : 'text-slate-500'}>Column Mapping</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step === 3 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-200 text-slate-400'}`}>
              3
            </span>
            <span className={step === 3 ? 'font-extrabold text-indigo-600' : 'text-slate-500'}>Validate & Onboard</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
          
          {/* STEP 1: UPLOAD FILE */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto space-y-1.5">
                <h4 className="text-sm font-extrabold text-slate-800">Select or Drag-and-Drop Your Member Roster CSV</h4>
                <p className="text-[11px] text-slate-500">
                  Upload raw student lists, faculty details, or parent registers. Our parser reads column names, allowing you to match custom fields to standard system parameters.
                </p>
              </div>

              {/* Drag Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileChange(file);
                }}
                onClick={() => document.getElementById('modal-csv-file-input')?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/40'
                    : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/30'
                }`}
              >
                <input
                  id="modal-csv-file-input"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                  }}
                />
                
                <div className="flex flex-col items-center justify-center space-y-3.5">
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-400 group-hover:text-indigo-600">
                    <UploadCloud className="w-8 h-8 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-700">
                      Click to choose CSV file or drag and drop here
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports standard CSV file formats with any custom header columns.</p>
                  </div>
                </div>
              </div>

              {csvError && (
                <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-slideDown">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Parsing Error</p>
                    <p className="text-[10.5px] mt-0.5">{csvError}</p>
                  </div>
                </div>
              )}

              {/* Templates Block */}
              <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl space-y-3">
                <div>
                  <h5 className="text-[11.5px] font-extrabold text-slate-700 uppercase tracking-wide">Download Standard Mapped Templates</h5>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed mt-0.5">
                    If you do not have a pre-formatted roster, you can download one of our standard templates designed to auto-map immediately.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => downloadSampleTemplate('student')}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-600" />
                    <span>Students Template</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadSampleTemplate('teacher')}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Teachers Template</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadSampleTemplate('unified')}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>Unified Campus Roster</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COLUMN MAPPING */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-3 border-b border-slate-100">
                <h4 className="text-sm font-extrabold text-slate-800">Configure CSV Field Mappings</h4>
                <p className="text-[11px] text-slate-500">
                  Select which column headers in your CSV file match our campus database parameters. Auto-matches have been calculated.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Mapping Controls Column */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 text-xs font-bold uppercase text-slate-600">
                      <Settings className="w-4 h-4 text-indigo-500" />
                      <span>Fields Association Directory</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      
                      {/* Name mapping */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
                        <div>
                          <label className="font-bold text-slate-800 flex items-center gap-1">
                            <span>Full Name</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Primary identifier</span>
                        </div>
                        <select
                          value={mapping.name}
                          onChange={(e) => setMapping(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">-- Don't Map (Invalid) --</option>
                          {rawHeaders.map((h, i) => (
                            <option key={i} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>

                      {/* Email mapping */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
                        <div>
                          <label className="font-bold text-slate-800 flex items-center gap-1">
                            <span>Email Address</span>
                            <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Secure communication email</span>
                        </div>
                        <select
                          value={mapping.email}
                          onChange={(e) => setMapping(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="">-- Don't Map (Invalid) --</option>
                          {rawHeaders.map((h, i) => (
                            <option key={i} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>

                      {/* Role mapping */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
                        <div>
                          <label className="font-bold text-slate-800">Role Classification</label>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Student, Teacher, or Parent</span>
                        </div>
                        <div className="space-y-1.5">
                          <select
                            value={mapping.role}
                            onChange={(e) => setMapping(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="">Set Constant / Static Value --</option>
                            {rawHeaders.map((h, i) => (
                              <option key={i} value={h}>{h}</option>
                            ))}
                          </select>
                          
                          {!mapping.role && (
                            <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-md border border-indigo-100">
                              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Default:</span>
                              <select
                                value={defaults.role}
                                onChange={(e: any) => setDefaults(prev => ({ ...prev, role: e.target.value }))}
                                className="bg-transparent font-bold text-indigo-700 text-[11px] focus:outline-none"
                              >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher (Faculty)</option>
                                <option value="parent">Parent Monitor</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Grade mapping */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
                        <div>
                          <label className="font-bold text-slate-800">Grade / Class</label>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Used for student accounts</span>
                        </div>
                        <div className="space-y-1.5">
                          <select
                            value={mapping.grade}
                            onChange={(e) => setMapping(prev => ({ ...prev, grade: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none"
                          >
                            <option value="">Set Constant / Static Value --</option>
                            {rawHeaders.map((h, i) => (
                              <option key={i} value={h}>{h}</option>
                            ))}
                          </select>
                          
                          {!mapping.grade && (
                            <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-md border border-indigo-100">
                              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Default:</span>
                              <input
                                type="text"
                                value={defaults.grade}
                                onChange={(e) => setDefaults(prev => ({ ...prev, grade: e.target.value }))}
                                className="bg-transparent font-bold text-indigo-700 text-[11px] focus:outline-none w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Section mapping */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
                        <div>
                          <label className="font-bold text-slate-800">Class Section</label>
                          <span className="text-[10px] text-slate-400 block mt-0.5">e.g. Section A</span>
                        </div>
                        <div className="space-y-1.5">
                          <select
                            value={mapping.section}
                            onChange={(e) => setMapping(prev => ({ ...prev, section: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none"
                          >
                            <option value="">Set Constant / Static Value --</option>
                            {rawHeaders.map((h, i) => (
                              <option key={i} value={h}>{h}</option>
                            ))}
                          </select>
                          
                          {!mapping.section && (
                            <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-md border border-indigo-100">
                              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Default:</span>
                              <input
                                type="text"
                                value={defaults.section}
                                onChange={(e) => setDefaults(prev => ({ ...prev, section: e.target.value }))}
                                className="bg-transparent font-bold text-indigo-700 text-[11px] focus:outline-none w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subjects mapping */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
                        <div>
                          <label className="font-bold text-slate-800">Subjects Specializations</label>
                          <span className="text-[10px] text-slate-400 block mt-0.5">For Teachers, separated by ';'</span>
                        </div>
                        <div className="space-y-1.5">
                          <select
                            value={mapping.subjects}
                            onChange={(e) => setMapping(prev => ({ ...prev, subjects: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none"
                          >
                            <option value="">Set Constant / Static Value --</option>
                            {rawHeaders.map((h, i) => (
                              <option key={i} value={h}>{h}</option>
                            ))}
                          </select>
                          
                          {!mapping.subjects && (
                            <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-md border border-indigo-100">
                              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Default:</span>
                              <input
                                type="text"
                                value={defaults.subjects}
                                onChange={(e) => setDefaults(prev => ({ ...prev, subjects: e.target.value }))}
                                className="bg-transparent font-bold text-indigo-700 text-[11px] focus:outline-none w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Quick Source Data Inspection Column */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-indigo-950 text-indigo-100 rounded-2xl p-5 shadow-xs h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 pb-2.5 border-b border-indigo-900 text-xs font-bold uppercase tracking-wide text-indigo-200">
                        <Table className="w-4 h-4" />
                        <span>Source Columns Preview</span>
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-indigo-300">
                        The loaded CSV file has <span className="font-mono text-white font-bold">{rawHeaders.length} headers</span> and <span className="font-mono text-white font-bold">{rawRows.length} data rows</span>. Ensure name and email are associated to avoid validation errors.
                      </p>
                      
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9.5px] uppercase font-bold text-indigo-400">Headers Detected:</span>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                          {rawHeaders.map((h, idx) => {
                            const isMapped = Object.values(mapping).includes(h);
                            return (
                              <span 
                                key={idx} 
                                className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${isMapped ? 'bg-indigo-500/30 text-white border border-indigo-400/40' : 'bg-indigo-900/60 text-indigo-300 border border-transparent'}`}
                              >
                                {h}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 space-y-2">
                      <div className="text-[10.5px] text-indigo-300 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Auto-detect matched {Object.values(mapping).filter(Boolean).length} of {Object.keys(mapping).length} standard fields.</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (!mapping.name || !mapping.email) {
                            alert("Please assign a CSV column for both 'Full Name' and 'Email Address' to proceed.");
                            return;
                          }
                          generatePreviewRows();
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>Apply & Preview Rows</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW, EDIT & ONBOARD */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">Live Preview & Validation Diagnostics</h4>
                  <p className="text-[11px] text-slate-500">
                    Review and verify records before database writing. You can edit cells directly inside the table to fix validation problems instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500">Diagnostics:</span>
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-100 text-[10px]">
                    {previewRows.filter(r => r.isValid).length} Valid
                  </span>
                  {previewRows.filter(r => !r.isValid).length > 0 && (
                    <span className="bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-100 text-[10px] flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      <span>{previewRows.filter(r => !r.isValid).length} Errors</span>
                    </span>
                  )}
                </div>
              </div>

              {previewRows.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                  All rows have been processed or deleted. Upload another CSV file to proceed.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase border-b border-slate-150 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 w-10 text-center">Status</th>
                        <th className="p-3 min-w-[150px]">Full Name</th>
                        <th className="p-3 min-w-[180px]">Email Address</th>
                        <th className="p-3 w-36">Role</th>
                        <th className="p-3 w-32">Grade (Student)</th>
                        <th className="p-3 w-28">Section</th>
                        <th className="p-3 min-w-[120px]">Subjects (Teacher)</th>
                        <th className="p-3 w-10 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                      {previewRows.map((row) => (
                        <tr 
                          key={row.id} 
                          className={`hover:bg-slate-50/50 transition-colors ${row.isValid ? '' : 'bg-red-50/20'}`}
                        >
                          {/* Diagnostic Icon */}
                          <td className="p-3 text-center">
                            {row.isValid ? (
                              <span className="inline-flex text-emerald-600" title="Valid record ready for import">
                                <CheckCircle className="w-4 h-4" />
                              </span>
                            ) : (
                              <span 
                                className="inline-flex text-red-500 cursor-help" 
                                title={row.errors.join(', ')}
                              >
                                <AlertCircle className="w-4 h-4" />
                              </span>
                            )}
                          </td>

                          {/* Editable Name */}
                          <td className="p-1">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => handleRowChange(row.id, { name: e.target.value })}
                              className={`w-full bg-transparent border-0 px-2 py-2 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 text-xs font-semibold text-slate-800 ${!row.name.trim() ? 'bg-red-50 border border-red-200/50' : ''}`}
                            />
                          </td>

                          {/* Editable Email */}
                          <td className="p-1">
                            <input
                              type="email"
                              value={row.email}
                              onChange={(e) => handleRowChange(row.id, { email: e.target.value })}
                              className={`w-full bg-transparent border-0 px-2 py-2 rounded font-mono text-[10.5px] focus:bg-white focus:ring-1 focus:ring-indigo-500 ${(!row.email || !/\S+@\S+\.\S+/.test(row.email)) ? 'bg-red-50 border border-red-200/50' : ''}`}
                            />
                          </td>

                          {/* Editable Role */}
                          <td className="p-1">
                            <select
                              value={row.role}
                              onChange={(e: any) => handleRowChange(row.id, { role: e.target.value })}
                              className="bg-transparent border-0 px-2 py-2 rounded text-[11px] font-bold text-slate-700 focus:bg-white focus:ring-1 focus:ring-indigo-500 w-full"
                            >
                              <option value="student">👦 Student</option>
                              <option value="teacher">👨‍🏫 Teacher</option>
                              <option value="parent">👨 Parent</option>
                            </select>
                          </td>

                          {/* Editable Grade */}
                          <td className="p-1">
                            <input
                              type="text"
                              disabled={row.role !== 'student'}
                              value={row.role === 'student' ? row.grade : '-'}
                              onChange={(e) => handleRowChange(row.id, { grade: e.target.value })}
                              className={`w-full bg-transparent border-0 px-2 py-2 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 text-xs ${row.role !== 'student' ? 'text-slate-300 cursor-not-allowed' : 'font-medium'}`}
                            />
                          </td>

                          {/* Editable Section */}
                          <td className="p-1">
                            <input
                              type="text"
                              disabled={row.role !== 'student'}
                              value={row.role === 'student' ? row.section : '-'}
                              onChange={(e) => handleRowChange(row.id, { section: e.target.value })}
                              className={`w-full bg-transparent border-0 px-2 py-2 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 text-xs ${row.role !== 'student' ? 'text-slate-300 cursor-not-allowed' : 'font-medium'}`}
                            />
                          </td>

                          {/* Editable Subjects */}
                          <td className="p-1">
                            <input
                              type="text"
                              disabled={row.role !== 'teacher'}
                              value={row.role === 'teacher' ? row.subjects.join('; ') : '-'}
                              onChange={(e) => handleRowChange(row.id, { subjects: e.target.value.split(';').map(s => s.trim()).filter(Boolean) })}
                              className={`w-full bg-transparent border-0 px-2 py-2 rounded focus:bg-white focus:ring-1 focus:ring-indigo-500 text-xs ${row.role !== 'teacher' ? 'text-slate-300 cursor-not-allowed' : 'font-mono text-[10px]'}`}
                            />
                          </td>

                          {/* Action Trash button */}
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRowDelete(row.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bottom validation alert box if errors exist */}
              {previewRows.some(r => !r.isValid) && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 animate-slideDown">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Invalid Records Detected</p>
                    <p className="text-[10.5px] mt-0.5 leading-relaxed">
                      Please fix the rows containing red alert badges above (e.g. enter non-empty names or correct secure email syntaxes) directly inside the textboxes. Committing now will only register the valid entries.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (step === 3) {
                setStep(2);
              } else if (step === 2) {
                setStep(1);
                setCsvFileName('');
                setRawHeaders([]);
                setRawRows([]);
              } else {
                onClose();
              }
            }}
            className="border border-slate-250 hover:bg-slate-100 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            {step === 1 ? 'Cancel' : 'Back Step'}
          </button>

          <div className="flex gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => { resetModal(); onClose(); }}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-3 py-2"
              >
                Close Portal
              </button>
            )}

            {step === 3 ? (
              <button
                type="button"
                onClick={handleCommitUpload}
                disabled={previewRows.filter(r => r.isValid).length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Onboard {previewRows.filter(r => r.isValid).length} Valid Members</span>
              </button>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
}
