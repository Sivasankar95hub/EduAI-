/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher' | 'parent' | 'school_admin' | 'super_admin';

export interface School {
  id: string;
  name: string;
  logo: string;
  themeColor: string; // 'violet' | 'emerald' | 'amber' | 'cyan' | 'indigo'
  tagline?: string;
  subscriptionPlan: 'trial' | 'basic' | 'premium';
  subscriptionExpiry: string;
  address: string;
  studentCount: number;
  teacherCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string;
  avatar?: string;
  grade?: string; // for students (e.g., "Class 9")
  section?: string; // for students (e.g., "Section A")
  subjects?: string[]; // for teachers
  childId?: string; // for parents
  streak?: number;
  badges?: string[];
  points?: number;
}

export interface CBSEContent {
  id: string;
  subject: string;
  grade: string;
  chapter: string;
  title: string;
  type: 'concept' | 'activity' | 'casestudy' | 'mcq' | 'worksheet' | 'notes';
  summary: string;
  contentMarkdown: string;
  mindMapUrl?: string;
}

export interface Homework {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  assignedBy: string; // Teacher name
  assignedDate: string;
  dueDate: string;
  points: number;
  status: 'pending' | 'submitted' | 'graded';
  submissionText?: string;
  gradeFeedback?: string;
  score?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  example: string;
  similarQuestion: string;
}

export interface QuizResult {
  id: string;
  studentId: string;
  topic: string;
  subject: string;
  score: number;
  totalQuestions: number;
  date: string;
  feedback: string;
  weakTopics: string[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  role: UserRole | 'all';
  schoolId?: string;
  date: string;
  read: boolean;
}

export interface SubscriptionPlan {
  id: 'trial' | 'basic' | 'premium';
  name: string;
  priceINR: number;
  billingPeriod: string;
  features: string[];
  maxStudents: number;
}

export interface Observation {
  id: string;
  studentId: string;
  studentName: string;
  observedBy: string;
  date: string;
  category: 'Academic' | 'Behavioral' | 'Skill Progression' | 'NEP Alignment' | 'Co-Curricular';
  comment: string;
  severity: 'Positive' | 'Neutral' | 'Action Needed';
}

