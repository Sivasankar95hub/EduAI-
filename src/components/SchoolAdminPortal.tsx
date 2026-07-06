/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSaaSState } from '../lib/stateStore';
import { SUBSCRIPTION_PLANS } from '../lib/mockData';
import { BulkUploadModal } from './BulkUploadModal';
import { 
  Users, Key, ShieldAlert, CreditCard, Award, 
  Calendar, FileText, Plus, Check, CheckCircle,
  GraduationCap, TrendingUp, Eye, Trash2, Heart,
  BookOpen, AlertCircle, UploadCloud, Download, FileSpreadsheet
} from 'lucide-react';

export default function SchoolAdminPortal() {
  const { 
    activeSchool, 
    allUsers, 
    updateSubscription, 
    currentUser, 
    schools,
    addUser,
    deleteUser,
    observations,
    addObservation,
    deleteObservation,
    scholarships,
    addNotification
  } = useSaaSState();

  const [activeTab, setActiveTab] = useState<'users' | 'teachers' | 'students' | 'parents' | 'performance' | 'observations' | 'billing' | 'timetable'>('users');

  // Multi-school subscription states
  const [selectedPlanId, setSelectedPlanId] = useState<'trial' | 'basic' | 'premium'>(activeSchool.subscriptionPlan);
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);

  // New User States
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'student' | 'teacher' | 'parent'>('student');

  // CSV Bulk Upload States
  const [onboardMethod, setOnboardMethod] = useState<'manual' | 'csv'>('manual');
  const [csvParsedRows, setCsvParsedRows] = useState<any[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [bulkImportSuccessCount, setBulkImportSuccessCount] = useState<number | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Observation Form States
  const [showObsForm, setShowObsForm] = useState(false);
  const [obsStudentId, setObsStudentId] = useState('');
  const [obsCategory, setObsCategory] = useState<'Academic' | 'Behavioral' | 'Skill Progression' | 'NEP Alignment' | 'Co-Curricular'>('Academic');
  const [obsComment, setObsComment] = useState('');
  const [obsSeverity, setObsSeverity] = useState<'Positive' | 'Neutral' | 'Action Needed'>('Positive');

  // School lists
  const schoolUsers = allUsers.filter(u => u.schoolId === activeSchool.id);
  const schoolTeachers = schoolUsers.filter(u => u.role === 'teacher');
  const schoolStudents = schoolUsers.filter(u => u.role === 'student');
  const schoolParents = schoolUsers.filter(u => u.role === 'parent');
  const schoolObservations = observations.filter(obs => schoolStudents.some(s => s.id === obs.studentId));

  // Trigger Mock Razorpay Payment
  const handleSimulateRazorpay = () => {
    setIsProcessingRazorpay(true);
    setTimeout(() => {
      updateSubscription(activeSchool.id, selectedPlanId);
      setIsProcessingRazorpay(false);
      setShowRazorpayModal(false);

      const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId)!;
      const basePrice = plan.priceINR;
      const gstAmount = Math.round(basePrice * 0.18);
      const totalAmount = basePrice + gstAmount;

      setInvoiceDetails({
        invoiceNo: `INV-${Date.now().toString().substring(6)}`,
        date: new Date().toISOString().split('T')[0],
        billingTo: activeSchool.name,
        address: activeSchool.address,
        planName: plan.name,
        period: plan.billingPeriod,
        basePrice,
        gstAmount,
        totalAmount,
        paymentStatus: 'PAID via Razorpay (Reference #pay_M12p78q9a3)',
        gstin: '27AAAAA1111A1Z1'
      });
      setShowInvoice(true);
      alert("Razorpay checkout successful! Subscription upgraded and GST Invoice generated.");
    }, 1500);
  };

  // Submit New User
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      alert("Please fill in Name and Email!");
      return;
    }
    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      schoolId: activeSchool.id,
      avatar: newUserRole === 'student' ? '👦' : newUserRole === 'teacher' ? '👨‍🏫' : '👨',
      grade: newUserRole === 'student' ? 'Class 9' : undefined,
      section: newUserRole === 'student' ? 'Section A' : undefined,
      streak: newUserRole === 'student' ? 1 : undefined,
      points: newUserRole === 'student' ? 100 : undefined,
      badges: newUserRole === 'student' ? ['First Steps'] : undefined,
      subjects: newUserRole === 'teacher' ? ['Artificial Intelligence'] : undefined
    });
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUser(false);
    alert(`Successfully registered new ${newUserRole}: ${newUserName}`);
  };

  // Simple robust CSV parser with quote support
  const parseCSVData = (text: string): string[][] => {
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

  const handleCSVFileChange = (file: File) => {
    if (!file) return;
    setCsvFileName(file.name);
    setCsvError(null);
    setBulkImportSuccessCount(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          setCsvError("The file appears to be empty.");
          return;
        }
        
        const rawRows = parseCSVData(text);
        if (rawRows.length < 2) {
          setCsvError("Invalid CSV format. Ensure the CSV contains at least a header row and one data row.");
          return;
        }

        const headers = rawRows[0].map(h => h.toLowerCase().trim());
        
        // Find index of required and optional fields
        const nameIdx = headers.indexOf('name');
        const emailIdx = headers.indexOf('email');
        const roleIdx = headers.indexOf('role');
        const gradeIdx = headers.indexOf('grade');
        const sectionIdx = headers.indexOf('section');
        const subjectsIdx = headers.indexOf('subjects');

        if (nameIdx === -1 || emailIdx === -1 || roleIdx === -1) {
          setCsvError("Required headers 'Name', 'Email', and 'Role' were not found in the CSV file.");
          return;
        }

        const parsedRows = rawRows.slice(1).map((row, index) => {
          const name = row[nameIdx]?.trim() || '';
          const email = row[emailIdx]?.trim() || '';
          const rawRole = row[roleIdx]?.trim().toLowerCase() || '';
          const role = rawRole === 'teacher' ? 'teacher' : rawRole === 'student' ? 'student' : rawRole === 'parent' ? 'parent' : rawRole;
          
          const grade = gradeIdx !== -1 ? row[gradeIdx]?.trim() : '';
          const section = sectionIdx !== -1 ? row[sectionIdx]?.trim() : '';
          const rawSubjects = subjectsIdx !== -1 ? row[subjectsIdx]?.trim() : '';
          const subjects = rawSubjects ? rawSubjects.split(';').map(s => s.trim()).filter(Boolean) : [];

          // Validation
          const errors: string[] = [];
          if (!name) errors.push("Name is required");
          if (!email) {
            errors.push("Email is required");
          } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push("Invalid email format");
          }
          if (role !== 'student' && role !== 'teacher' && role !== 'parent') {
            errors.push("Role must be 'student', 'teacher', or 'parent'");
          }

          return {
            id: index,
            name,
            email,
            role,
            grade: grade || (role === 'student' ? 'Class 9' : undefined),
            section: section || (role === 'student' ? 'Section A' : undefined),
            subjects: subjects.length > 0 ? subjects : (role === 'teacher' ? ['Artificial Intelligence'] : undefined),
            errors,
            isValid: errors.length === 0
          };
        });

        setCsvParsedRows(parsedRows);
      } catch (err: any) {
        setCsvError(`Error reading file: ${err.message || 'unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = (roleType: 'student' | 'teacher' | 'unified') => {
    let csvContent = '';
    let fileName = '';

    if (roleType === 'student') {
      csvContent = "Name,Email,Role,Grade,Section\n" +
                   "Aarav Patel,aarav@school.edu,student,Class 9,Section A\n" +
                   "Ishita Sharma,ishita@school.edu,student,Class 9,Section B";
      fileName = "Student_Bulk_Template.csv";
    } else if (roleType === 'teacher') {
      csvContent = "Name,Email,Role,Subjects\n" +
                   "Suman Sharma,suman@school.edu,teacher,Artificial Intelligence;Python Basics\n" +
                   "Rahul Varma,rahul@school.edu,teacher,Data Science;Mathematics";
      fileName = "Teacher_Bulk_Template.csv";
    } else {
      csvContent = "Name,Email,Role,Grade,Section,Subjects\n" +
                   "Aarav Patel,aarav@school.edu,student,Class 9,Section A,\n" +
                   "Suman Sharma,suman@school.edu,teacher,,,Artificial Intelligence;Python Basics\n" +
                   "Meera Roy,meera@school.edu,parent,,,";
      fileName = "Unified_School_Template.csv";
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

  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validRows = csvParsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      alert("No valid rows found to import!");
      return;
    }

    validRows.forEach(row => {
      addUser({
        name: row.name,
        email: row.email,
        role: row.role,
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

    setBulkImportSuccessCount(validRows.length);
    alert(`Successfully bulk onboarded ${validRows.length} users into ${activeSchool.name}!`);
    setCsvParsedRows([]);
    setCsvFileName('');
    setShowAddUser(false);
  };

  // Handle Observation Submission
  const handleAddObservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = schoolStudents.find(s => s.id === obsStudentId);
    if (!student || !obsComment.trim()) {
      alert("Please select a student and provide a comment!");
      return;
    }
    addObservation({
      studentId: obsStudentId,
      studentName: student.name,
      observedBy: `${currentUser.name} (Principal)`,
      date: new Date().toISOString().split('T')[0],
      category: obsCategory,
      comment: obsComment,
      severity: obsSeverity
    });
    setObsComment('');
    setObsStudentId('');
    setShowObsForm(false);
    alert(`Official Observation recorded successfully for ${student.name}!`);
  };

  // Handle User Deletion
  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to delete profile for ${name}? This action cannot be undone.`)) {
      deleteUser(userId);
      alert(`Successfully deleted profile: ${name}`);
    }
  };

  return (
    <div id="school-admin-dashboard-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* School Admin Navigation Sidebar */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
        <div className="pb-3 border-b border-gray-50 text-center lg:text-left">
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">School Administrator</span>
          <h3 className="font-bold text-gray-900 text-sm mt-1">{activeSchool.name}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Campus: {activeSchool.address.split(',')[0]}</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-4 h-4" />
            <span>Overview & Add User</span>
          </button>
          
          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'teachers' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teachers Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'students' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Students Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('parents')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'parents' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Heart className="w-4 h-4" />
            <span>Parents Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'performance' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Performance & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('observations')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'observations' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Principal Observations</span>
          </button>

          <div className="pt-2 my-2 border-t border-gray-100"></div>

          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'billing' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CreditCard className="w-4 h-4" />
            <span>SaaS Subscription</span>
          </button>
          
          <button
            onClick={() => setActiveTab('timetable')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'timetable' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timetable Control</span>
          </button>
        </nav>
      </div>

      {/* Main Feature Content Area */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        
        {/* OVERVIEW / USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">School Roster Command</h2>
                <p className="text-xs text-gray-500">Overview of student admissions, active faculties, and parent monitor accounts.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsBulkUploadOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Smart Bulk Upload (CSV)</span>
                </button>
                <button
                  onClick={() => setShowAddUser(!showAddUser)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New User</span>
                </button>
              </div>
            </div>

            {/* Metrics Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Onboarded Teachers</span>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-slate-900">{schoolTeachers.length}</span>
                  <span className="text-lg">👨‍🏫</span>
                </div>
                <p className="text-[10px] text-slate-400">CBSE certified AI & Technology instructors</p>
              </div>

              <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Registered Students</span>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-slate-900">{schoolStudents.length}</span>
                  <span className="text-lg">👦</span>
                </div>
                <p className="text-[10px] text-slate-400">Pursuing 21st century tech electives</p>
              </div>

              <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Parent Monitors</span>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-slate-900">{schoolParents.length}</span>
                  <span className="text-lg">👨‍👩‍👦</span>
                </div>
                <p className="text-[10px] text-slate-400">With digital dashboard progress tracking</p>
              </div>
            </div>

            {/* Quick Add User / Bulk CSV Upload Form */}
            {showAddUser && (
              <div className="bg-slate-50 border border-indigo-100 p-5 rounded-2xl space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-indigo-50/60">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                      <Users className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-none">Register Campus Members</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Add new students or faculties to active school roster</p>
                    </div>
                  </div>

                  {/* Onboarding Method Tabs */}
                  <div className="flex bg-slate-200/60 p-1 rounded-xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setOnboardMethod('manual');
                        setBulkImportSuccessCount(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${onboardMethod === 'manual' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Individual Member
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOnboardMethod('csv');
                        setBulkImportSuccessCount(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${onboardMethod === 'csv' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Bulk CSV Upload</span>
                    </button>
                  </div>
                </div>

                {onboardMethod === 'manual' ? (
                  /* Manual Form */
                  <form onSubmit={handleAddUserSubmit} className="space-y-4 max-w-md">
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alok Roy"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. alok.roy@nepfuture.edu"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Role Classification</label>
                        <select
                          value={newUserRole}
                          onChange={(e: any) => setNewUserRole(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none font-medium"
                        >
                          <option value="student">Student Account</option>
                          <option value="teacher">Teacher (Faculty)</option>
                          <option value="parent">Parent Monitor</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                      >
                        Register User Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddUser(false)}
                        className="border border-slate-200 text-slate-500 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Bulk CSV Onboarding */
                  <div className="space-y-4">
                    {/* Pre-defined Templates Downloads */}
                    <div className="bg-slate-100/50 p-3.5 rounded-xl border border-slate-200/50 space-y-2">
                      <p className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1.5 font-sans">
                        <Download className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Pre-defined Templates Download</span>
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Choose the pre-formatted CSV template below. Ensure columns match the exact titles in your final file.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        <button
                          type="button"
                          onClick={() => downloadTemplate('student')}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Download className="w-3 h-3 text-emerald-500" />
                          <span>Student Template</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadTemplate('teacher')}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Download className="w-3 h-3 text-indigo-500" />
                          <span>Teacher Template</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadTemplate('unified')}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Download className="w-3 h-3 text-amber-500" />
                          <span>Unified Template</span>
                        </button>
                      </div>
                    </div>

                    {/* Drag-and-Drop Area */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleCSVFileChange(file);
                      }}
                      onClick={() => document.getElementById('csv-file-input')?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragOver
                          ? 'border-indigo-500 bg-indigo-50/40'
                          : csvFileName
                          ? 'border-emerald-300 bg-emerald-50/10 hover:bg-emerald-50/20'
                          : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/30'
                      }`}
                    >
                      <input
                        id="csv-file-input"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCSVFileChange(file);
                        }}
                      />
                      
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <UploadCloud className={`w-10 h-10 ${csvFileName ? 'text-emerald-500' : 'text-indigo-400'}`} />
                        <div>
                          {csvFileName ? (
                            <p className="text-xs font-bold text-slate-800">
                              Selected file: <span className="font-mono text-indigo-600 font-extrabold">{csvFileName}</span>
                            </p>
                          ) : (
                            <p className="text-xs font-bold text-slate-600">
                              Drag and drop your CSV file here, or <span className="text-indigo-600 underline">browse computer</span>
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1">Supports standard CSV format with headers: Name, Email, Role, etc.</p>
                        </div>
                      </div>
                    </div>

                    {/* File Error Box */}
                    {csvError && (
                      <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2 text-xs text-red-700 animate-slideDown">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Parsing Error</p>
                          <p className="text-[10px] mt-0.5">{csvError}</p>
                        </div>
                      </div>
                    )}

                    {/* Success Count Feedback */}
                    {bulkImportSuccessCount !== null && (
                      <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold">Onboarding Complete!</p>
                          <p className="text-[10px] mt-0.5">Successfully imported {bulkImportSuccessCount} accounts into {activeSchool.name}.</p>
                        </div>
                      </div>
                    )}

                    {/* Parsed Rows Verification Preview */}
                    {csvParsedRows.length > 0 && (
                      <div className="space-y-2.5 animate-fadeIn">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-600 uppercase tracking-wide text-[10px]">
                            Roster Preview ({csvParsedRows.length} Rows Detected)
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {csvParsedRows.filter(r => r.isValid).length} Valid • {csvParsedRows.filter(r => !r.isValid).length} Errors
                          </span>
                        </div>

                        {/* Verification Table */}
                        <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-56 bg-white shadow-xs">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-500 font-bold uppercase sticky top-0">
                                <th className="p-2.5">Name</th>
                                <th className="p-2.5">Email</th>
                                <th className="p-2.5">Role</th>
                                <th className="p-2.5">Properties</th>
                                <th className="p-2.5 text-center">Status</th>
                                <th className="p-2.5 text-right">Delete</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px] font-sans">
                              {csvParsedRows.map((row) => (
                                <tr key={row.id} className={`${row.isValid ? 'hover:bg-slate-50/50' : 'bg-red-50/30'}`}>
                                  <td className="p-2.5 font-semibold text-slate-800">{row.name || <span className="text-red-500 italic">Empty</span>}</td>
                                  <td className="p-2.5 font-mono text-[10px] text-slate-500">{row.email || <span className="text-red-500 italic">Empty</span>}</td>
                                  <td className="p-2.5">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                      row.role === 'teacher' ? 'bg-blue-50 text-blue-700' :
                                      row.role === 'student' ? 'bg-purple-50 text-purple-700' :
                                      row.role === 'parent' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {row.role || 'unknown'}
                                    </span>
                                  </td>
                                  <td className="p-2.5 max-w-xs truncate text-[10px] text-slate-500">
                                    {row.role === 'student' && `${row.grade || 'Class 9'} • ${row.section || 'A'}`}
                                    {row.role === 'teacher' && `Subjects: ${row.subjects?.join(', ') || 'General'}`}
                                    {row.role !== 'student' && row.role !== 'teacher' && '-'}
                                  </td>
                                  <td className="p-2.5 text-center">
                                    {row.isValid ? (
                                      <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                        <Check className="w-2.5 h-2.5" /> Ready
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" title={row.errors.join(', ')}>
                                        ⚠️ {row.errors[0]}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCsvParsedRows(prev => prev.filter(r => r.id !== row.id));
                                      }}
                                      className="text-slate-400 hover:text-red-600 p-1"
                                      title="Remove from batch import"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={handleBulkImportSubmit}
                            disabled={csvParsedRows.filter(r => r.isValid).length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>Commit Bulk Onboarding ({csvParsedRows.filter(r => r.isValid).length} Valid Members)</span>
                          </button>
                          
                          <div className="flex gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => {
                                setCsvParsedRows([]);
                                setCsvFileName('');
                                setCsvError(null);
                              }}
                              className="border border-slate-200 text-slate-500 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                              Clear Data
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddUser(false)}
                              className="border border-slate-200 text-slate-500 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Combined Roster Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase">Recent Campus Registrations</h3>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="p-3">User Profile</th>
                      <th className="p-3">Role Classification</th>
                      <th className="p-3">Secure Email</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {schoolUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-slate-400">No registered users in this school yet. Use the Onboard button to create some.</td>
                      </tr>
                    ) : (
                      schoolUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-semibold flex items-center gap-2">
                            <span className="text-lg">{user.avatar}</span>
                            <span>{user.name}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              user.role === 'teacher' ? 'bg-blue-50 text-blue-700' :
                              user.role === 'parent' ? 'bg-amber-50 text-amber-700' :
                              'bg-purple-50 text-purple-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 font-mono text-[11px]">{user.email}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TEACHERS DIRECTORY TAB */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Faculty Directory</h2>
              <p className="text-xs text-gray-500">Track and manage tech-skilled faculties teaching artificial intelligence electives.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schoolTeachers.length === 0 ? (
                <div className="md:col-span-2 text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-sm font-semibold text-slate-600">No Teachers registered yet.</p>
                  <p className="text-xs text-slate-400">Go to the Overview tab and onboard a Teacher.</p>
                </div>
              ) : (
                schoolTeachers.map(teacher => (
                  <div key={teacher.id} className="border border-slate-200/60 bg-white p-4 rounded-xl shadow-xs space-y-3 relative hover:shadow-md transition-shadow">
                    <button
                      onClick={() => handleDeleteUser(teacher.id, teacher.name)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                      title="De-register teacher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-1 bg-slate-50 rounded-lg">{teacher.avatar}</span>
                      <div>
                        <h4 className="font-extrabold text-slate-950 text-sm leading-tight">{teacher.name}</h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{teacher.email}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Assigned Subject Realms:</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {teacher.subjects?.map((sub, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-100">
                            {sub}
                          </span>
                        )) || (
                          <span className="text-[10px] text-slate-400 italic">No subjects assigned. General Educator.</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* STUDENTS DIRECTORY TAB */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student Enrolment</h2>
                <p className="text-xs text-gray-500">Overview of learning streaks, accumulated Mind Points, and active badges.</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('observations');
                  setShowObsForm(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Record New Observation</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Grade Context</th>
                    <th className="p-3 text-center">Learning Streak</th>
                    <th className="p-3 text-center">Mind Points</th>
                    <th className="p-3">Earned Badges</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schoolStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">No students registered. Use Overview onboarding.</td>
                    </tr>
                  ) : (
                    schoolStudents.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 font-semibold flex items-center gap-2">
                          <span className="text-lg">{student.avatar}</span>
                          <span>{student.name}</span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">
                          {student.grade || 'Class 9'} • {student.section || 'A'}
                        </td>
                        <td className="p-3 text-center text-orange-600 font-black font-mono">
                          🔥 {student.streak || 0} days
                        </td>
                        <td className="p-3 text-center text-indigo-600 font-extrabold font-mono">
                          ⚡ {student.points || 0}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.badges?.map((badge, idx) => (
                              <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-100/50 text-[9px] font-bold px-1.5 py-0.5 rounded-full" title="Earned Badge Award">
                                🏆 {badge}
                              </span>
                            )) || <span className="text-slate-400 italic text-[10px]">No badges yet</span>}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setObsStudentId(student.id);
                                setObsCategory('Academic');
                                setActiveTab('observations');
                                setShowObsForm(true);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold border border-indigo-200 px-2 py-1 rounded bg-indigo-50/20 hover:bg-indigo-50 transition-all"
                              title="Write Behavioral/Academic Principal Observation Note"
                            >
                              Observe
                            </button>
                            <button
                              onClick={() => handleDeleteUser(student.id, student.name)}
                              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                              title="Expel Student File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PARENTS DIRECTORY TAB */}
        {activeTab === 'parents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Parent Guardians</h2>
              <p className="text-xs text-gray-500">Linked monitors who track student homework submissions and timed quiz records.</p>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-3">Parent Name</th>
                    <th className="p-3">Guardian Email</th>
                    <th className="p-3">Linked Ward</th>
                    <th className="p-3">Monitoring Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schoolParents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400">No registered parents in this school yet.</td>
                    </tr>
                  ) : (
                    schoolParents.map(parent => {
                      const linkedWard = schoolStudents.find(s => s.id === parent.childId);
                      return (
                        <tr key={parent.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-3 font-semibold flex items-center gap-2">
                            <span className="text-lg">{parent.avatar}</span>
                            <span>{parent.name}</span>
                          </td>
                          <td className="p-3 text-gray-600 font-mono text-[11px]">
                            {parent.email}
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {linkedWard ? (
                              <span className="flex items-center gap-1.5">
                                <span>{linkedWard.avatar}</span>
                                <strong>{linkedWard.name}</strong>
                                <span className="text-slate-400 font-normal">({linkedWard.grade})</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned Ward</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                              Linked
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(parent.id, parent.name)}
                              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                              title="Delete parent profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PERFORMANCE & ANALYTICS TAB */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">School Performance Insights</h2>
              <p className="text-xs text-gray-500">Real-time stats from automated CBSE curriculum tests and digital coursework assessments.</p>
            </div>

            {/* School KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-indigo-100/60 bg-indigo-50/10 p-5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Average Test Score</span>
                <div className="text-3xl font-extrabold text-slate-900">86.4%</div>
                <div className="text-[10px] text-slate-500 font-medium">Out of 12 CBSE standard quiz modules</div>
              </div>
              <div className="border border-indigo-100/60 bg-indigo-50/10 p-5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Coursework Compliance</span>
                <div className="text-3xl font-extrabold text-slate-900">92.5%</div>
                <div className="text-[10px] text-slate-500 font-medium">Homework tasks submitted on-time</div>
              </div>
              <div className="border border-indigo-100/60 bg-indigo-50/10 p-5 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Total Mind Points</span>
                <div className="text-3xl font-extrabold text-indigo-600 font-mono">
                  ⚡ {schoolStudents.reduce((sum, s) => sum + (s.points || 0), 0)}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Accumulated school-wide points</div>
              </div>
            </div>

            {/* Top Students Leaders */}
            <div className="border border-slate-150 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase text-indigo-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Elite Mind-Points Performers</span>
                </h3>
                <span className="text-[10px] text-slate-400">Top Rankers in active school</span>
              </div>

              <div className="space-y-3">
                {schoolStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No student analytics available.</p>
                ) : (
                  [...schoolStudents].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 3).map((student, rank) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                          rank === 0 ? 'bg-amber-100 text-amber-800' :
                          rank === 1 ? 'bg-slate-200 text-slate-800' :
                          'bg-amber-50 text-amber-900'
                        }`}>
                          {rank + 1}
                        </span>
                        <span className="text-sm">{student.avatar}</span>
                        <div className="leading-none">
                          <h4 className="font-bold text-slate-900 text-xs">{student.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">{student.grade} • {student.section}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-indigo-600">⚡ {student.points} pts</span>
                        <p className="text-[9px] text-orange-600 font-bold mt-0.5">🔥 {student.streak} Day Streak</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACADEMIC OBSERVATIONS REGISTER TAB */}
        {activeTab === 'observations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Principal's Academic Observations</h2>
                <p className="text-xs text-gray-500">Record, track, and maintain qualitative reports regarding student competency mapping.</p>
              </div>
              <button
                onClick={() => setShowObsForm(!showObsForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Observation Entry</span>
              </button>
            </div>

            {/* Record New Observation Box */}
            {showObsForm && (
              <form onSubmit={handleAddObservationSubmit} className="bg-slate-50 border border-indigo-100 p-5 rounded-2xl space-y-4 max-w-lg animate-fadeIn">
                <h3 className="text-xs font-bold uppercase text-indigo-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Draft Official Campus Observation</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Select Student</label>
                    <select
                      required
                      value={obsStudentId}
                      onChange={(e) => setObsStudentId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none font-semibold text-slate-800"
                    >
                      <option value="">-- Choose student profile --</option>
                      {schoolStudents.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Observation Class</label>
                      <select
                        value={obsCategory}
                        onChange={(e: any) => setObsCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none font-medium"
                      >
                        <option value="Academic">Academic Achievement</option>
                        <option value="Behavioral">Behavioral Conduct</option>
                        <option value="Skill Progression">Skill Progression</option>
                        <option value="NEP Alignment">NEP Skill Mapping</option>
                        <option value="Co-Curricular">Co-Curricular/Sports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Severity Rating</label>
                      <select
                        value={obsSeverity}
                        onChange={(e: any) => setObsSeverity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none font-medium"
                      >
                        <option value="Positive">Positive (Excellence Award)</option>
                        <option value="Neutral">Neutral (General Note)</option>
                        <option value="Action Needed">Action Required (Needs Improvement)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Principal's Evaluation Review Notes</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Exhibited exceptional skill sorting Python arrays using code logic in Class 9 assessment."
                      value={obsComment}
                      onChange={(e) => setObsComment(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowObsForm(false)}
                    className="border border-slate-200 text-slate-500 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    Post Evaluation Report
                  </button>
                </div>
              </form>
            )}

            {/* Observations Registry Grid */}
            <div className="space-y-4">
              {schoolObservations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No principal observations logged.</p>
                  <p className="text-xs text-slate-400">Click Add Observation Entry to log official feedback.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schoolObservations.map(obs => (
                    <div key={obs.id} className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 space-y-3 relative hover:shadow-xs transition-shadow">
                      <button
                        onClick={() => deleteObservation(obs.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete observation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            obs.severity === 'Positive' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                            obs.severity === 'Action Needed' ? 'bg-rose-50 text-rose-800 border border-rose-100' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {obs.category} • {obs.severity}
                          </span>
                          <h4 className="font-bold text-slate-950 text-xs mt-2">Subject: {obs.studentName}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{obs.date}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-normal italic">
                        "{obs.comment}"
                      </p>

                      <p className="text-[10px] text-indigo-700 font-bold text-right pt-1.5 border-t border-slate-100">
                        Observed by: {obs.observedBy}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BILLING & SUBSCRIPTION TAB */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">EduMind School Subscription Control</h2>
              <p className="text-xs text-gray-500">Secure subscription tiers featuring automatic billing with GST invoice generation.</p>
            </div>

            {/* Current Plan Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">Current Status</p>
                <h3 className="text-lg font-bold text-gray-900 capitalize mt-1">Active Plan: {activeSchool.subscriptionPlan} Tier</h3>
                <p className="text-xs text-gray-500 mt-1">Capacity Limit: Up to {activeSchool.studentCount} Students Active</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Active & Compliant</span>
                <p className="text-[10px] text-gray-400 mt-1.5 font-medium">Valid until: {activeSchool.subscriptionExpiry}</p>
              </div>
            </div>

            {/* Pricing Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrent = activeSchool.subscriptionPlan === plan.id;

                return (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`border rounded-xl p-5 cursor-pointer flex flex-col justify-between transition-all select-none ${isSelected ? 'border-indigo-600 ring-1 ring-indigo-100 shadow-sm bg-indigo-50/10' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-xs text-indigo-900">{plan.name}</h4>
                        {isCurrent && <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase">Current</span>}
                      </div>
                      <div className="text-lg font-bold text-gray-900 pt-1.5">
                        ₹{plan.priceINR.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/{plan.billingPeriod}</span>
                      </div>
                      <ul className="space-y-1.5 mt-4 text-[10.5px] text-gray-500">
                        {plan.features.map((feat, fidx) => (
                          <li key={fidx} className="flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 mt-auto">
                      {!isCurrent && isSelected && (
                        <button
                          onClick={() => setShowRazorpayModal(true)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                          Checkout with Razorpay
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Razorpay Simulation Modal */}
            {showRazorpayModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 space-y-5 shadow-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <span>Razorpay Checkout Gateway</span>
                    </h3>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <p className="text-xs text-gray-500">Upgrading subscription for:</p>
                    <p className="text-xs font-bold text-gray-900">{activeSchool.name}</p>
                    <p className="text-xs text-gray-500">Target Plan: <span className="font-bold text-indigo-600 uppercase">{selectedPlanId}</span></p>
                    <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-xs font-bold">
                      <span>Total Invoice Due (+18% GST):</span>
                      <span>₹{(SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId)!.priceINR * 1.18).toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateRazorpay}
                    disabled={isProcessingRazorpay}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessingRazorpay ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>Simulate Secure Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Generated GST-Ready Invoice */}
            {showInvoice && invoiceDetails && (
              <div className="border border-indigo-200 bg-white rounded-2xl p-6 space-y-5 shadow-sm">
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 max-w-max">
                      <CheckCircle className="w-3.5 h-3.5" /> GST Invoice Generated
                    </span>
                    <h3 className="text-sm font-bold text-indigo-900 mt-2">EduMind AI Platform SaaS Invoice</h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">Invoice #: {invoiceDetails.invoiceNo}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold text-gray-800">Date: {invoiceDetails.date}</p>
                    <p className="text-gray-500">GSTIN: {invoiceDetails.gstin}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Billing To:</h4>
                    <p className="font-bold text-gray-800">{invoiceDetails.billingTo}</p>
                    <p className="text-gray-500 mt-0.5">{invoiceDetails.address}</p>
                  </div>
                  <div className="md:text-right">
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Receipt Summary:</h4>
                    <p className="font-bold text-emerald-700">{invoiceDetails.paymentStatus}</p>
                  </div>
                </div>

                <table className="w-full text-left text-xs border-t border-b border-gray-100 my-4">
                  <thead>
                    <tr className="text-gray-400 font-semibold uppercase text-[10px]">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-right">Taxable Value</th>
                      <th className="py-2 text-right">CGST (9%)</th>
                      <th className="py-2 text-right">SGST (9%)</th>
                      <th className="py-2 text-right font-bold">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    <tr>
                      <td className="py-3 font-semibold">EduMind AI SaaS Subscription - {invoiceDetails.planName} ({invoiceDetails.period})</td>
                      <td className="py-3 text-right">₹{invoiceDetails.basePrice.toLocaleString()}</td>
                      <td className="py-3 text-right">₹{(invoiceDetails.gstAmount / 2).toLocaleString()}</td>
                      <td className="py-3 text-right">₹{(invoiceDetails.gstAmount / 2).toLocaleString()}</td>
                      <td className="py-3 text-right font-bold">₹{invoiceDetails.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between items-center text-xs pt-2">
                  <p className="text-gray-500 italic">This is an automatically generated GST invoice confirming secure checkout via Razorpay integration.</p>
                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([JSON.stringify(invoiceDetails, null, 2)], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `Invoice-${invoiceDetails.invoiceNo}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="border border-gray-200 text-gray-700 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-gray-50"
                  >
                    Download Invoice (.txt)
                  </button>
                </div>
              </div>
            )}

            {/* CAMPUS SCHOLARSHIPS SECTION */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-lg">🎓</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Campus AI Scholarships & Equity Grants</h3>
                    <p className="text-[11px] text-gray-400">Premium licenses funded by the Super Admin's Central Inclusivity Reserve.</p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 font-bold">
                  Active Subsidies: {scholarships.filter(s => s.schoolId === activeSchool.id).length}
                </div>
              </div>

              {scholarships.filter(s => s.schoolId === activeSchool.id).length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  <p className="font-medium text-slate-500 mb-1">No Active Campus Subsidies</p>
                  <p className="text-[10.5px] max-w-md mx-auto leading-relaxed">
                    No active equity scholarships are currently registered on your campus. To nominate an underprivileged student or underfunded teacher for a premium license subsidy, use the fast-track requisition form below.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 rounded-xl bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-500 font-bold uppercase">
                        <th className="p-2.5">Beneficiary Name</th>
                        <th className="p-2.5">Role Classification</th>
                        <th className="p-2.5 text-center">Subsidy Percentage</th>
                        <th className="p-2.5 text-right font-bold">Disbursed Grant Value</th>
                        <th className="p-2.5 text-center">Approved Date</th>
                        <th className="p-2.5 text-right font-bold">Billing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                      {scholarships.filter(s => s.schoolId === activeSchool.id).map((sch: any) => (
                        <tr key={sch.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-800">{sch.beneficiaryName}</td>
                          <td className="p-2.5">
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${sch.role === 'student' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                              {sch.role}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-bold font-mono text-emerald-600">{sch.discountPercent}% OFF</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{sch.fundDisbursed.toLocaleString()}</td>
                          <td className="p-2.5 text-center text-slate-400 font-mono">{sch.date}</td>
                          <td className="p-2.5 text-right">
                            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wide">
                              Fully Subsidized
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Nomination Requisition Form */}
              <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4.5 space-y-3 mt-4">
                <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  📝 Nominate Underprivileged Student / Teacher
                </h4>
                <p className="text-[10.5px] text-gray-500 leading-relaxed">
                  Apply for a license subsidy from the central reserve fund to accommodate poor students or rural teachers who require access to modern international AI learning curriculum materials.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <input
                    id="nom-name"
                    type="text"
                    placeholder="Beneficiary Full Name"
                    className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                  />
                  <select
                    id="nom-role"
                    className="bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-medium"
                  >
                    <option value="student">Student Nomination</option>
                    <option value="teacher">Teacher Nomination</option>
                  </select>
                  <button
                    onClick={() => {
                      const nameInput = document.getElementById("nom-name") as HTMLInputElement;
                      const roleInput = document.getElementById("nom-role") as HTMLSelectElement;
                      if (!nameInput || !nameInput.value.trim()) {
                        alert("Please enter a beneficiary name first.");
                        return;
                      }
                      
                      alert(`Thank you! Nomination for "${nameInput.value}" as a ${roleInput.value} has been securely submitted to the Central Inclusivity escrow queue. The Super Admin will review resources and disburse balance credits shortly.`);
                      nameInput.value = "";
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-xs animate-pulseFast"
                  >
                    Submit Requisition Nominee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIMETABLE TAB */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Academic Timetable Control</h2>
              <p className="text-xs text-gray-500">Plan and review schedules for AI electives and digital literacy modules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 border border-gray-100 rounded-2xl overflow-hidden text-xs">
              <div className="border-r border-b md:border-b-0 border-gray-100 bg-slate-50 p-4 font-semibold text-gray-500 uppercase tracking-wider">
                Monday
              </div>
              <div className="border-r border-b md:border-b-0 border-gray-100 p-4 space-y-2">
                <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded text-[9px]">09:00 - 10:00</span>
                <p className="font-bold text-gray-800">Introduction to AI</p>
                <p className="text-[10px] text-gray-400">Class 9 (Sec A)</p>
              </div>
              <div className="border-r border-b md:border-b-0 border-gray-100 p-4 space-y-2 bg-slate-50/10">
                <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded text-[9px]">10:15 - 11:15</span>
                <p className="font-bold text-gray-800">Python Basics</p>
                <p className="text-[10px] text-gray-400">Class 10 (Sec B)</p>
              </div>
              <div className="border-r border-b md:border-b-0 border-gray-100 p-4 space-y-2">
                <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded text-[9px]">11:30 - 12:30</span>
                <p className="font-bold text-gray-800">21st Century Skills</p>
                <p className="text-[10px] text-gray-400">Class 8 (Sec C)</p>
              </div>
              <div className="p-4 space-y-2 bg-slate-50/10">
                <span className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded text-[9px]">13:30 - 14:30</span>
                <p className="font-bold text-gray-800">AI Project Lab</p>
                <p className="text-[10px] text-gray-400">Class 9 (Sec A)</p>
              </div>
            </div>
          </div>
        )}

      </div>

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        activeSchool={activeSchool}
        addUser={addUser}
        addNotification={addNotification}
      />
    </div>
  );
}
