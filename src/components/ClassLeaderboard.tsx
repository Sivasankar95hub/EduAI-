/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSaaSState } from '../lib/stateStore';
import { Award, Trophy, Zap, Flame, User, Star, TrendingUp } from 'lucide-react';

export default function ClassLeaderboard() {
  const { allUsers, currentUser } = useSaaSState();

  // Filter students from the same school and same grade/class
  const classStudents = allUsers
    .filter(u => u.role === 'student' && u.schoolId === currentUser.schoolId && u.grade === currentUser.grade)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  // Find user's overall index in their class
  const userRankIndex = classStudents.findIndex(u => u.id === currentUser.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;

  // Get the top 5 students in class
  const top5Students = classStudents.slice(0, 5);

  // Check if current user is inside the top 5 list
  const isUserInTop5 = userRank !== null && userRank <= 5;

  return (
    <div 
      id="class-leaderboard-widget" 
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Class Rank Leaderboard</h3>
            <p className="text-[10px] text-slate-400 font-medium">Top students in {currentUser.grade || 'your class'}</p>
          </div>
        </div>
        <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          📚 CBSE {currentUser.grade || 'Class'}
        </span>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-2">
        {top5Students.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            <User className="w-8 h-8 text-slate-200 mx-auto mb-1" />
            <p>No classmate ranking data available.</p>
          </div>
        ) : (
          top5Students.map((student, idx) => {
            const rank = idx + 1;
            const isSelf = student.id === currentUser.id;

            return (
              <div
                key={student.id}
                className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                  isSelf
                    ? 'bg-gradient-to-r from-indigo-50/80 to-indigo-100/50 border-2 border-indigo-400 shadow-sm font-bold scale-[1.01]'
                    : 'bg-slate-50/50 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-xs">
                    {rank === 1 ? (
                      <span className="text-base" title="1st Place">🥇</span>
                    ) : rank === 2 ? (
                      <span className="text-base" title="2nd Place">🥈</span>
                    ) : rank === 3 ? (
                      <span className="text-base" title="3rd Place">🥉</span>
                    ) : (
                      <span className="text-slate-400 font-mono">#{rank}</span>
                    )}
                  </div>

                  {/* Avatar & Profile */}
                  <span className="text-2xl">{student.avatar || "👦"}</span>
                  <div>
                    <p className="text-xs text-slate-800 font-bold flex items-center gap-1.5">
                      <span>{student.name}</span>
                      {isSelf && (
                        <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-sm font-black tracking-wider uppercase">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">
                      Section {student.section || 'A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Streak */}
                  {student.streak && student.streak > 0 && (
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5" title="Active Daily Learning Streak">
                      🔥 {student.streak}
                    </span>
                  )}
                  {/* Points */}
                  <span className="text-xs font-black text-slate-700 font-mono">
                    {student.points || 0} MP
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* If current user is not in the top 5, render their standing at the bottom */}
      {!isUserInTop5 && userRank !== null && (
        <div className="pt-2">
          <div className="border-t border-dashed border-slate-200 pt-3">
            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2">Your Position in Class</p>
            <div className="p-3 bg-indigo-50/60 rounded-xl border-2 border-indigo-400 flex items-center justify-between font-bold">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-slate-600 font-mono text-xs">
                  #{userRank}
                </div>
                <span className="text-2xl">{currentUser.avatar || "👦"}</span>
                <div>
                  <p className="text-xs text-slate-800 font-black flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-sm font-black tracking-wider uppercase">
                      YOU
                    </span>
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">
                    Section {currentUser.section || 'A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {currentUser.streak && currentUser.streak > 0 && (
                  <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    🔥 {currentUser.streak}
                  </span>
                )}
                <span className="text-xs font-black text-indigo-700 font-mono">
                  {currentUser.points || 0} MP
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini Motivational Prompt */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start gap-2">
        <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-normal font-medium">
          {userRank === 1 
            ? "Outstanding! You are leading your CBSE class board! Keep up the brilliant study consistency."
            : `Complete CBSE daily quizzes, read interactive lessons with Shiv AI, and clear doubts to climb higher in your CBSE class ranking!`
          }
        </p>
      </div>
    </div>
  );
}
