/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, HelpCircle } from 'lucide-react';
import { useSaaSState } from '../lib/stateStore';

export default function SuperAdminLoginGate() {
  const { setSuperAdminAuthenticated } = useSaaSState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '$hiv@8985' && password.trim() === '$hiv@6305') {
      setIsSuccess(true);
      setError('');
      setTimeout(() => {
        setSuperAdminAuthenticated(true);
      }, 800);
    } else {
      setError('Invalid Super Admin credential signature. Please check your credentials.');
    }
  };

  return (
    <div id="sa-login-gate" className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
          {isSuccess ? (
            <CheckCircle2 className="w-8 h-8 animate-bounce text-emerald-600" />
          ) : (
            <Lock className="w-7 h-7" />
          )}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Super Admin Security Gate</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Authorized console to manage 1,000+ school tenants across India. Decryption credentials required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 text-red-700 text-xs font-medium">
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Super Admin ID</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <KeyRound className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              required
              placeholder="e.g. $hiv@8985"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Access Key Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </span>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md focus:outline-none ${
            isSuccess 
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
              : 'bg-[#0F172A] hover:bg-slate-800 shadow-slate-200'
          }`}
        >
          {isSuccess ? 'Authorizing Desk...' : 'Decrypt & Access Console'}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-red-500" />
          Secure 256-bit SHA Session
        </span>
        <span className="font-semibold text-indigo-600">CBSE Multi-Tenant Core</span>
      </div>
    </div>
  );
}
