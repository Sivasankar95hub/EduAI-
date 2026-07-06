/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSaaSState } from '../lib/stateStore';
import { 
  PlusCircle, Sparkles, FileText, CheckSquare, BarChart2, 
  MessageSquare, Users, Trash, Award, Clock
} from 'lucide-react';

export default function TeacherPortal() {
  const { 
    currentUser, 
    homeworks, 
    addHomework, 
    gradeHomework, 
    addContent, 
    contentList 
  } = useSaaSState();

  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'homework' | 'ai_gen' | 'eval' | 'messages'>('dashboard');

  // AI Worksheet Generator State
  const [genTopic, setGenTopic] = useState('Introduction to Deep Learning');
  const [genGrade, setGenGrade] = useState('Class 10');
  const [genDiff, setGenDiff] = useState('Medium');
  const [generatedSheet, setGeneratedSheet] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Homework Builder State
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwSubject, setHwSubject] = useState('Artificial Intelligence');
  const [hwGrade, setHwGrade] = useState('Class 9');
  const [hwDate, setHwDate] = useState('2026-07-15');

  // Eval / Grading State
  const [selectedHwId, setSelectedHwId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState(18);
  const [gradeFeedback, setGradeFeedback] = useState('Great analytical scoping! Excellent 21st-century problem solving.');

  // Attendance Simulation State
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({
    'user-student-1': 'present',
    'user-student-2': 'present'
  });

  // Messaging State
  const [messages, setMessages] = useState<Array<{ sender: string, receiver: string, text: string, date: string }>>([
    { sender: 'Mr. Rajesh Patel (Parent)', receiver: 'Mr. Alok Banerjee', text: "Hello Sir, how is Aarav doing in Python lists? Is he ready for CBSE midterm exams?", date: "2026-07-05" }
  ]);
  const [replyText, setReplyText] = useState('');

  // Call API for AI Worksheet Generator
  const generateAIWorksheet = async () => {
    setIsGenerating(true);
    setGeneratedSheet('');
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_worksheet',
          payload: { topic: genTopic, grade: genGrade, difficulty: genDiff }
        })
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedSheet(data.text);
      } else {
        throw new Error();
      }
    } catch (err) {
      setGeneratedSheet(`### CBSE Practice Worksheet: ${genTopic}
*Generated Mock Sheet for demo*

#### Section A: Concepts (3 Marks)
1. Explain how ${genTopic} relates to modern CBSE AI Syllabus.

#### Section B: HOTS (5 Marks)
2. How does 21st-century skill critical thinking apply to ${genTopic}?`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Assign Homework
  const handleAssignHw = () => {
    if (!hwTitle || !hwDesc) return;
    addHomework({
      title: hwTitle,
      description: hwDesc,
      subject: hwSubject,
      grade: hwGrade,
      assignedBy: currentUser.name,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: hwDate,
      points: 20
    });
    setHwTitle('');
    setHwDesc('');
    alert("Homework assigned successfully to all " + hwGrade + " students!");
  };

  // Grade homework
  const handleGrading = (hwId: string) => {
    gradeHomework(hwId, Number(gradeScore), gradeFeedback);
    setSelectedHwId(null);
    setGradeFeedback('');
    alert("Student submission graded and notifications sent to Student & Parent!");
  };

  // Save generated worksheet to Classroom notes
  const saveWorksheetToSyllabus = () => {
    if (!generatedSheet) return;
    addContent({
      subject: hwSubject,
      grade: genGrade,
      chapter: `AI Worksheet: ${genTopic}`,
      title: `Practice Worksheet for ${genGrade}`,
      type: 'worksheet',
      summary: `Dynamic CBSE NEP Worksheet for ${genTopic}`,
      contentMarkdown: generatedSheet
    });
    alert("Worksheet published directly to Student's Chapter Notes library!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Teacher Tabs Menu */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
        <div className="pb-3 border-b border-gray-50 text-center lg:text-left">
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">CBSE AI Educator</span>
          <h3 className="font-bold text-gray-900 text-sm mt-1">{currentUser.name}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Academic Mentor Portals</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeSubTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Teacher Dashboard</span>
          </button>
          <button
            onClick={() => setActiveSubTab('eval')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeSubTab === 'eval' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Grade Homeworks ({homeworks.filter(h => h.status === 'submitted').length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('homework')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeSubTab === 'homework' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Assign Homework</span>
          </button>
          <button
            onClick={() => setActiveSubTab('ai_gen')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeSubTab === 'ai_gen' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Worksheet Generator</span>
          </button>
          <button
            onClick={() => setActiveSubTab('messages')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeSubTab === 'messages' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Parent Messages</span>
          </button>
        </nav>
      </div>

      {/* Main Teacher Feature Area */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        
        {/* DASHBOARD TAB */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Educator Cockpit</h2>
              <p className="text-xs text-gray-500">Comprehensive overview of CBSE classes, student attendance, and analytics indicators.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3.5">
                <Users className="w-8 h-8 text-emerald-600 bg-emerald-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">92% Present</h4>
                  <p className="text-[10px] text-gray-500">Today's Class Attendance</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3.5">
                <FileText className="w-8 h-8 text-indigo-600 bg-indigo-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{homeworks.filter(h => h.status === 'pending').length} Submissions</h4>
                  <p className="text-[10px] text-gray-500">Awaiting Student Submissions</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3.5">
                <Award className="w-8 h-8 text-amber-600 bg-amber-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">94.2% Success</h4>
                  <p className="text-[10px] text-gray-500">Overall Subject Mastery</p>
                </div>
              </div>
            </div>

            {/* Classroom Analytics & Weak-Topic Analyzer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-5 space-y-3.5 bg-white">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">AI Weak-Topic Student Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Natural Language Processing (NLP)</span>
                      <span className="text-red-500 font-bold">34% of students weak</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '34%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Python For Loops & Iteration</span>
                      <span className="text-amber-500 font-bold">18% of students weak</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Computer Vision Matrices</span>
                      <span className="text-emerald-500 font-bold">6% of students weak</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '6%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Tracker */}
              <div className="border border-gray-100 rounded-xl p-5 space-y-3 bg-white">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Today's Attendance Logger</h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                    <span className="font-semibold text-gray-800">Aarav Patel (Class 9)</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setAttendance(p => ({ ...p, 'user-student-1': 'present' }))}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${attendance['user-student-1'] === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-gray-400'}`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setAttendance(p => ({ ...p, 'user-student-1': 'absent' }))}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${attendance['user-student-1'] === 'absent' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-gray-400'}`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800">Aditi Rao (Class 10)</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setAttendance(p => ({ ...p, 'user-student-2': 'present' }))}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${attendance['user-student-2'] === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-gray-400'}`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setAttendance(p => ({ ...p, 'user-student-2': 'absent' }))}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${attendance['user-student-2'] === 'absent' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-gray-400'}`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRADING EVALUATION TAB */}
        {activeSubTab === 'eval' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Homework Submissions Evaluation</h2>
              <p className="text-xs text-gray-500">Grade and provide descriptive feedbacks following CBSE NEP standards.</p>
            </div>

            {homeworks.filter(h => h.status === 'submitted').length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 text-xs">
                No submitted homework is awaiting evaluation. Everything is perfectly graded!
              </div>
            ) : (
              <div className="space-y-4">
                {homeworks.filter(h => h.status === 'submitted').map((hw) => (
                  <div key={hw.id} className="border border-gray-100 rounded-xl p-5 space-y-4 bg-white">
                    <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                      <div>
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-[9px] uppercase">{hw.grade} • {hw.subject}</span>
                        <h3 className="font-bold text-gray-900 text-xs mt-1">{hw.title}</h3>
                      </div>
                      <span className="text-xs text-amber-600 font-bold uppercase">Pending Evaluation</span>
                    </div>

                    <div className="text-xs space-y-2">
                      <p className="text-gray-500"><strong className="text-gray-700">Question Topic:</strong> "{hw.description}"</p>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <strong className="text-gray-700 block mb-1">Student submission response text:</strong>
                        <p className="whitespace-pre-line text-gray-600 font-mono text-[11px] bg-white p-3.5 rounded border border-gray-100">{hw.submissionText}</p>
                      </div>
                    </div>

                    {selectedHwId === hw.id ? (
                      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1.5 font-medium">Scored Points (Max 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={gradeScore}
                              onChange={(e) => setGradeScore(Number(e.target.value))}
                              className="border border-gray-200 rounded-lg p-2 w-full text-xs"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs text-gray-500 block mb-1.5 font-medium">NEP Feedback Comments</label>
                            <input
                              type="text"
                              value={gradeFeedback}
                              onChange={(e) => setGradeFeedback(e.target.value)}
                              className="border border-gray-200 rounded-lg p-2 w-full text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedHwId(null)}
                            className="border border-gray-200 text-gray-600 px-3 py-1 text-xs rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleGrading(hw.id)}
                            className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700"
                          >
                            Grade & Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSelectedHwId(hw.id); setGradeScore(18); setGradeFeedback('Excellent analysis! Fits CBSE curriculum rules perfectly.'); }}
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700"
                      >
                        Evaluate Submission
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ASSIGN HOMEWORK TAB */}
        {activeSubTab === 'homework' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create & Assign CBSE Homework</h2>
              <p className="text-xs text-gray-500">Distribute tasks, projects, or conceptual essays to specific grades instantly.</p>
            </div>

            <div className="space-y-4 border border-gray-100 rounded-2xl p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium">Homework Title</label>
                  <input
                    type="text"
                    value={hwTitle}
                    onChange={(e) => setHwTitle(e.target.value)}
                    placeholder="e.g. 4Ws Problem Scoping Exercise"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium">Subject Module</label>
                  <select
                    value={hwSubject}
                    onChange={(e) => setHwSubject(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Python & Coding">Python & Coding</option>
                    <option value="21st Century Skills">21st Century Skills</option>
                    <option value="Digital Literacy">Digital Literacy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium">Class Grade Target</label>
                  <select
                    value={hwGrade}
                    onChange={(e) => setHwGrade(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  >
                    {Array.from({ length: 10 }, (_, i) => `Class ${i + 3}`).map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium">Due Date</label>
                  <input
                    type="date"
                    value={hwDate}
                    onChange={(e) => setHwDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 font-medium">Detailed Instructions & Problem Statement</label>
                <textarea
                  value={hwDesc}
                  onChange={(e) => setHwDesc(e.target.value)}
                  placeholder="Explain exactly what the students should write, program, or submit..."
                  className="w-full h-28 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleAssignHw}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Publish & Distribute Homework
              </button>
            </div>
          </div>
        )}

        {/* AI WORKSHEET GENERATOR TAB */}
        {activeSubTab === 'ai_gen' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>AI CBSE NEP Worksheet & Exam Generator</span>
                </h2>
                <p className="text-xs text-gray-500">Draft full homework tasks, competency sheets, or marking schemes automatically.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4.5 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Topic Keyword</label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Grade Target</label>
                <select
                  value={genGrade}
                  onChange={(e) => setGenGrade(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                >
                  {Array.from({ length: 10 }, (_, i) => `Class ${i + 3}`).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Difficulty Level</label>
                <select
                  value={genDiff}
                  onChange={(e) => setGenDiff(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                >
                  <option value="Easy">Easy (Conceptual)</option>
                  <option value="Medium">Medium (Application)</option>
                  <option value="Hard">Hard (HOTS & Competency)</option>
                </select>
              </div>
              <button
                onClick={generateAIWorksheet}
                disabled={isGenerating}
                className="bg-emerald-600 text-white p-2 rounded-lg text-xs font-semibold hover:bg-emerald-700 h-9 transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate AI Sheet'}</span>
              </button>
            </div>

            {generatedSheet && (
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50/50">
                  <div className="prose prose-sm max-w-none text-gray-700 space-y-3.5">
                    {generatedSheet.split('\n').map((line, idx) => {
                      if (line.startsWith('###')) {
                        return <h3 key={idx} className="text-base font-bold text-gray-900 pt-2">{line.replace('###', '')}</h3>;
                      } else if (line.startsWith('####')) {
                        return <h4 key={idx} className="text-sm font-bold text-emerald-800 pt-1">{line.replace('####', '')}</h4>;
                      } else if (line.startsWith('-') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                        return <li key={idx} className="ml-4 list-disc text-xs">{line}</li>;
                      } else if (line.trim().length > 0) {
                        return <p key={idx} className="text-xs leading-relaxed">{line}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([generatedSheet], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `CBSE-Worksheet-${genTopic}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <span>Download Raw Content (.txt)</span>
                  </button>
                  <button
                    onClick={saveWorksheetToSyllabus}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Publish Directly to Student Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeSubTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Parent Communication Desk</h2>
              <p className="text-xs text-gray-500">Coordinate directly with parents about academic performance alerts.</p>
            </div>

            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-4.5 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span className="font-bold text-gray-700">{msg.sender}</span>
                    <span>{msg.date}</span>
                  </div>
                  <p className="text-xs text-gray-600">"{msg.text}"</p>
                  
                  <div className="pt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response to Rajesh Patel..."
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!replyText.trim()) return;
                        setMessages(prev => [...prev, {
                          sender: currentUser.name,
                          receiver: 'Mr. Rajesh Patel',
                          text: replyText,
                          date: new Date().toISOString().split('T')[0]
                        }]);
                        setReplyText('');
                        alert("Reply sent successfully to Parent Rajesh Patel!");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
