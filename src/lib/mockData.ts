/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { School, UserProfile, CBSEContent, Homework, QuizResult, SubscriptionPlan } from "../types";

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: 'Free Trial Plan',
    priceINR: 0,
    billingPeriod: '1 Month',
    features: [
      'Up to 50 Students',
      'Basic AI Lesson Explainer',
      'Limited AI Quizzes (5/day)',
      'Basic Performance Analytics',
      'Parent Dashboard Access'
    ],
    maxStudents: 50
  },
  {
    id: 'basic',
    name: 'NEP Essential School',
    priceINR: 15000,
    billingPeriod: 'Yearly',
    features: [
      'Up to 500 Students',
      'Unlimited School-wide Teachers & Parents',
      'Full AI Tutor & Homework Helper',
      'AI Worksheet & Question Paper Generator',
      'Complete Performance & Weak-Topic Analytics',
      'GST-ready Standard Invoices',
      'Basic Email Support'
    ],
    maxStudents: 500
  },
  {
    id: 'premium',
    name: 'AI Smart School SaaS',
    priceINR: 35000,
    billingPeriod: 'Yearly',
    features: [
      'Unlimited Students & Users',
      'Custom Branding & Theme Customizer',
      'Premium AI Mind Maps & Flashcards',
      'Voice-enabled Explanations (TTS/STT)',
      'FCM Push Notification Integration',
      'Multi-Language Curriculum Support',
      'Personalized Learning Paths',
      '24/7 Dedicated Support & Training'
    ],
    maxStudents: 99999
  }
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'NEP Future Academy, New Delhi',
    logo: '🎓',
    themeColor: 'indigo',
    tagline: 'Fostering 21st Century Innovators',
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2027-04-15',
    address: 'Sector 12, Dwarka, New Delhi - 110075',
    studentCount: 342,
    teacherCount: 18
  },
  {
    id: 'school-2',
    name: 'CBSE Smart Tech School, Bengaluru',
    logo: '💻',
    themeColor: 'emerald',
    tagline: 'Coding, Creating, Collaborating',
    subscriptionPlan: 'basic',
    subscriptionExpiry: '2027-01-30',
    address: 'Whitefield Main Road, Bengaluru, Karnataka - 560066',
    studentCount: 180,
    teacherCount: 9
  },
  {
    id: 'school-3',
    name: 'Veda AI Gurukul, Hyderabad',
    logo: '🌟',
    themeColor: 'amber',
    tagline: 'Ancient Values, Future Skills',
    subscriptionPlan: 'trial',
    subscriptionExpiry: '2026-08-01',
    address: 'Gachibowli, Hyderabad, Telangana - 500032',
    studentCount: 45,
    teacherCount: 3
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-super',
    name: 'Dr. Ramesh Kumar',
    email: 'superadmin@edumind.ai',
    role: 'super_admin',
    schoolId: 'all',
    avatar: '👨‍💼',
    points: 1500
  },
  // School 1 Users
  {
    id: 'user-admin-1',
    name: 'Mrs. Suman Sharma',
    email: 'principal@nepfuture.edu',
    role: 'school_admin',
    schoolId: 'school-1',
    avatar: '👩‍🏫'
  },
  {
    id: 'user-teacher-1',
    name: 'Mr. Alok Banerjee',
    email: 'alok.ai@nepfuture.edu',
    role: 'teacher',
    schoolId: 'school-1',
    avatar: '👨‍💻',
    subjects: ['Artificial Intelligence', 'Python & Coding', 'Digital Literacy']
  },
  {
    id: 'user-student-1',
    name: 'Aarav Patel',
    email: 'aarav@nepfuture.edu',
    role: 'student',
    schoolId: 'school-1',
    avatar: '👦',
    grade: 'Class 9',
    section: 'Section A',
    streak: 8,
    badges: ['Daily Explorer', 'AI Wizard', 'Coding Champ'],
    points: 420
  },
  {
    id: 'user-student-1b',
    name: 'Rohan Gupta',
    email: 'rohan@nepfuture.edu',
    role: 'student',
    schoolId: 'school-1',
    avatar: '🧑‍🎓',
    grade: 'Class 9',
    section: 'Section A',
    streak: 5,
    badges: ['Fast Learner', 'Quiz Master'],
    points: 390
  },
  {
    id: 'user-student-1c',
    name: 'Sneha Sharma',
    email: 'sneha@nepfuture.edu',
    role: 'student',
    schoolId: 'school-1',
    avatar: '👧',
    grade: 'Class 9',
    section: 'Section A',
    streak: 15,
    badges: ['Daily Explorer', 'Consistent Learner', 'Top Thinker', 'Super Star'],
    points: 580
  },
  {
    id: 'user-student-1d',
    name: 'Kabir Malhotra',
    email: 'kabir@nepfuture.edu',
    role: 'student',
    schoolId: 'school-1',
    avatar: '👦',
    grade: 'Class 9',
    section: 'Section A',
    streak: 3,
    badges: ['AI Novice'],
    points: 310
  },
  {
    id: 'user-student-1e',
    name: 'Meera Sen',
    email: 'meera@nepfuture.edu',
    role: 'student',
    schoolId: 'school-1',
    avatar: '👩‍🎓',
    grade: 'Class 9',
    section: 'Section A',
    streak: 4,
    badges: ['Creative Mind', 'NEP Pioneer'],
    points: 250
  },
  {
    id: 'user-parent-1',
    name: 'Mr. Rajesh Patel',
    email: 'rajesh.patel@gmail.com',
    role: 'parent',
    schoolId: 'school-1',
    avatar: '👨',
    childId: 'user-student-1'
  },
  // School 2 Users
  {
    id: 'user-admin-2',
    name: 'Dr. Subramanian K.',
    email: 'admin@smarttechcbse.edu',
    role: 'school_admin',
    schoolId: 'school-2',
    avatar: '👨‍🎓'
  },
  {
    id: 'user-teacher-2',
    name: 'Ms. Priya Pillai',
    email: 'priya@smarttechcbse.edu',
    role: 'teacher',
    schoolId: 'school-2',
    avatar: '👩‍💻',
    subjects: ['21st Century Skills', 'Future Tech Skills']
  },
  {
    id: 'user-student-2',
    name: 'Aditi Rao',
    email: 'aditi@smarttechcbse.edu',
    role: 'student',
    schoolId: 'school-2',
    avatar: '👧',
    grade: 'Class 10',
    section: 'Section B',
    streak: 12,
    badges: ['Top Thinker', 'Consistent Learner'],
    points: 610
  },
  {
    id: 'user-parent-2',
    name: 'Mrs. Hema Rao',
    email: 'hema.rao@gmail.com',
    role: 'parent',
    schoolId: 'school-2',
    avatar: '👩',
    childId: 'user-student-2'
  }
];

