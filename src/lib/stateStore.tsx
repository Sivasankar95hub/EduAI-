/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { School, UserProfile, CBSEContent, Homework, QuizResult, UserRole, SystemNotification, Observation } from '../types';
import { INITIAL_SCHOOLS, INITIAL_USERS, CBSE_AI_CURRICULUM, INITIAL_HOMEWORKS, INITIAL_QUIZ_RESULTS, SYSTEM_NOTIFICATIONS } from './mockData';
import { db, isFirebaseConnected } from './firebase';

const GENERATED_CITIES = [
  "New Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Noida", "Gurugram", "Chandigarh", "Dehradun", "Kochi", "Patna", "Ranchi", "Bhopal", "Indore", "Guwahati",
  "Bhubaneswar", "Thiruvananthapuram", "Vijayawada", "Visakhapatnam", "Nagpur", "Surat", "Rajkot", "Vadodara", "Coimbatore", "Madurai"
];

const GENERATED_PREFIXES = [
  "Kendriya Vidyalaya", "DAV Public School", "Delhi Public School", "Army Public School", "Jawahar Navodaya Vidyalaya",
  "Sanskriti Academy", "Ryan International", "Chinmaya Vidyalaya", "Little Flower School", "St. Xavier's High School",
  "Bal Bharati School", "Modern School", "Amity International", "G.D. Goenka School", "Podar International",
  "Swaminarayan Gurukul", "Heritage School", "Lotus Valley School", "Greenwood High", "Orchid International"
];

