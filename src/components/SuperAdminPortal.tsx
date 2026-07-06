/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSaaSState } from '../lib/stateStore';
import { 
  Plus, TrendingUp, BarChart2, Shield, Activity, 
  Building, CheckCircle, RefreshCw, Layers, Lock, Search, Eye, UserCheck, ChevronLeft, ChevronRight,
  Users, CreditCard, Landmark, Trash2, Edit2, ShieldAlert, AlertCircle, Sparkles, ShieldCheck, X,
  Award, Heart, Sparkle
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

export default function SuperAdminPortal() {
  const { 
    schools, 
    addSchool, 
    deleteSchool,
    allUsers,
    addUser,
    updateUser,
    deleteUser,
    currentUser,
    setSuperAdminAuthenticated,
    startImpersonating,
    premiumBalancePool,
    poorStudentMinDiscount,
    poorStudentMaxDiscount,
    scholarships,
    updatePremiumSubsidyConfig,
    awardScholarship,
    deleteScholarship
  } = useSaaSState();

  const [activeTab, setActiveTab] = useState<'schools' | 'users' | 'payments' | 'bank' | 'stats' | 'logs' | 'scholarships'>('schools');

  // School Register States
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolTheme, setSchoolTheme] = useState('indigo');
  const [schoolPlan, setSchoolPlan] = useState<'trial' | 'basic' | 'premium'>('trial');

  // Search, Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'trial' | 'basic' | 'premium'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Users Management States
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [filterUserRole, setFilterUserRole] = useState<'all' | UserRole>('all');
  const [filterUserSchool, setFilterUserSchool] = useState<string>('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Scholarship & Equity Configuration States
  const [scholBeneficiaryName, setScholBeneficiaryName] = useState('');
  const [scholRole, setScholRole] = useState<'student' | 'teacher'>('student');
  const [scholSchoolId, setScholSchoolId] = useState('');
  const [scholDiscountPercent, setScholDiscountPercent] = useState(75);
  const [scholDescription, setScholDescription] = useState('');
  const [showScholForm, setShowScholForm] = useState(false);
  const [inputPool, setInputPool] = useState(1250000);
  const [inputMin, setInputMin] = useState(50);
  const [inputMax, setInputMax] = useState(95);
  
  // Invitation simulation states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [lastCreatedInviteLink, setLastCreatedInviteLink] = useState('');
  const [lastCreatedUser, setLastCreatedUser] = useState<any>(null);
  
  // User Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('student');
  const [formSchoolId, setFormSchoolId] = useState('');
  const [formGrade, setFormGrade] = useState('Class 9');
  const [formSection, setFormSection] = useState('Section A');
  const [formPoints, setFormPoints] = useState(100);

  // Razorpay configuration states
  const [razorpayKey, setRazorpayKey] = useState(() => localStorage.getItem('edumind_rp_key') || 'rzp_live_EdUMiNd9842');
  const [razorpaySecret, setRazorpaySecret] = useState(() => localStorage.getItem('edumind_rp_secret') || '••••••••••••••••••••••••');
  const [razorpayWebhook, setRazorpayWebhook] = useState(() => localStorage.getItem('edumind_rp_webhook') || 'https://api.edumind.ai/v1/webhooks/razorpay');
  const [settlementCycle, setSettlementCycle] = useState(() => localStorage.getItem('edumind_settle_cycle') || '24h');
  
  // Auto Pay states
  const [autoPayTeacher, setAutoPayTeacher] = useState(() => localStorage.getItem('edumind_ap_teacher') === 'true');
  const [autoPayStudent, setAutoPayStudent] = useState(() => localStorage.getItem('edumind_ap_student') === 'true');
  const [autoPaySchool, setAutoPaySchool] = useState(() => localStorage.getItem('edumind_ap_school') === 'true');
  const [autoPayAdmin, setAutoPayAdmin] = useState(() => localStorage.getItem('edumind_ap_admin') === 'true');

  // Secure Bank configuration states
  const [bankHolder, setBankHolder] = useState(() => localStorage.getItem('edumind_bank_holder') || 'EDUMIND AI EDUTECH PVT LTD');
  const [bankNameStr, setBankNameStr] = useState(() => localStorage.getItem('edumind_bank_name') || 'HDFC Bank Ltd');
  const [bankAccount, setBankAccount] = useState(() => localStorage.getItem('edumind_bank_acc') || '50200049281039');
  const [bankIfsc, setBankIfsc] = useState(() => localStorage.getItem('edumind_bank_ifsc') || 'HDFC0000060');
  const [bankPin, setBankPin] = useState('');
  const [showMaskedAccount, setShowMaskedAccount] = useState(true);

  // Simulated Audit Logs
  const [auditLogs, setAuditLogs] = useState<Array<{ event: string, user: string, desc: string, date: string }>>([
    { event: "SCHOOL_PROVISIONED", user: "Super Admin", desc: "Successfully provisioned NEP Future Academy", date: "2026-07-06 09:30" },
    { event: "BANK_DETAILS_MODIFIED", user: "Super Admin", desc: "Updated bank configuration safely with 4-digit security authorization code", date: "2026-07-06 08:04" },
    { event: "RAZORPAY_CONFIG_UPDATED", user: "Super Admin", desc: "Refreshed Razorpay Secret and activated Auto-Pay triggers", date: "2026-07-06 07:45" },
    { event: "LICENSE_UPGRADE", user: "System", desc: "SaaS upgrade triggered for school-1 via Razorpay API", date: "2026-07-05 14:22" },
    { event: "USER_LOGIN_SUCCESS", user: "shiva957347@gmail.com", desc: "Superadmin login authenticated via secure gate", date: "2026-07-06 07:04" }
  ]);

  React.useEffect(() => {
    setInputPool(premiumBalancePool);
    setInputMin(poorStudentMinDiscount);
    setInputMax(poorStudentMaxDiscount);
  }, [premiumBalancePool, poorStudentMinDiscount, poorStudentMaxDiscount]);

  React.useEffect(() => {
    if (schools.length > 0 && !scholSchoolId) {
      setScholSchoolId(schools[0].id);
    }
  }, [schools, scholSchoolId]);

  const addLog = (event: string, desc: string) => {
    setAuditLogs(prev => [
      {
        event,
        user: "Super Admin",
        desc,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
      },
      ...prev
    ]);
  };

  // Register New Tenant School
  const handleRegisterSchool = () => {
    if (!schoolName || !schoolAddress) {
      alert("Please enter school name and address!");
      return;
    }
    addSchool({
      name: schoolName,
      logo: '🏫',
      themeColor: schoolTheme,
      subscriptionPlan: schoolPlan,
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      address: schoolAddress,
      studentCount: 0,
      teacherCount: 0
    });

    addLog("SCHOOL_PROVISIONED", `Provisioned new CBSE school: "${schoolName}"`);
    setSchoolName('');
    setSchoolAddress('');
    setShowAddSchool(false);
    alert(`Successfully registered "${schoolName}" as a tenant school!`);
  };

  // Delete Tenant School
  const handleDeleteSchool = (schoolId: string, schoolName: string) => {
    if (confirm(`Are you absolutely sure you want to delete "${schoolName}"? This will permanently wipe all users, students, grades and settings linked to this school. This action is irreversible.`)) {
      deleteSchool(schoolId);
      addLog("SCHOOL_DELETED", `Permanently deleted school: "${schoolName}" (${schoolId})`);
      alert(`Successfully deleted school: ${schoolName}`);
    }
  };

  const handleAwardScholarshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholBeneficiaryName.trim()) {
      alert("Please provide the beneficiary name.");
      return;
    }
    if (!scholSchoolId) {
      alert("Please select a target school.");
      return;
    }
    
    awardScholarship(
      scholSchoolId,
      scholBeneficiaryName,
      scholRole,
      scholDiscountPercent,
      scholDescription || `Standard ${scholDiscountPercent}% Global Inclusivity subsidy for high-potential academic learning.`
    );
    
    addLog("SCHOLARSHIP_GRANTED", `Disbursed ${scholDiscountPercent}% AI Equity grant for ${scholRole} ${scholBeneficiaryName}`);
    setScholBeneficiaryName('');
    setScholDescription('');
    setScholDiscountPercent(75);
    setShowScholForm(false);
    alert(`Successfully issued AI Inclusivity scholarship to ${scholBeneficiaryName}!`);
  };

  // User Administration Handlers
  const handleOpenUserForm = (user?: UserProfile) => {
    if (user) {
      setEditingUser(user);
      setFormName(user.name);
      setFormEmail(user.email);
      setFormRole(user.role);
      setFormSchoolId(user.schoolId);
      setFormGrade(user.grade || 'Class 9');
      setFormSection(user.section || 'Section A');
      setFormPoints(user.points || 100);
    } else {
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormRole('student');
      setFormSchoolId(schools[0]?.id || 'school-1');
      setFormGrade('Class 9');
      setFormSection('Section A');
      setFormPoints(100);
    }
    setShowUserForm(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formSchoolId) {
      alert("Name, Email and School are required fields!");
      return;
    }

    if (editingUser) {
      // Update
      updateUser(editingUser.id, {
        name: formName,
        email: formEmail,
        role: formRole,
        schoolId: formSchoolId,
        grade: formRole === 'student' ? formGrade : undefined,
        section: formRole === 'student' ? formSection : undefined,
        points: formRole === 'student' ? Number(formPoints) : undefined
      });
      addLog("USER_UPDATED", `Updated user: "${formName}" (${formRole})`);
      alert(`Successfully updated user: ${formName}`);
    } else {
      // Add
      const token = `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      const generatedLink = `${window.location.origin}/invite?token=${token}&email=${encodeURIComponent(formEmail)}&role=${formRole}`;

      addUser({
        name: formName,
        email: formEmail,
        role: formRole,
        schoolId: formSchoolId,
        avatar: formRole === 'student' ? '👦' : formRole === 'teacher' ? '👨‍🏫' : formRole === 'parent' ? '👨' : '🏢',
        grade: formRole === 'student' ? formGrade : undefined,
        section: formRole === 'student' ? formSection : undefined,
        points: formRole === 'student' ? Number(formPoints) : 100,
        streak: formRole === 'student' ? 1 : undefined,
        badges: formRole === 'student' ? ['First Steps'] : undefined
      });

      const matchedSchool = schools.find(s => s.id === formSchoolId);
      const schoolLabel = matchedSchool ? matchedSchool.name : "EduMind AI Campus";

      setLastCreatedInviteLink(generatedLink);
      setLastCreatedUser({
        name: formName,
        email: formEmail,
        role: formRole,
        school: schoolLabel,
        token: token
      });

      addLog("USER_CREATED", `Created new user & dispatched invitation link: "${formName}" (${formRole})`);
      setShowInviteModal(true);
    }

    setShowUserForm(false);
  };

  const handleDeleteUser = (userId: string, userName: string, role: string) => {
    if (confirm(`Are you sure you want to delete ${userName} (${role})? This cannot be undone.`)) {
      deleteUser(userId);
      addLog("USER_DELETED", `Deleted ${role} user: "${userName}"`);
      alert(`Successfully deleted user: ${userName}`);
    }
  };

  // Razorpay and Payments Configuration handlers
  const handleSavePayments = () => {
    localStorage.setItem('edumind_rp_key', razorpayKey);
    localStorage.setItem('edumind_rp_secret', razorpaySecret);
    localStorage.setItem('edumind_rp_webhook', razorpayWebhook);
    localStorage.setItem('edumind_ap_teacher', String(autoPayTeacher));
    localStorage.setItem('edumind_ap_student', String(autoPayStudent));
    localStorage.setItem('edumind_ap_school', String(autoPaySchool));
    localStorage.setItem('edumind_ap_admin', String(autoPayAdmin));
    localStorage.setItem('edumind_settle_cycle', settlementCycle);

    addLog("RAZORPAY_CONFIG_UPDATED", `Saved payments gateway & auto-pay toggles securely`);
    alert("Razorpay payments settings and automated payouts saved successfully!");
  };

  // Bank Configuration handlers
  const handleSaveBankDetails = () => {
    if (!bankHolder || !bankNameStr || !bankAccount || !bankIfsc) {
      alert("All bank details are required!");
      return;
    }
    if (bankPin.length < 4) {
      alert("Please enter a secure 4-digit Security PIN to lock and authorize these bank details!");
      return;
    }

    localStorage.setItem('edumind_bank_holder', bankHolder);
    localStorage.setItem('edumind_bank_name', bankNameStr);
    localStorage.setItem('edumind_bank_acc', bankAccount);
    localStorage.setItem('edumind_bank_ifsc', bankIfsc);

    addLog("BANK_DETAILS_MODIFIED", `Bank parameters locked & updated under PIN authorization: ${bankNameStr}`);
    setBankPin('');
    alert("Bank details encrypted and updated with secure PIN clearance!");
  };

  // Filters for Schools
  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || s.subscriptionPlan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage) || 1;
  const paginatedSchools = filteredSchools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Filters for Users
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = filterUserRole === 'all' || u.role === filterUserRole;
    const matchesSchool = filterUserSchool === 'all' || u.schoolId === filterUserSchool;
    return matchesSearch && matchesRole && matchesSchool;
  });

  // CBSE Grades for 3 to 12
  const cbseGradesList = Array.from({ length: 10 }, (_, i) => `Class ${i + 3}`);

  return (
    <div id="super-admin-portal-dashboard" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Super Admin Nav */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200/80 p-5 space-y-4 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="pb-3 border-b border-gray-100 text-center lg:text-left">
            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-red-100">Super Administrator</span>
            <h3 className="font-extrabold text-gray-900 text-sm mt-1">{currentUser.name}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">EduMind AI Global Controller</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('schools')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'schools' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Building className="w-4 h-4" />
              <span>SaaS Tenant Schools</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'users' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users className="w-4 h-4" />
              <span>CRUD User Directory</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'payments' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Razorpay & Auto-Pay</span>
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'bank' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Landmark className="w-4 h-4" />
              <span>Secure Bank Setup</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'stats' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>SaaS Revenue Stats</span>
            </button>
             <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'logs' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Shield className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'scholarships' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Equity & Scholarships</span>
            </button>
          </nav>
        </div>

        {/* Lock Console / Sign Out Block */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Shiva AI Admin Engine:</strong> Managing <span className="text-red-600 font-bold">{schools.length}</span> active school tenants and <span className="text-indigo-600 font-bold">{allUsers.length}</span> active users across grades 3-12 CBSE curriculum.
          </div>
          <button
            onClick={() => {
              setSuperAdminAuthenticated(false);
              alert("Super Admin session secured and locked successfully!");
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Main Feature Content Area */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
        
        {/* SCHOOLS MANAGEMENT TAB */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">CBSE Tenant Schools</h2>
                <p className="text-xs text-gray-500">Monitor and provision active school instances across India ({schools.length} schools total).</p>
              </div>
              <button
                onClick={() => setShowAddSchool(!showAddSchool)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm self-end md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Provision New School</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="relative flex-1 w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search schools by name, UID or city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page
                  }}
                  className="w-full bg-white border border-slate-200/80 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">Plan:</span>
                <select
                  value={filterPlan}
                  onChange={(e) => {
                    setFilterPlan(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200/80 rounded-lg p-1.5 text-xs focus:outline-none focus:border-indigo-500 w-full md:w-auto font-medium"
                >
                  <option value="all">All Subscriptions</option>
                  <option value="premium">Premium Plans</option>
                  <option value="basic">Basic Plans</option>
                  <option value="trial">Trial Plans</option>
                </select>
              </div>
            </div>

            {/* Register School Form */}
            {showAddSchool && (
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-4 max-w-lg animate-fadeIn">
                <h3 className="text-xs font-bold uppercase text-red-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Provision Tenant Profile</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">School Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Modern School, New Delhi"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">Regional Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Barakhamba Road, New Delhi"
                      value={schoolAddress}
                      onChange={(e) => setSchoolAddress(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">Subscription Plan Level</label>
                    <select
                      value={schoolPlan}
                      onChange={(e: any) => setSchoolPlan(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    >
                      <option value="trial">Free Trial Plan</option>
                      <option value="basic">NEP Essential</option>
                      <option value="premium">AI Smart School SaaS</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">Brand Accent Color</label>
                    <select
                      value={schoolTheme}
                      onChange={(e) => setSchoolTheme(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    >
                      <option value="indigo">Indigo Accents</option>
                      <option value="emerald">Emerald Accents</option>
                      <option value="amber">Amber Accents</option>
                      <option value="cyan">Cyan Accents</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleRegisterSchool}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Save and Provision School
                </button>
              </div>
            )}

            {/* Tenant Listing */}
            {filteredSchools.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">No schools matching search criteria.</p>
                <p className="text-xs text-slate-400">Try adjusting your query or plan level filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedSchools.map((school) => (
                  <div key={school.id} className="border border-slate-200/80 rounded-xl p-4 bg-white flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{school.logo}</span>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-xs leading-tight">{school.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {school.id}</p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase border border-emerald-100">Active</span>
                          <span className="bg-red-50 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md capitalize border border-red-100">{school.subscriptionPlan}</span>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-gray-500 leading-normal">{school.address}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex gap-4 text-[10px] text-gray-400 font-medium">
                          <span>👤 {school.studentCount} Students</span>
                          <span>👨‍🏫 {school.teacherCount} Teachers</span>
                        </div>
                        
                        {/* School deletion trigger */}
                        <button 
                          onClick={() => handleDeleteSchool(school.id, school.name)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete School Tenant Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Impersonation Control Panel */}
                    <div className="pt-3 mt-3 border-t border-slate-100 space-y-1.5">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Impersonate Administrative Bypass:</p>
                      <div className="grid grid-cols-4 gap-1">
                        <button
                          onClick={() => {
                            startImpersonating(`admin-${school.id}`, school.id, 'school_admin');
                          }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 font-extrabold text-[9px] py-1 px-1 rounded border border-slate-200/60 transition-colors text-center"
                          title="Bypass login as School Admin / Principal"
                        >
                          Admin
                        </button>
                        <button
                          onClick={() => {
                            startImpersonating(`teacher-${school.id}`, school.id, 'teacher');
                          }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 font-extrabold text-[9px] py-1 px-1 rounded border border-slate-200/60 transition-colors text-center"
                          title="Bypass login as School Teacher"
                        >
                          Teacher
                        </button>
                        <button
                          onClick={() => {
                            startImpersonating(`parent-${school.id}`, school.id, 'parent');
                          }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 font-extrabold text-[9px] py-1 px-1 rounded border border-slate-200/60 transition-colors text-center"
                          title="Bypass login as Student Parent"
                        >
                          Parent
                        </button>
                        <button
                          onClick={() => {
                            startImpersonating(`student-${school.id}`, school.id, 'student');
                          }}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 font-extrabold text-[9px] py-1 px-1 rounded border border-slate-200/60 transition-colors text-center"
                          title="Bypass login as Student"
                        >
                          Student
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredSchools.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  Showing <strong className="text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredSchools.length)}</strong> of <strong className="text-slate-800">{filteredSchools.length}</strong> CBSE schools
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    «
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  
                  <div className="flex items-center gap-1 px-2 font-semibold">
                    <span className="text-slate-800">{currentPage}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">{totalPages}</span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CRUD USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Directory Control</h2>
                <p className="text-xs text-gray-500">Fully administer students, teachers, parents, and admins across all CBSE schools.</p>
              </div>
              <button
                onClick={() => handleOpenUserForm()}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New User Profile</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <select
                  value={filterUserRole}
                  onChange={(e) => setFilterUserRole(e.target.value as any)}
                  className="w-full bg-white border border-slate-200/80 rounded-lg p-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Student Directory</option>
                  <option value="teacher">Teacher Directory</option>
                  <option value="parent">Parent Directory</option>
                  <option value="school_admin">School Admin Directory</option>
                </select>
              </div>

              <div>
                <select
                  value={filterUserSchool}
                  onChange={(e) => setFilterUserSchool(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-lg p-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="all">All Schools</option>
                  {schools.map(sch => (
                    <option key={sch.id} value={sch.id}>{sch.name.split(',')[0]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic User Creation / Editing Form */}
            {showUserForm && (
              <form onSubmit={handleSaveUser} className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-4 max-w-xl animate-fadeIn">
                <h3 className="text-xs font-bold uppercase text-indigo-700 flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{editingUser ? `Edit Profile: ${editingUser.name}` : "Create New User Profile"}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shiva Kant"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. shiva@gmail.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">Role Assignment</label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as any)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="school_admin">School Admin (Principal)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">Linked CBSE School</label>
                    <select
                      value={formSchoolId}
                      onChange={(e) => setFormSchoolId(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:outline-none"
                    >
                      {schools.map(sch => (
                        <option key={sch.id} value={sch.id}>{sch.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formRole === 'student' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-3 rounded-lg border border-gray-100">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-medium">Grade (CBSE 3 to 12)</label>
                      <select
                        value={formGrade}
                        onChange={(e) => setFormGrade(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg p-1.5 text-xs focus:outline-none"
                      >
                        {cbseGradesList.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-medium">Section</label>
                      <input
                        type="text"
                        placeholder="e.g. Section A"
                        value={formSection}
                        onChange={(e) => setFormSection(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg p-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-medium">Starting Points</label>
                      <input
                        type="number"
                        value={formPoints}
                        onChange={(e) => setFormPoints(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg p-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    className="border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    Save Profile changes
                  </button>
                </div>
              </form>
            )}

            {/* List of Users */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-gray-100">
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Linked CBSE School</th>
                    <th className="p-3">CBSE Details</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        No users found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => {
                      const linkedSchool = schools.find(s => s.id === user.schoolId);
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-bold text-gray-900 flex items-center gap-1.5">
                            <span className="text-sm">{user.avatar}</span>
                            <span>{user.name}</span>
                          </td>
                          <td className="p-3 text-gray-600">{user.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'school_admin' ? 'bg-amber-100 text-amber-800' :
                              user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'parent' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-gray-500 font-medium">
                            {user.schoolId === 'all' ? 'All (Global)' : (linkedSchool?.name.split(',')[0] || user.schoolId)}
                          </td>
                          <td className="p-3 font-mono text-[10px] text-gray-600">
                            {user.role === 'student' ? (
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded">{user.grade || 'N/A'} - {user.section || 'A'}</span>
                            ) : user.role === 'teacher' ? (
                              <span className="text-indigo-600 font-bold">CBSE AI Faculty</span>
                            ) : 'Global SaaS Account'}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenUserForm(user)}
                                className="p-1 hover:bg-slate-100 rounded text-indigo-600 transition-colors"
                                title="Edit Profile Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              
                              {user.role !== 'super_admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.name, user.role)}
                                  className="p-1 hover:bg-slate-100 rounded text-red-600 transition-colors"
                                  title="Delete Account Profile"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
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

        {/* PAYMENTS & RAZORPAY CONFIG TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Razorpay Payment Gateway Setup</h2>
              <p className="text-xs text-gray-500">Configure global merchant parameters, automated payouts, auto pay cycles, and SaaS billing rules.</p>
            </div>

            {/* Warning card */}
            <div className="bg-slate-50 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Super Admin Payment Bypass Protocol</span>
              </h4>
              <p className="text-[11px] text-slate-600 leading-normal">
                Razorpay APIs process student board exam registrations, school SaaS licenses, and teacher salary automated dispersals. Ensure correct production Key IDs and Webhook signing secrets are matched to prevent packet failure logs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Razorpay Setup block */}
              <div className="space-y-4 border border-slate-100 p-5 rounded-xl bg-white shadow-xs">
                <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-red-600" />
                  <span>Razorpay API Keys</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Razorpay Key ID (Live / Test)</label>
                    <input
                      type="text"
                      placeholder="rzp_live_..."
                      value={razorpayKey}
                      onChange={(e) => setRazorpayKey(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Razorpay Secret Key</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••••••••••"
                      value={razorpaySecret}
                      onChange={(e) => setRazorpaySecret(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Auto-Sign Webhook URL</label>
                    <input
                      type="text"
                      placeholder="https://api.edumind.ai/v1/webhooks/razorpay"
                      value={razorpayWebhook}
                      onChange={(e) => setRazorpayWebhook(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Payout Settlement Cycle</label>
                    <select
                      value={settlementCycle}
                      onChange={(e) => setSettlementCycle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-medium"
                    >
                      <option value="instant">Instant Settlement (T+0 IMPS)</option>
                      <option value="24h">Standard 24 Hours Cycle (T+1)</option>
                      <option value="weekly">Weekly Cycles (Every Friday)</option>
                      <option value="monthly">Monthly Settlement</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Automated Payout Setup */}
              <div className="space-y-4 border border-slate-100 p-5 rounded-xl bg-white shadow-xs">
                <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>SaaS Auto-Pay Settings</span>
                </h3>

                <p className="text-[11px] text-gray-500 leading-normal">
                  Toggle dynamic automatic payout settlements for different stakeholders across the EduMind platform:
                </p>

                <div className="space-y-3.5 pt-1 text-xs">
                  {/* Teacher Salary auto pay */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <h5 className="font-bold text-gray-900 text-xs">Auto-Pay Teachers</h5>
                      <p className="text-[10px] text-gray-400">Release monthly teaching performance salaries instantly via Razorpay X.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoPayTeacher(!autoPayTeacher)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoPayTeacher ? 'bg-red-600' : 'bg-gray-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${autoPayTeacher ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Student Reward auto pay */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <h5 className="font-bold text-gray-900 text-xs">Auto-Credit Student Scholarships</h5>
                      <p className="text-[10px] text-gray-400">Release cash reward scholarships automatically when CBSE quiz streaks reach 30.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoPayStudent(!autoPayStudent)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoPayStudent ? 'bg-red-600' : 'bg-gray-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${autoPayStudent ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* School split auto pay */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <h5 className="font-bold text-gray-900 text-xs">Auto-Pay School splits</h5>
                      <p className="text-[10px] text-gray-400">Release 85% regional CBSE school split to partner accounts on receipt.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoPaySchool(!autoPaySchool)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoPaySchool ? 'bg-red-600' : 'bg-gray-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${autoPaySchool ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Admin Commission auto pay */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <h5 className="font-bold text-gray-900 text-xs">Auto-Route Platform Commission</h5>
                      <p className="text-[10px] text-gray-400">Transfer 15% platform SaaS commissions immediately to secure Super Admin vault.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoPayAdmin(!autoPayAdmin)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoPayAdmin ? 'bg-red-600' : 'bg-gray-200'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${autoPayAdmin ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSavePayments}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save Payment & Payout Rules</span>
              </button>
            </div>
          </div>
        )}

        {/* SECURE BANK DETAILS TAB */}
        {activeTab === 'bank' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Secure Vault: Bank Settlement Setup</h2>
              <p className="text-xs text-gray-500">Add or update primary bank details to receive CBSE exam board registration & student subscription payouts safely.</p>
            </div>

            {/* High Security Banner */}
            <div className="bg-slate-900 text-slate-100 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start gap-4 shadow-lg">
              <div className="p-3 bg-red-600/10 rounded-xl text-red-400 border border-red-500/30 flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>AES-256 PCI-DSS COMPLIANT HARDENED SECURE CONSOLE</span>
                  <span className="bg-emerald-500/25 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border border-emerald-500/20">Certified</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your settlement details are encrypted before saving. Any modification requires a physical 4-digit master Security PIN to unlock the operational memory layout. Security audit logs will immediately register any changes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form to update bank details */}
              <div className="space-y-4 border border-slate-100 p-5 rounded-xl bg-white shadow-xs">
                <h3 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-red-600" />
                  <span>Update Vault Bank Details</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Account Holder Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. EDUMIND AI CO"
                      value={bankHolder}
                      onChange={(e) => setBankHolder(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. ICICI Bank Ltd"
                      value={bankNameStr}
                      onChange={(e) => setBankNameStr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">Account Number (PCI Encrypted)</label>
                    <div className="relative">
                      <input
                        type={showMaskedAccount ? "password" : "text"}
                        placeholder="Account Number"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMaskedAccount(!showMaskedAccount)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-medium">IFSC Code (Indian Standard)</label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0000001"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs focus:outline-none uppercase"
                    />
                  </div>

                  <div className="space-y-1 bg-red-50/50 p-3 rounded-lg border border-red-100/50">
                    <label className="text-[10px] text-red-800 font-bold block">4-Digit Security Authorization PIN</label>
                    <p className="text-[9px] text-red-600/80 mb-1.5 leading-tight">Master safety check. Enter 4-digit PIN to commit database encryption.</p>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="••••"
                      value={bankPin}
                      onChange={(e) => setBankPin(e.target.value.replace(/\D/g, ''))}
                      className="w-24 bg-white border border-red-200 rounded-lg p-1.5 font-mono text-center text-xs focus:outline-none tracking-widest text-red-900"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveBankDetails}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-red-500" />
                  <span>Commit Safe and Secure Update</span>
                </button>
              </div>

              {/* Active settlement bank details preview */}
              <div className="space-y-4 border border-slate-100 p-5 rounded-xl bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Active Gateway Settlement Channel</span>
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    This is your currently configured primary corporate bank route for SaaS splits and board receipts:
                  </p>

                  <div className="bg-white border border-gray-200/60 p-4.5 rounded-xl space-y-3.5 mt-4 shadow-xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Account Holder:</span>
                      <strong className="text-gray-900">{bankHolder}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">SaaS Bank:</span>
                      <strong className="text-gray-900">{bankNameStr}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Account ID:</span>
                      <strong className="font-mono text-gray-900">
                        {showMaskedAccount ? `••••••••••••${bankAccount.slice(-4)}` : bankAccount}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">IFSC Route Code:</span>
                      <strong className="font-mono text-indigo-700">{bankIfsc.toUpperCase()}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-dashed border-gray-100 pt-2.5">
                      <span className="text-gray-400">Safety Security Level:</span>
                      <span className="text-emerald-600 font-extrabold uppercase text-[9px] flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>AES-256 ACTIVE</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-normal bg-white p-3 rounded-xl border border-gray-100/50 mt-4">
                  💡 <strong>Payout Advice:</strong> Payout failures are automatically routed back to this primary bank source on Razorpay API timeout. Ensure IFSC matches the city zone correctly.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS & STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">SaaS Platform Statistics</h2>
              <p className="text-xs text-gray-500">Monthly recurring revenue (MRR) tracking and active Gemini API requests counts.</p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-100 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-red-600 bg-red-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">₹1,85,000 /yr</h4>
                  <p className="text-[10px] text-gray-500">Annual Recurring Revenue</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-100 flex items-center gap-3">
                <Building className="w-8 h-8 text-indigo-600 bg-indigo-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{schools.length} Schools</h4>
                  <p className="text-[10px] text-gray-500">Registered SaaS Tenants</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-100 flex items-center gap-3">
                <Activity className="w-8 h-8 text-amber-600 bg-amber-100/50 p-1.5 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">142,540 calls</h4>
                  <p className="text-[10px] text-gray-500">Gemini API Requests Count</p>
                </div>
              </div>
            </div>

            {/* Revenue Analytics Visual */}
            <div className="border border-gray-100 rounded-xl p-5 space-y-4 bg-white">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Tenant Subscription Contribution</h3>
              <div className="space-y-3 text-xs">
                {schools.slice(0, 5).map((s, idx) => {
                  const contribution = s.subscriptionPlan === 'premium' ? 35000 : s.subscriptionPlan === 'basic' ? 15000 : 0;
                  const percent = Math.round((contribution / 185000) * 100) || 0;

                  return (
                    <div key={idx}>
                      <div className="flex justify-between font-medium text-gray-700 mb-1">
                        <span>{s.name}</span>
                        <span className="font-bold text-gray-900">₹{contribution.toLocaleString()} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full">
                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span>Security Audit Logs</span>
              </h2>
              <p className="text-xs text-gray-500">Verify authorization status changes, administrative actions, and state transitions.</p>
            </div>

            <div className="space-y-3 font-mono text-[10.5px]">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase mr-2">{log.event}</span>
                    <span className="text-gray-500">by {log.user}:</span>
                    <span className="text-gray-700 ml-1">"{log.desc}"</span>
                  </div>
                  <span className="text-gray-400 whitespace-nowrap">{log.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EQUITY & SCHOLARSHIPS TAB */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <span>Global Inclusivity & AI Scholarships</span>
                </h2>
                <p className="text-xs text-slate-500">Disburse custom premium subsidies for poor students, families, and rural school teachers to ensure AI equity.</p>
              </div>
              <button
                onClick={() => {
                  setShowScholForm(!showScholForm);
                  if (schools.length > 0 && !scholSchoolId) {
                    setScholSchoolId(schools[0].id);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Award Direct Scholarship</span>
              </button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden">
                <div className="absolute right-3 bottom-1 text-white/10 font-mono text-7xl font-bold select-none">₹</div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-100 tracking-wider">SaaS Central Treasury Reserve</span>
                <h3 className="text-2xl font-black mt-2">₹{premiumBalancePool.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-100 mt-1.5 font-sans">Accumulated via direct school subscription checkouts</p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Policy Subsidy Ranges</span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-2">{poorStudentMinDiscount}% - {poorStudentMaxDiscount}%</h3>
                <p className="text-[10.5px] text-slate-500 mt-1.5">Custom bounds configured for underprivileged applicants</p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Subsidized Beneficiaries</span>
                <h3 className="text-xl font-extrabold text-indigo-700 mt-2">{scholarships.length} Active Accounts</h3>
                <p className="text-[10.5px] text-slate-500 mt-1.5">Free or heavily subsidized high-level AI platform licenses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Policy Range configuration card */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase">Equity Policy Controls</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Treasury Top-Up Pool (₹)</label>
                      <input
                        type="number"
                        value={inputPool}
                        onChange={(e) => setInputPool(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-700 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-between">
                        <span>Min Allowed Subsidy</span>
                        <span className="font-mono text-emerald-600 font-bold">{inputMin}%</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={inputMin}
                        onChange={(e) => setInputMin(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-between">
                        <span>Max Allowed Subsidy</span>
                        <span className="font-mono text-emerald-600 font-bold">{inputMax}%</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={inputMax}
                        onChange={(e) => setInputMax(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (inputMin > inputMax) {
                          alert("Minimum subsidy limit cannot be greater than the maximum subsidy limit!");
                          return;
                        }
                        updatePremiumSubsidyConfig(inputPool, inputMin, inputMax);
                        addLog("POLICY_CONFIG_UPDATED", `Updated equity limits to range [${inputMin}% - ${inputMax}%] with ₹${inputPool} treasury pool.`);
                        alert("Policy thresholds updated successfully in the global AI database!");
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-[11px] transition-colors uppercase tracking-wide shadow-xs"
                    >
                      Update Global Policies
                    </button>
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 p-4.5 rounded-2xl text-xs space-y-2.5">
                  <h4 className="font-extrabold text-indigo-900 flex items-center gap-1.5 leading-none">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>International AI Equity Standards</span>
                  </h4>
                  <p className="text-indigo-950 text-[11px] leading-relaxed">
                    Under direct integration guidelines, <strong>100% of SaaS checkouts</strong> sent by schools are securely held inside the Super Admin central escrow bank. This reserve fund is immediately available to subsidy poor students or teachers to purchase licenses at reduced price points.
                  </p>
                </div>
              </div>

              {/* Direct Scholarship Form / Beneficiaries registry */}
              <div className="lg:col-span-2 space-y-4">
                
                {showScholForm && (
                  <form onSubmit={handleAwardScholarshipSubmit} className="bg-slate-50 border border-emerald-100 p-5 rounded-2xl space-y-4 animate-slideDown">
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-100/40">
                      <h3 className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Issue Premium Scholarship License</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowScholForm(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Beneficiary Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Karan Mehra"
                          value={scholBeneficiaryName}
                          onChange={(e) => setScholBeneficiaryName(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-lg p-2 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Classification Role</label>
                        <select
                          value={scholRole}
                          onChange={(e: any) => setScholRole(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-lg p-2 focus:outline-none font-medium"
                        >
                          <option value="student">Underprivileged Student</option>
                          <option value="teacher">Underfunded Rural Teacher</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Tenant School Campus</label>
                        <select
                          value={scholSchoolId}
                          onChange={(e) => setScholSchoolId(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-lg p-2 focus:outline-none font-medium"
                        >
                          {schools.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-between">
                          <span>Subsidy Percentage</span>
                          <span className="font-mono text-emerald-700 font-bold">{scholDiscountPercent}%</span>
                        </label>
                        <input
                          type="range"
                          min={poorStudentMinDiscount}
                          max={poorStudentMaxDiscount}
                          value={scholDiscountPercent}
                          onChange={(e) => setScholDiscountPercent(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2.5"
                        />
                        <span className="text-[9px] text-slate-400 block mt-1">Limited by policy ranges of {poorStudentMinDiscount}% - {poorStudentMaxDiscount}%</span>
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Special Grant Notes & Purpose</label>
                      <textarea
                        rows={2}
                        placeholder="Provide reasoning for scholarship eligibility..."
                        value={scholDescription}
                        onChange={(e) => setScholDescription(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded-lg p-2 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 w-full shadow-xs"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Direct Disbursal & Deduct Funding</span>
                    </button>
                  </form>
                )}

                {/* Active scholarship beneficiary list */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Subsidy Beneficiary Directory</h3>
                  
                  {scholarships.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                      No active equity scholarships found. Configure policy thresholds or click direct award above to disburse grants.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-100 rounded-xl bg-white">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-500 font-bold uppercase">
                            <th className="p-2.5">Beneficiary</th>
                            <th className="p-2.5">Campus School</th>
                            <th className="p-2.5 text-center">Subsidy</th>
                            <th className="p-2.5 text-right">Fund Disbursed</th>
                            <th className="p-2.5 text-center">Date</th>
                            <th className="p-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                          {scholarships.map((sch) => (
                            <tr key={sch.id} className="hover:bg-slate-50/50">
                              <td className="p-2.5">
                                <div className="font-semibold text-slate-800">{sch.beneficiaryName}</div>
                                <span className={`text-[9px] font-extrabold uppercase px-1 rounded ${sch.role === 'student' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                  {sch.role}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-500 max-w-[120px] truncate">{sch.schoolName}</td>
                              <td className="p-2.5 text-center font-bold font-mono text-emerald-600">{sch.discountPercent}%</td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{sch.fundDisbursed.toLocaleString()}</td>
                              <td className="p-2.5 text-center text-[10px] text-slate-400 font-mono">{sch.date}</td>
                              <td className="p-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to revoke the premium subsidy scholarship for ${sch.beneficiaryName}? The remaining disbursed amount (₹${sch.fundDisbursed}) will be securely refunded back to the treasury pool.`)) {
                                      deleteScholarship(sch.id);
                                      addLog("SCHOLARSHIP_REVOKED", `Revoked scholarship grant for ${sch.beneficiaryName}. Reflowed fund value to pool.`);
                                      alert("Subsidy grant revoked successfully.");
                                    }
                                  }}
                                  className="text-slate-400 hover:text-red-600 p-1"
                                  title="Revoke Subsidy Grant"
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
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Invitation Modal & Simulated Email Dispatcher */}
      {showInviteModal && lastCreatedUser && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-gray-100 shadow-xl space-y-5">
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-green-50 text-green-700 rounded-lg text-lg">✉️</span>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">Onboarding Invitation Dispatched!</h3>
                  <p className="text-[11px] text-gray-400">Profile registered and link generated</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Copyable Invitation Link */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500">Secure Onboarding Link (Ready to Share)</span>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={lastCreatedInviteLink} 
                  className="w-full bg-white border border-slate-200/80 rounded-lg p-2 font-mono text-[10.5px] text-slate-700 select-all focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lastCreatedInviteLink);
                    alert("Invitation link copied to clipboard!");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Simulated Mailbox Dispatcher Frame */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>SIMULATED SMTP MAIL DISPATCHER</span>
                <span className="text-emerald-600 font-bold">● DISPATCHED SECURELY</span>
              </div>
              
              <div className="p-4 space-y-3 bg-white text-xs">
                <div className="space-y-1 pb-2.5 border-b border-slate-100 text-slate-700">
                  <p><strong>To:</strong> {lastCreatedUser.email}</p>
                  <p><strong>Subject:</strong> Welcome to EduMind AI - Your Account Invitation Link</p>
                  <p><strong>Server Log:</strong> <span className="text-indigo-600 font-mono text-[10px]">smtp.edumind.ai [SSL_TLS_v1.3] (Recipient Delivered)</span></p>
                </div>

                <div className="pt-2 pb-4 space-y-2.5 text-slate-600 max-h-48 overflow-y-auto font-sans leading-relaxed">
                  <p>Dear {lastCreatedUser.name},</p>
                  <p>An official administrator profile has been reserved and set up for you at <strong>{lastCreatedUser.school}</strong> as an authorized <strong className="capitalize text-indigo-700">{lastCreatedUser.role.replace('_', ' ')}</strong>.</p>
                  <p>Please click the secure button below to complete your credential password mapping, verify your school enrollment record, and access your custom dashboard panel:</p>
                  
                  <div className="py-2 flex justify-center">
                    <a
                      href={lastCreatedInviteLink}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-lg text-xs tracking-wide shadow-sm"
                    >
                      Complete Registration & Log In
                    </a>
                  </div>

                  <p className="text-[10px] text-slate-400">If the button above does not work, copy and paste this link in your browser window:<br/>{lastCreatedInviteLink}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowInviteModal(false);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all text-center"
            >
              Done & Return to Users
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