export const CBSE_AI_CURRICULUM: CBSEContent[] = [
  {
    id: 'cbse-ai-9-ch1',
    subject: 'Artificial Intelligence',
    grade: 'Class 9',
    chapter: 'Chapter 1: Introduction to AI',
    title: 'Excite, Relate and Purpose of AI',
    type: 'concept',
    summary: 'Understanding the basic domains of AI (Data, Computer Vision, NLP) and 21st century ethics.',
    contentMarkdown: `### 🎓 CBSE Class 9: Introduction to AI

Welcome to Chapter 1 of the CBSE Artificial Intelligence Curriculum (Subject Code 417). This unit excites you about the world of technology, relates it to everyday life, and identifies its purpose for sustainable development.

#### 🌟 1. Three Major Domains of AI
Artificial Intelligence applications are broadly divided into three core domains:

1. **Data Sciences**: Deals with structured or numerical data. AI models analyze database patterns to predict outcomes.
   * *Example*: Predicting tomorrow's weather based on historical atmospheric data.
2. **Computer Vision (CV)**: Enables machines to interpret, process, and understand visual data (images and videos).
   * *Example*: Facial recognition locks, self-driving cars scanning road signs.
3. **Natural Language Processing (NLP)**: Helps machines understand, read, and decipher human languages.
   * *Example*: Google Assistant, automated translation, spellcheck engines.

---

#### ⚖️ 2. The AI Project Cycle
To build an AI system, developers follow a 5-step engineering cycle:
1. **Problem Scoping**: Defining what issue we want to solve using AI.
2. **Data Acquisition**: Collecting high-quality information to feed the model.
3. **Data Exploration**: Organizing and visually analyzing the dataset.
4. **Modelling**: Choosing and training the algorithmic neural network.
5. **Evaluation**: Testing the model's accuracy on unseen real-world data.

---

#### 💡 NEP 2020 Activity: SDG Alignment
Every AI project should have a **social impact**. Align your ideas with the United Nations Sustainable Development Goals (SDGs), such as *Climate Action (SDG 13)* or *Quality Education (SDG 4)*.`
  },
  {
    id: 'cbse-ai-10-ch2',
    subject: 'Artificial Intelligence',
    grade: 'Class 10',
    chapter: 'Chapter 2: AI Project Cycle',
    title: 'Problem Scoping & 4Ws Canvas',
    type: 'concept',
    summary: 'The structured way of defining problems using Who, What, Where, and Why frameworks.',
    contentMarkdown: `### 🚀 CBSE Class 10: AI Project Cycle

The first step of building any AI model is **Problem Scoping**. Without scoping the boundaries of the problem correctly, we might end up building a highly complex solution for the wrong issue!

#### 📝 The 4Ws Problem Canvas
CBSE defines the 4Ws canvas as a foundational framework for modern engineering:

1. **Who?**
   * *Who is the stakeholder experiencing this problem?* Are they students, farmers, or municipal workers?
   * *Example*: Local organic crop farmers.

2. **What?**
   * *What is the exact nature of the problem?* What blocks their progress? What evidence do we have?
   * *Example*: Invasive insect pests destroying organic tomatoes overnight without warning.

3. **Where?**
   * *Where is this problem occurring?* What is the physical context, ecosystem, or location?
   * *Example*: Indoor hydroponic farms and open-sky fields in rural Karnataka.

4. **Why?**
   * *Why is solving this problem valuable?* What is the positive outcome, social impact, or financial benefit?
   * *Example*: Prevent crop failure, reduce the use of chemicals, and increase farmer income by 35%.`
  },
  {
    id: 'cbse-ai-9-ch4',
    subject: 'Python & Coding',
    grade: 'Class 9',
    chapter: 'Chapter 4: Basics of Python',
    title: 'Variables, Lists, and Loops',
    type: 'concept',
    summary: 'Get started with writing clean, structured Python code for basic automation and AI logic.',
    contentMarkdown: `### 🐍 Introduction to Python Programming

Python is the absolute language of choice for Artificial Intelligence due to its simplicity and powerful libraries like **TensorFlow**, **PyTorch**, and **NumPy**.

#### 🔑 1. Variables & Data Types
Variables are memory containers that hold information:
\`\`\`python
# Declaring variable values
student_name = "Aarav"  # String (text)
ai_score = 92           # Integer (number)
has_completed = True    # Boolean (True/False)
\`\`\`

#### 📋 2. Python Lists
Lists are container collections that let you store multiple items in order:
\`\`\`python
# Storing future skills to master
skills = ["Critical Thinking", "Machine Learning", "Python Coding"]
print(skills[0]) # Output: Critical Thinking

# Appending a new skill
skills.append("AI Ethics")
print(len(skills)) # Output: 4
\`\`\`

#### 🔄 3. For Loops
Loops allow repeating code blocks for a specified number of times:
\`\`\`python
for skill in skills:
    print("I will practice: " + skill)
\`\`\``
  }
];

