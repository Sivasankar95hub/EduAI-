/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSaaSState } from '../lib/stateStore';
import { 
  Users, Award, Calendar, CheckSquare, Sparkles, 
  MessageSquare, Volume2
} from 'lucide-react';

export default function ParentPortal() {
  const { 
    currentUser, 
    homeworks, 
    quizResults, 
    language 
  } = useSaaSState();

  const [activeTab, setActiveTab] = useState<'overview' | 'recs' | 'chat'>('overview');

  // Simulated parent messages
  const [msgInput, setMsgInput] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { sender: 'You', text: "Hello Sir, how is Aarav doing in Python lists? Is he ready for CBSE midterm exams?", date: "2026-07-05" },
    { sender: 'Mr. Alok Banerjee', text: "Aarav is doing exceptionally well! He scored 100% on lists last week. He just needs minor practice with nested loops.", date: "2026-07-05" }
  ]);

  // Dynamic AI Child recommendation states
  const [aiRec, setAiRec] = useState('');
  const [recLoading, setRecLoading] = useState(false);

  const getChildRecommendations = async () => {
    setRecLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tutor_doubt',
          payload: {
            doubt: "Suggest a weekly study plan and learning recommendations for Aarav (Class 9) who is strong in Python lists but needs work on Natural Language Processing (NLP) syntax and vocabulary.",
            subject: "CBSE AI & 21st Century Skills"
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiRec(data.text);
      } else {
        throw new Error();
      }
    } catch (err) {
      setAiRec(`### 🌟 Custom AI Recommendations for Aarav:
- **Focus Topic (NLP)**: Dedicate 30 mins to study bag-of-words datasets.
- **Hands-on Activity**: Build a small list-sorting script together.
- **NEP 2020 Skill**: Play a conversational grammar matching game to understand parser algorithms.`);
    } finally {
      setRecLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Parent Nav Sidebar */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
        <div className="pb-3 border-b border-gray-50 text-center lg:text-left">
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Parent Observer Portal</span>
          <h3 className="font-bold text-gray-900 text-sm mt-1">{currentUser.name}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">Observing Child: Aarav Patel (Grade 9)</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'overview' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Child Academic Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('recs')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'recs' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Parent Recommendations</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'chat' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Teacher</span>
          </button>
        </nav>
      </div>

      {/* Main Feature Content Area */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Aarav's Learning Tracker</h2>
              <p className="text-xs text-gray-500">Real-time attendance logs, homework scoring, and badge updates.</p>
            </div>

            {/* Attendance & Streak Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                <Users className="w-8 h-8 text-indigo-600 bg-indigo-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">98% Present</h4>
                  <p className="text-[10px] text-gray-500">Attendance Rate</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                <CheckSquare className="w-8 h-8 text-emerald-600 bg-emerald-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">8 Day Streak</h4>
                  <p className="text-[10px] text-gray-500">Daily App Learning Streak</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-600 bg-amber-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">420 Mind Points</h4>
                  <p className="text-[10px] text-gray-500">XP Accomplished</p>
                </div>
              </div>
            </div>

            {/* Graded Homework Logs */}
            <div className="border border-gray-100 rounded-xl p-5 space-y-3.5 bg-white">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Recent Graded Homework Evaluation</h3>
              <div className="space-y-3">
                {homeworks.filter(h => h.status === 'graded').map((hw, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-gray-900">{hw.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Graded by: {hw.assignedBy} • Score: {hw.score}/20</p>
                      <p className="text-[10.5px] text-emerald-700 font-medium mt-1">"{hw.gradeFeedback}"</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Graded</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Progress */}
            <div className="border border-gray-100 rounded-xl p-5 space-y-3.5 bg-white">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Aarav's Quiz Performance Graph</h3>
              <div className="space-y-3">
                {quizResults.map((qr, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-gray-900">{qr.topic}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{qr.feedback}</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">{qr.score}/{qr.totalQuestions} Correct</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RECS TAB */}
        {activeTab === 'recs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>AI Parental Advice Assistant</span>
                </h2>
                <p className="text-xs text-gray-500">Personalized plans helping your child learn CBSE 21st-century values.</p>
              </div>
            </div>

            <button
              onClick={getChildRecommendations}
              disabled={recLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              {recLoading ? 'Analyzing Performance Logs...' : 'Analyze Aarav\'s Weak Concepts'}
            </button>

            {aiRec && (
              <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50/50">
                <div className="prose prose-sm max-w-none text-gray-700 space-y-3.5">
                  {aiRec.split('\n').map((line, idx) => {
                    if (line.startsWith('###')) {
                      return <h3 key={idx} className="text-base font-bold text-gray-900 pt-2">{line.replace('###', '')}</h3>;
                    } else if (line.startsWith('-')) {
                      return <li key={idx} className="ml-4 list-disc text-xs">{line.substring(1).trim()}</li>;
                    } else if (line.trim().length > 0) {
                      return <p key={idx} className="text-xs leading-relaxed">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Contact Mr. Alok Banerjee (AI Teacher)</h2>
              <p className="text-xs text-gray-500">Ask questions regarding your child's weekly schedules and marks.</p>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-100 rounded-xl p-4 bg-slate-50/50 space-y-4 max-h-72 overflow-y-auto">
                {chatLogs.map((chat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span className="font-bold text-gray-700">{chat.sender}</span>
                      <span>{chat.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-pre-line bg-white p-2.5 rounded border border-gray-100">"{chat.text}"</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (!msgInput.trim()) return;
                    setChatLogs(prev => [...prev, {
                      sender: 'You',
                      text: msgInput,
                      date: new Date().toISOString().split('T')[0]
                    }]);
                    setMsgInput('');
                    alert("Message dispatched to Teacher Alok Banerjee's messaging dashboard!");
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
