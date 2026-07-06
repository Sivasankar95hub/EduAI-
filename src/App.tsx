/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SaaSProvider, useSaaSState } from './lib/stateStore';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';
import ParentPortal from './components/ParentPortal';
import SchoolAdminPortal from './components/SchoolAdminPortal';
import SuperAdminPortal from './components/SuperAdminPortal';
import SuperAdminLoginGate from './components/SuperAdminLoginGate';
import { TRANSLATIONS } from './lib/translations';
import { 
  Globe, Bell, Settings, LogOut, ShieldCheck, HelpCircle, Info, BookOpen,
  GraduationCap, Users, Building, Shield, Menu, X, Check, ArrowRight
} from 'lucide-react';

function AppContent() {
  const { 
    schools, 
    activeSchool, 
    currentUser, 
    notifications, 
    language, 
    isDbConnected,
    switchRole, 
    switchSchool, 
    switchLanguage,
    isImpersonating,
    stopImpersonating,
    isSuperAdminAuthenticated,
    setSuperAdminAuthenticated
  } = useSaaSState();

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  // Header notifications panel toggle
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active School Brand Accent Color mapping
  const themeColors: Record<string, { bg: string, text: string, border: string, ring: string }> = {
    indigo: { bg: 'bg-indigo-600 hover:bg-indigo-700', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'focus:ring-indigo-500' },
    emerald: { bg: 'bg-emerald-600 hover:bg-emerald-700', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'focus:ring-emerald-500' },
    amber: { bg: 'bg-amber-600 hover:bg-amber-700', text: 'text-amber-600', border: 'border-amber-200', ring: 'focus:ring-amber-500' },
    cyan: { bg: 'bg-cyan-600 hover:bg-cyan-700', text: 'text-cyan-600', border: 'border-cyan-200', ring: 'focus:ring-cyan-500' }
  };

  const theme = themeColors[activeSchool.themeColor] || themeColors.indigo;

  // Filter notifications for active user role
  const filteredNotifs = notifications.filter(
    n => (n.role === currentUser.role || n.role === 'all') && n.schoolId === activeSchool.id
  );

  const getPortalTitle = () => {
    switch (currentUser.role) {
      case 'student': return 'Student Workspace';
      case 'teacher': return 'Teacher Command Desk';
      case 'parent': return 'Parent Monitor Portal';
      case 'school_admin': return 'School Admin Console';
      case 'super_admin': return 'Super Admin Overview';
      default: return 'EduMind AI Dashboard';
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {isImpersonating && (
        <div id="impersonation-banner" className="bg-[#0F172A] border-b border-indigo-500/30 text-white text-xs px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="font-bold text-indigo-400">ADMIN CONTROL • IMPERSONATING:</span>
            <span>Viewing <strong className="text-white">{currentUser.name}</strong> (<span className="text-indigo-200 capitalize">{currentUser.role.replace('_', ' ')}</span>) at <strong className="text-white">{activeSchool.name}</strong></span>
          </div>
          <button
            onClick={() => {
              stopImpersonating();
              alert("Bypass session closed. Safely returned to Super Admin console.");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/15 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Return to Super Admin</span>
          </button>
        </div>
      )}

      <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex font-sans overflow-x-hidden flex-1">
      
      {/* 1. Sleek Interface Left Navigation Sidebar (Desktop) */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 hidden lg:flex flex-col flex-shrink-0 border-r border-slate-800">
        
        {/* Brand Logo Card */}
        <div className="p-6 flex items-center space-x-3 text-white border-b border-slate-800/80">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-500/10">
            {activeSchool.logo || '🎓'}
          </div>
          <div className="leading-none">
            <h1 className="text-base font-bold text-white tracking-tight">EduMind AI</h1>
            <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-0.5">NEP 2020 READY</p>
          </div>
        </div>

        {/* Sidebar Nav Actions (Portal Role Switcher mapped as main workspaces) */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] uppercase text-slate-500 font-bold px-3.5 mb-2.5 tracking-wider">
            Workspace Roles
          </div>

          <button
            onClick={() => switchRole('student')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left group ${
              currentUser.role === 'student'
                ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className={`w-4 h-4 mr-3 transition-colors ${currentUser.role === 'student' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span>Student space</span>
          </button>

          <button
            onClick={() => switchRole('teacher')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left group ${
              currentUser.role === 'teacher'
                ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap className={`w-4 h-4 mr-3 transition-colors ${currentUser.role === 'teacher' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span>Teacher Desk</span>
          </button>

          <button
            onClick={() => switchRole('parent')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left group ${
              currentUser.role === 'parent'
                ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className={`w-4 h-4 mr-3 transition-colors ${currentUser.role === 'parent' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span>Parent Portal</span>
          </button>

          <button
            onClick={() => switchRole('school_admin')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left group ${
              currentUser.role === 'school_admin'
                ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building className={`w-4 h-4 mr-3 transition-colors ${currentUser.role === 'school_admin' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span>School controller</span>
          </button>

          {isSuperAdminAuthenticated && (
            <button
              onClick={() => switchRole('super_admin')}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left group ${
                currentUser.role === 'super_admin'
                  ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className={`w-4 h-4 mr-3 transition-colors ${currentUser.role === 'super_admin' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span>Super Admin console</span>
            </button>
          )}

          {/* School Selector (Multi-Tenant) */}
          <div className="pt-6">
            <div className="text-[10px] uppercase text-slate-500 font-bold px-3.5 mb-2 tracking-wider">
              Tenant Switcher
            </div>
            <div className="px-3.5">
              <select
                value={activeSchool.id}
                onChange={(e) => switchSchool(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/60 text-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {schools.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.name.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Regional Multi-lingual Translation Switch */}
          <div className="pt-5">
            <div className="text-[10px] uppercase text-slate-500 font-bold px-3.5 mb-2 tracking-wider">
              System Language
            </div>
            <div className="px-3.5 flex items-center gap-2 bg-slate-800 border border-slate-700/60 rounded-lg p-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400 ml-1 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => switchLanguage(e.target.value)}
                className="w-full bg-transparent border-none text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="English" className="bg-slate-900 text-slate-200">English (US)</option>
                <option value="Hindi" className="bg-slate-900 text-slate-200">हिंदी (Hindi)</option>
                <option value="Telugu" className="bg-slate-900 text-slate-200">తెలుగు (Telugu)</option>
                <option value="Tamil" className="bg-slate-900 text-slate-200">தமிழ் (Tamil)</option>
                <option value="Kannada" className="bg-slate-900 text-slate-200">ಕನ್ನಡ (Kannada)</option>
                <option value="Malayalam" className="bg-slate-900 text-slate-200">മലയാളം (Malayalam)</option>
                <option value="Marathi" className="bg-slate-900 text-slate-200">मराठी (Marathi)</option>
                <option value="Bengali" className="bg-slate-900 text-slate-200">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </nav>

        {/* Database Synchronization Status Indicator */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {!isSuperAdminAuthenticated ? (
            <button
              onClick={() => {
                switchRole('super_admin');
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white text-[11px] font-bold py-2 px-3 rounded-lg border border-slate-700 transition-all shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Super Admin Entrance</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSuperAdminAuthenticated(false);
                switchRole('student');
                alert("Super Admin session locked successfully. Switching to standard view.");
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-950/60 text-red-300 hover:text-red-200 text-[11px] font-bold py-2 px-3 rounded-lg border border-red-900/30 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span>Lock Console Session</span>
            </button>
          )}

          <div className="bg-slate-850/40 rounded-xl p-3 border border-slate-800/80">
            <div className="text-[9px] uppercase text-slate-500 font-bold mb-1 tracking-wider">System Connection</div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {isDbConnected ? "Firestore Cloud" : "Local Standalone"}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Sleek Interface Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          
          {/* Left Title Space */}
          <div className="flex items-center space-x-4">
            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1 rounded-md bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
              {getPortalTitle()}
            </h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wide border border-slate-200">
              NEP 2020 Aligned
            </span>
          </div>

          {/* Right Interface Controls */}
          <div className="flex items-center space-x-6">
            
            {/* Active School Badge Display */}
            <div className="hidden md:flex items-center space-x-2 bg-indigo-50 border border-indigo-100/80 px-3 py-1 rounded-full">
              <span className="text-sm">{activeSchool.logo}</span>
              <span className="text-[11px] font-bold text-indigo-900">{activeSchool.name}</span>
            </div>

            {/* Notifications Panel Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="bg-slate-50 border border-slate-200 p-2 rounded-lg hover:bg-slate-100 relative transition-all"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {filteredNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Real-time dropdown alerts panel */}
              {showNotifPanel && (
                <div className="absolute right-0 mt-3.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 px-4 z-50 space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-slate-800">Alert Notification Desk</h4>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                      {filteredNotifs.length} Alerts
                    </span>
                  </div>
                  {filteredNotifs.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic text-center py-4">No pending reminders.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {filteredNotifs.map((n, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl text-[10.5px]">
                          <p className="font-bold text-slate-800">{n.title}</p>
                          <p className="text-slate-500 leading-normal mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block text-right">{n.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Current Interactive User Identity Panel */}
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
              <div className="w-9 h-9 bg-slate-100 text-lg rounded-full flex items-center justify-center border border-slate-200 shadow-xs">
                {currentUser.avatar || '🎓'}
              </div>
            </div>

          </div>
        </header>

        {/* 2. Sleek Interface Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 max-w-full bg-[#0F172A] h-full flex flex-col p-5 space-y-6" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{activeSchool.logo || '🎓'}</span>
                  <span className="text-sm font-black text-white">EduMind AI</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Workspaces role selector list inside mobile drawer */}
              <div className="flex-1 space-y-1.5 overflow-y-auto">
                <div className="text-[10px] uppercase text-slate-500 font-bold mb-2 tracking-wider">
                  Role Workspace Swapping
                </div>
                
                {['student', 'teacher', 'parent', 'school_admin', ...(isSuperAdminAuthenticated ? ['super_admin'] : [])].map((roleKey) => {
                  const label = roleKey.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
                  const isActive = currentUser.role === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => {
                        switchRole(roleKey as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{label}</span>
                    </button>
                  );
                })}

                {/* Tenant switch in mobile */}
                <div className="pt-6">
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-2 tracking-wider">
                    School Tenant Switch
                  </div>
                  <select
                    value={activeSchool.id}
                    onChange={(e) => {
                      switchSchool(e.target.value);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Switch */}
                <div className="pt-4">
                  <div className="text-[10px] uppercase text-slate-500 font-bold mb-2 tracking-wider">
                    Language Selection
                  </div>
                  <select
                    value={language}
                    onChange={(e) => {
                      switchLanguage(e.target.value);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="Malayalam">മലയാളം (Malayalam)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-3 bg-slate-800 rounded-xl flex items-center justify-between text-[11px] text-slate-400">
                <span>Database Synced</span>
                <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Sleek Inner Dynamic Workspace Routing Panel */}
        <main className="flex-1 p-5 sm:p-8">
          
          {/* Active Workspaces */}
          {currentUser.role === 'student' && <StudentPortal />}
          {currentUser.role === 'teacher' && <TeacherPortal />}
          {currentUser.role === 'parent' && <ParentPortal />}
          {currentUser.role === 'school_admin' && <SchoolAdminPortal />}
          {currentUser.role === 'super_admin' && (
            isSuperAdminAuthenticated ? <SuperAdminPortal /> : <SuperAdminLoginGate />
          )}

        </main>

        {/* Clean, high-contrast, modern footer */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-600">{t.cbseNepGoal}</span>
            </div>
            <p className="text-slate-400">
              © 2026 EduMind AI SaaS Platform. Engineered by <strong className="text-indigo-600">Shiva AI</strong>. All rights reserved. NEP 2020 CBSE Compliant Future Skills.
            </p>
          </div>
        </footer>

      </div>
    </div>
  </div>
  );
}

export default function App() {
  return (
    <SaaSProvider>
      <AppContent />
    </SaaSProvider>
  );
}