export const INITIAL_HOMEWORKS: Homework[] = [
  {
    id: 'hw-1',
    schoolId: 'school-1',
    title: 'Create an SDG-aligned AI Problem Canvas',
    description: 'Pick an SDG goal (e.g., Clean Water, Good Health) and write down the 4Ws problem canvas. Submit your work in paragraphs.',
    subject: 'Artificial Intelligence',
    grade: 'Class 9',
    assignedBy: 'Mr. Alok Banerjee',
    assignedDate: '2026-07-04',
    dueDate: '2026-07-10',
    points: 20,
    status: 'pending'
  },
  {
    id: 'hw-2',
    schoolId: 'school-1',
    title: 'Python List Manipulation Practice',
    description: 'Create a Python list with 5 CBSE subjects. Write a program to append "Artificial Intelligence" to it and print the third element.',
    subject: 'Python & Coding',
    grade: 'Class 9',
    assignedBy: 'Mr. Alok Banerjee',
    assignedDate: '2026-07-01',
    dueDate: '2026-07-05',
    points: 10,
    status: 'submitted',
    submissionText: 'subjects = ["Math", "Science", "English", "SST", "Hindi"]\nsubjects.append("Artificial Intelligence")\nprint(subjects[2])\n# Third element (index 2) is "English" because indexes start at 0.'
  },
  {
    id: 'hw-3',
    schoolId: 'school-2',
    title: 'Write an Essay on AI Ethics & Privacy',
    description: 'Summarize the potential risks of Deepfakes and algorithmic bias in social media platforms.',
    subject: '21st Century Skills',
    grade: 'Class 10',
    assignedBy: 'Ms. Priya Pillai',
    assignedDate: '2026-07-05',
    dueDate: '2026-07-12',
    points: 30,
    status: 'pending'
  }
];

export const INITIAL_QUIZ_RESULTS: QuizResult[] = [
  {
    id: 'qres-1',
    studentId: 'user-student-1',
    topic: 'Introduction to AI Domains',
    subject: 'Artificial Intelligence',
    score: 4,
    totalQuestions: 5,
    date: '2026-07-05T14:30:00Z',
    feedback: 'Fantastic understanding of AI domains! You scored 80%. Let\'s strengthen NLP concepts.',
    weakTopics: ['Natural Language Processing'],
  },
  {
    id: 'qres-2',
    studentId: 'user-student-1',
    topic: 'Python Basics & Loops',
    subject: 'Python & Coding',
    score: 5,
    totalQuestions: 5,
    date: '2026-07-02T11:15:00Z',
    feedback: 'Perfect score! 100%! You have excellent foundational coding capabilities.',
    weakTopics: []
  }
];

export const SYSTEM_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Homework Assigned',
    message: 'Mr. Alok Banerjee has assigned "Create an SDG-aligned AI Problem Canvas" due on July 10.',
    role: 'student',
    schoolId: 'school-1',
    date: '2026-07-04',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Academic Progress Alert',
    message: 'Aarav has scored 100% on the Python Basics & Loops timed quiz! Click to review details.',
    role: 'parent',
    schoolId: 'school-1',
    date: '2026-07-02',
    read: false
  },
  {
    id: 'notif-3',
    title: 'SaaS Renewal Reminders',
    message: 'Your school trial subscription is expiring in 25 days. Please configure school billing.',
    role: 'school_admin',
    schoolId: 'school-3',
    date: '2026-07-06',
    read: false
  }
];