export function generate1000Schools(): School[] {
  const list = [...INITIAL_SCHOOLS];
  const plans: Array<'trial' | 'basic' | 'premium'> = ['trial', 'basic', 'premium'];
  const themes = ['indigo', 'emerald', 'amber', 'cyan'];
  const logos = ['🎓', '💻', '🌟', '🏫', '🔬', '🎨', '🚀', '🧠'];
  
  for (let i = 1; i <= 1015; i++) {
    const prefix = GENERATED_PREFIXES[i % GENERATED_PREFIXES.length];
    const city = GENERATED_CITIES[i % GENERATED_CITIES.length];
    const plan = plans[i % plans.length];
    const theme = themes[i % themes.length];
    const logo = logos[i % logos.length];
    
    list.push({
      id: `school-gen-${i}`,
      name: `${prefix}, ${city} (No. ${100 + i})`,
      logo: logo,
      themeColor: theme,
      tagline: `Empowering 21st century learners through NEP model.`,
      subscriptionPlan: plan,
      subscriptionExpiry: `2027-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      address: `CBSE Zone ${i % 5 + 1}, Main Campus, ${city}, India`,
      studentCount: Math.floor(Math.random() * 800) + 120,
      teacherCount: Math.floor(Math.random() * 40) + 12
    });
  }
  return list;
}

interface SaaSContextType {
  schools: School[];
  activeSchool: School;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  homeworks: Homework[];
  quizResults: QuizResult[];
  contentList: CBSEContent[];
  notifications: SystemNotification[];
  observations: Observation[];
  language: string;
  isDbConnected: boolean;
  switchRole: (role: UserRole) => void;
  switchSchool: (schoolId: string) => void;
  switchLanguage: (lang: string) => void;
  submitHomework: (homeworkId: string, text: string) => void;
  gradeHomework: (homeworkId: string, score: number, feedback: string) => void;
  addHomework: (hw: Omit<Homework, 'id' | 'schoolId'>) => void;
  addQuizResult: (res: Omit<QuizResult, 'id'>) => void;
  addContent: (content: Omit<CBSEContent, 'id'>) => void;
  addSchool: (school: Omit<School, 'id'>) => void;
  deleteSchool: (schoolId: string) => void;
  deleteUser: (userId: string) => void;
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  updateUser: (userId: string, user: Partial<UserProfile>) => void;
  addObservation: (obs: Omit<Observation, 'id'>) => void;
  deleteObservation: (id: string) => void;
  updateSubscription: (schoolId: string, planId: 'trial' | 'basic' | 'premium') => void;
  addNotification: (title: string, message: string, role: UserRole | 'all') => void;
  awardPoints: (amount: number, reason: string) => void;
  awardBadge: (badgeName: string) => void;
  isSuperAdminAuthenticated: boolean;
  setSuperAdminAuthenticated: (val: boolean) => void;
  isImpersonating: boolean;
  stopImpersonating: () => void;
  startImpersonating: (userId: string, schoolId: string, role: UserRole) => void;
  premiumBalancePool: number;
  poorStudentMinDiscount: number;
  poorStudentMaxDiscount: number;
  scholarships: any[];
  updatePremiumSubsidyConfig: (pool: number, min: number, max: number) => void;
  awardScholarship: (schoolId: string, beneficiaryName: string, role: 'student' | 'teacher', discountPercent: number, description: string) => void;
  deleteScholarship: (id: string) => void;
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

export function SaaSProvider({ children }: { children: React.ReactNode }) {
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('edumind_schools');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length >= 1000) {
          return parsed;
        }
      } catch (e) {}
    }
    return generate1000Schools();
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('edumind_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('edumind_current_user');
    if (saved) return JSON.parse(saved);
    // Default to a student Aarav
    return INITIAL_USERS.find(u => u.id === 'user-student-1') || INITIAL_USERS[0];
  });

  const [activeSchool, setActiveSchool] = useState<School>(() => {
    const defaultSchool = INITIAL_SCHOOLS.find(s => s.id === currentUser.schoolId) || INITIAL_SCHOOLS[0];
    return defaultSchool;
  });

  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    const saved = localStorage.getItem('edumind_homeworks');
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORKS;
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('edumind_quiz_results');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_RESULTS;
  });

  const [contentList, setContentList] = useState<CBSEContent[]>(() => {
    const saved = localStorage.getItem('edumind_contents');
    return saved ? JSON.parse(saved) : CBSE_AI_CURRICULUM;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('edumind_notifications');
    return saved ? JSON.parse(saved) : SYSTEM_NOTIFICATIONS;
  });

  const [observations, setObservations] = useState<Observation[]>(() => {
    const saved = localStorage.getItem('edumind_observations');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'obs-1',
        studentId: 'user-student-1',
        studentName: 'Aarav Patel',
        observedBy: 'Mrs. Suman Sharma (Principal)',
        date: '2026-07-05',
        category: 'Academic',
        comment: 'Demonstrated exceptional grasp of AI Ethical issues and machine bias during the Class 9 debate.',
        severity: 'Positive'
      },
      {
        id: 'obs-2',
        studentId: 'user-student-1',
        studentName: 'Aarav Patel',
        observedBy: 'Mr. Alok Banerjee (Teacher)',
        date: '2026-07-03',
        category: 'Skill Progression',
        comment: 'Successfully compiled a multi-loop Python list sorting program ahead of the class timetable.',
        severity: 'Positive'
      },
      {
        id: 'obs-3',
        studentId: 'user-student-1b',
        studentName: 'Rohan Gupta',
        observedBy: 'Mr. Alok Banerjee (Teacher)',
        date: '2026-07-04',
        category: 'Behavioral',
        comment: 'Requires slight reinforcement on submitting Python homework assignments within the designated deadline.',
        severity: 'Action Needed'
      }
    ];
  });

  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('edumind_lang') || 'English';
  });

  const [isSuperAdminAuthenticated, setSuperAdminAuthenticatedState] = useState<boolean>(() => {
    return localStorage.getItem('edumind_super_auth') === 'true';
  });

  const [isImpersonating, setIsImpersonating] = useState<boolean>(() => {
    return localStorage.getItem('edumind_is_impersonating') === 'true';
  });

  const [premiumBalancePool, setPremiumBalancePool] = useState<number>(() => {
    const saved = localStorage.getItem('edumind_premium_pool');
    return saved ? parseInt(saved, 10) : 1250000;
  });

  const [poorStudentMinDiscount, setPoorStudentMinDiscount] = useState<number>(() => {
    const saved = localStorage.getItem('edumind_poor_min_discount');
    return saved ? parseInt(saved, 10) : 50;
  });

  const [poorStudentMaxDiscount, setPoorStudentMaxDiscount] = useState<number>(() => {
    const saved = localStorage.getItem('edumind_poor_max_discount');
    return saved ? parseInt(saved, 10) : 95;
  });

  const [scholarships, setScholarships] = useState<any[]>(() => {
    const saved = localStorage.getItem('edumind_scholarships');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'schol-1',
        schoolId: 'school-1',
        schoolName: 'NEP Future Academy, New Delhi',
        beneficiaryName: 'Rohan Gupta',
        role: 'student',
        discountPercent: 90,
        fundDisbursed: 31500,
        date: '2026-07-04',
        description: 'Special cognitive scholarship for AI learning enablement under Right to Education (RTE) act.'
      },
      {
        id: 'schol-2',
        schoolId: 'school-2',
        schoolName: 'CBSE Smart Tech School, Bengaluru',
        beneficiaryName: 'Asha Devi',
        role: 'teacher',
        discountPercent: 85,
        fundDisbursed: 12750,
        date: '2026-07-05',
        description: 'Faculty empowerment grant for international AI curriculum certification.'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('edumind_premium_pool', String(premiumBalancePool));
  }, [premiumBalancePool]);

  useEffect(() => {
    localStorage.setItem('edumind_poor_min_discount', String(poorStudentMinDiscount));
  }, [poorStudentMinDiscount]);

  useEffect(() => {
    localStorage.setItem('edumind_poor_max_discount', String(poorStudentMaxDiscount));
  }, [poorStudentMaxDiscount]);

  useEffect(() => {
    localStorage.setItem('edumind_scholarships', JSON.stringify(scholarships));
  }, [scholarships]);

  const setSuperAdminAuthenticated = (val: boolean) => {
    setSuperAdminAuthenticatedState(val);
    localStorage.setItem('edumind_super_auth', String(val));
    if (!val) {
      localStorage.removeItem('edumind_super_auth');
    }
  };

  useEffect(() => {
    localStorage.setItem('edumind_is_impersonating', String(isImpersonating));
  }, [isImpersonating]);

  // Persist State to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('edumind_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('edumind_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('edumind_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    setAllUsers(prev => {
      const found = prev.find(u => u.id === currentUser.id);
      if (found && found.points === currentUser.points && JSON.stringify(found.badges) === JSON.stringify(currentUser.badges) && found.streak === currentUser.streak) {
        return prev;
      }
      return prev.map(u => u.id === currentUser.id ? currentUser : u);
    });
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('edumind_homeworks', JSON.stringify(homeworks));
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem('edumind_quiz_results', JSON.stringify(quizResults));
  }, [quizResults]);

  useEffect(() => {
    localStorage.setItem('edumind_contents', JSON.stringify(contentList));
  }, [contentList]);

  useEffect(() => {
    localStorage.setItem('edumind_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('edumind_observations', JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem('edumind_lang', language);
  }, [language]);

  // Sync active school whenever currentUser changes
  useEffect(() => {
    if (currentUser.schoolId === 'all') {
      // Super Admin mode: default to school-1 but allow switching
      const school = schools.find(s => s.id === activeSchool.id) || schools[0];
      setActiveSchool(school);
    } else {
      const school = schools.find(s => s.id === currentUser.schoolId);
      if (school) {
        setActiveSchool(school);
      }
    }
  }, [currentUser, schools]);

  // Helper actions
  const switchRole = (role: UserRole) => {
    // Find first user with this role
    const found = allUsers.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      const school = schools.find(s => s.id === found.schoolId);
      if (school) {
        setActiveSchool(school);
      }
    } else {
      // Create on the fly
      const newU: UserProfile = {
        id: `user-temp-${role}`,
        name: `Demo ${role.replace('_', ' ').toUpperCase()}`,
        email: `${role}@edumind.ai`,
        role: role,
        schoolId: role === 'super_admin' ? 'all' : 'school-1',
        avatar: role === 'student' ? '👦' : role === 'teacher' ? '👨‍🏫' : role === 'parent' ? '👨' : '🏢'
      };
      setAllUsers(prev => [...prev, newU]);
      setCurrentUser(newU);
    }
  };

  const switchSchool = (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      setActiveSchool(school);
      // For student/teacher/parent/admin, switch their context if their role is linked to school
      if (currentUser.role !== 'super_admin') {
        const matchingUser = allUsers.find(u => u.schoolId === schoolId && u.role === currentUser.role);
        if (matchingUser) {
          setCurrentUser(matchingUser);
        } else {
          // Update current user school
          setCurrentUser(prev => ({ ...prev, schoolId }));
        }
      }
    }
  };

  const switchLanguage = (lang: string) => {
    setLanguage(lang);
  };

  const startImpersonating = (userId: string, schoolId: string, role: UserRole) => {
    if (!isImpersonating) {
      localStorage.setItem('edumind_saved_super_user', JSON.stringify(currentUser));
      setIsImpersonating(true);
    }
    
    let targetUser = allUsers.find(u => u.schoolId === schoolId && u.role === role);
    if (!targetUser) {
      const targetSchool = schools.find(s => s.id === schoolId);
      const schoolName = targetSchool ? targetSchool.name.split(',')[0] : "Target School";
      targetUser = {
        id: `user-impersonated-${schoolId}-${role}-${Date.now()}`,
        name: `Proxy ${role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} (${schoolName})`,
        email: `${role}@${schoolId.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
        role: role,
        schoolId: schoolId,
        avatar: role === 'student' ? '👦' : role === 'teacher' ? '👨‍🏫' : role === 'parent' ? '👨' : '🏢',
        grade: role === 'student' ? 'Class 9' : undefined,
        section: role === 'student' ? 'Section A' : undefined,
        streak: role === 'student' ? 5 : undefined,
        badges: role === 'student' ? ['Consistent Learner'] : undefined,
        points: role === 'student' ? 150 : undefined,
        subjects: role === 'teacher' ? ['Artificial Intelligence', 'Science'] : undefined
      };
      setAllUsers(prev => [...prev, targetUser!]);
    }
    
    setCurrentUser(targetUser);
    localStorage.setItem('edumind_current_user', JSON.stringify(targetUser));
    
    const sch = schools.find(s => s.id === schoolId);
    if (sch) {
      setActiveSchool(sch);
    }
  };

  const stopImpersonating = () => {
    const savedSuperStr = localStorage.getItem('edumind_saved_super_user');
    if (savedSuperStr) {
      try {
        const savedSuper = JSON.parse(savedSuperStr);
        setCurrentUser(savedSuper);
        localStorage.setItem('edumind_current_user', JSON.stringify(savedSuper));
      } catch (e) {}
    } else {
      switchRole('super_admin');
    }
    setIsImpersonating(false);
    localStorage.removeItem('edumind_saved_super_user');
  };

  const submitHomework = (homeworkId: string, text: string) => {
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === homeworkId) {
        return { ...hw, status: 'submitted', submissionText: text };
      }
      return hw;
    }));
    addNotification('Homework Submitted', `${currentUser.name} submitted the homework for ${currentUser.grade}.`, 'teacher');
  };

  const gradeHomework = (homeworkId: string, score: number, feedback: string) => {
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === homeworkId) {
        return { ...hw, status: 'graded', score, gradeFeedback: feedback };
      }
      return hw;
    }));
    // Find student of homework
    addNotification('Homework Graded', `Homework scored ${score} points with feedback: "${feedback}".`, 'student');
    addNotification('Homework Graded', `Your child's homework was graded. Score: ${score}/20.`, 'parent');
  };

  const addHomework = (hw: Omit<Homework, 'id' | 'schoolId'>) => {
    const newHw: Homework = {
      ...hw,
      id: `hw-${Date.now()}`,
      schoolId: currentUser.schoolId === 'all' ? activeSchool.id : currentUser.schoolId,
      status: 'pending'
    };
    setHomeworks(prev => [newHw, ...prev]);
    addNotification('New Homework Assigned', `${hw.assignedBy} assigned homework: "${hw.title}" due on ${hw.dueDate}.`, 'student');
  };

  const addQuizResult = (res: Omit<QuizResult, 'id'>) => {
    const newRes: QuizResult = {
      ...res,
      id: `qres-${Date.now()}`
    };
    setQuizResults(prev => [newRes, ...prev]);
    // Increment points & learning streak for student on perfect / high score
    if (res.score >= 4) {
      setCurrentUser(prev => ({
        ...prev,
        points: (prev.points || 0) + 50,
        streak: (prev.streak || 0) + 1
      }));
    } else {
      setCurrentUser(prev => ({
        ...prev,
        points: (prev.points || 0) + 10
      }));
    }
  };

  const addContent = (content: Omit<CBSEContent, 'id'>) => {
    const newContent: CBSEContent = {
      ...content,
      id: `cbse-${Date.now()}`
    };
    setContentList(prev => [...prev, newContent]);
  };

  const addSchool = (school: Omit<School, 'id'>) => {
    const newId = `school-${Date.now()}`;
    const newSchool: School = {
      ...school,
      id: newId
    };
    setSchools(prev => [...prev, newSchool]);
    
    // Auto generate an admin for this school
    const newAdmin: UserProfile = {
      id: `user-admin-${newId}`,
      name: `Principal of ${school.name}`,
      email: `admin@${school.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
      role: 'school_admin',
      schoolId: newId,
      avatar: '👩‍💼'
    };
    setAllUsers(prev => [...prev, newAdmin]);
  };

  const deleteSchool = (schoolId: string) => {
    setSchools(prev => prev.filter(s => s.id !== schoolId));
    setAllUsers(prev => prev.filter(u => u.schoolId !== schoolId));
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const addUser = (user: Omit<UserProfile, 'id'>) => {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const newU: UserProfile = {
      ...user,
      id: `user-${Date.now()}-${randomSuffix}`
    };
    setAllUsers(prev => [...prev, newU]);
  };

  const updateUser = (userId: string, user: Partial<UserProfile>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...user } as any : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...user } as any));
    }
  };

  const addObservation = (obs: Omit<Observation, 'id'>) => {
    const newObs: Observation = {
      ...obs,
      id: `obs-${Date.now()}`
    };
    setObservations(prev => [newObs, ...prev]);
  };

  const deleteObservation = (id: string) => {
    setObservations(prev => prev.filter(o => o.id !== id));
  };

  const updateSubscription = (schoolId: string, planId: 'trial' | 'basic' | 'premium') => {
    let paymentAmount = 0;
    if (planId === 'basic') {
      paymentAmount = 125000;
    } else if (planId === 'premium') {
      paymentAmount = 350000;
    }

    if (paymentAmount > 0) {
      setPremiumBalancePool(prev => prev + paymentAmount);
    }

    setSchools(prev => prev.map(s => {
      if (s.id === schoolId) {
        return {
          ...s,
          subscriptionPlan: planId,
          subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      }
      return s;
    }));
  };

  const addNotification = (title: string, message: string, role: UserRole | 'all') => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      role,
      schoolId: currentUser.schoolId === 'all' ? activeSchool.id : currentUser.schoolId,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const awardPoints = (amount: number, reason: string) => {
    setCurrentUser(prev => {
      const updatedPoints = (prev.points || 0) + amount;
      return {
        ...prev,
        points: updatedPoints
      };
    });
    addNotification('Points Earned! ⚡', `You received +${amount} Mind Points for: "${reason}".`, 'student');
  };

  const awardBadge = (badgeName: string) => {
    setCurrentUser(prev => {
      const currentBadges = prev.badges || [];
      if (currentBadges.includes(badgeName)) return prev;
      const updatedBadges = [...currentBadges, badgeName];
      addNotification('New Badge Unlocked! 🏆', `Congratulations! You unlocked the "${badgeName}" badge!`, 'student');
      return {
        ...prev,
        badges: updatedBadges
      };
    });
  };

  const updatePremiumSubsidyConfig = (pool: number, min: number, max: number) => {
    setPremiumBalancePool(pool);
    setPoorStudentMinDiscount(min);
    setPoorStudentMaxDiscount(max);
  };

  const awardScholarship = (schoolId: string, beneficiaryName: string, role: 'student' | 'teacher', discountPercent: number, description: string) => {
    const schoolObj = schools.find(s => s.id === schoolId);
    const schoolName = schoolObj ? schoolObj.name : 'Affiliated School';
    const baselineCost = 35000;
    const fundDisbursed = Math.round((baselineCost * discountPercent) / 100);

    const newSch = {
      id: `schol-${Date.now()}`,
      schoolId,
      schoolName,
      beneficiaryName,
      role,
      discountPercent,
      fundDisbursed,
      date: new Date().toISOString().split('T')[0],
      description
    };

    setScholarships(prev => [newSch, ...prev]);
    setPremiumBalancePool(prev => Math.max(0, prev - fundDisbursed));

    addNotification(
      'Scholarship Granted! 🎓',
      `International AI Equity fund approved a ${discountPercent}% premium subsidy for ${beneficiaryName} at ${schoolName}.`,
      'all'
    );
  };

  const deleteScholarship = (id: string) => {
    const item = scholarships.find(s => s.id === id);
    if (item) {
      setPremiumBalancePool(prev => prev + item.fundDisbursed);
    }
    setScholarships(prev => prev.filter(s => s.id !== id));
  };

  return (
    <SaaSContext.Provider
      value={{
        schools,
        activeSchool,
        currentUser,
        allUsers,
        homeworks,
        quizResults,
        contentList,
        notifications,
        observations,
        language,
        isDbConnected: isFirebaseConnected,
        switchRole,
        switchSchool,
        switchLanguage,
        submitHomework,
        gradeHomework,
        addHomework,
        addQuizResult,
        addContent,
        addSchool,
        deleteSchool,
        deleteUser,
        addUser,
        updateUser,
        addObservation,
        deleteObservation,
        updateSubscription,
        addNotification,
        awardPoints,
        awardBadge,
        isSuperAdminAuthenticated,
        setSuperAdminAuthenticated,
        isImpersonating,
        stopImpersonating,
        startImpersonating,
        premiumBalancePool,
        poorStudentMinDiscount,
        poorStudentMaxDiscount,
        scholarships,
        updatePremiumSubsidyConfig,
        awardScholarship,
        deleteScholarship
      }}
    >
      {children}
    </SaaSContext.Provider>
  );
}

export function useSaaSState() {
  const context = useContext(SaaSContext);
  if (!context) {
    throw new Error('useSaaSState must be used within a SaaSProvider');
  }
  return context;
}
