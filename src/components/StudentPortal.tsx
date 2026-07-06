/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSaaSState } from '../lib/stateStore';
import { TRANSLATIONS } from '../lib/translations';
import { 
  BookOpen, Brain, Sparkles, HelpCircle, FileText, Zap, Award, 
  Clock, Play, Volume2, Mic, CheckCircle, XCircle, Send, ArrowRight
} from 'lucide-react';
import ClassLeaderboard from './ClassLeaderboard';
import ShivChatOverlay from './ShivChatOverlay';

export default function StudentPortal() {
  const { 
    currentUser, 
    language, 
    contentList, 
    homeworks, 
    quizResults, 
    addQuizResult, 
    submitHomework,
    allUsers,
    awardPoints,
    awardBadge
  } = useSaaSState();

  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  // Student Sub-tabs
  const [activeTab, setActiveTab] = useState<'today' | 'tutor' | 'quizzes' | 'flashcards' | 'mindmaps' | 'homework' | 'career' | 'gamification'>('today');

  // Today's Learning State
  const [selectedTopic, setSelectedTopic] = useState(contentList[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // AI Tutor / Doubt Solver State
  const [doubtText, setDoubtText] = useState('');
  const [tutorMessages, setTutorMessages] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
    { sender: 'ai', text: `Hello ${currentUser.name}! I am Shiv, your CBSE NEP 2020 AI Agent. Ask me any doubt about AI, Coding, or 21st-century future skills. I will guide you clearly on every topic and help build your logical and coding skills!` }
  ]);
  const [isLoadingTutor, setIsLoadingTutor] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Quiz State
  const [quizTopic, setQuizTopic] = useState('Artificial Intelligence Basics');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [userQuizFeedback, setUserQuizFeedback] = useState('');

  // Flashcard State
  const [flashcardTopic, setFlashcardTopic] = useState('Machine Learning');
  const [flashcards, setFlashcards] = useState<any[]>([
    { front: "What is Machine Learning?", back: "A subset of AI where computers learn from data without being explicitly programmed." },
    { front: "Name the 4 Cs of 21st Century Skills defined by NEP 2020", back: "Critical Thinking, Creativity, Collaboration, and Communication." },
    { front: "What is Computer Vision?", back: "An AI field that enables computers to interpret and understand digital images and videos." },
    { front: "What is NLP?", back: "Natural Language Processing - the ability of a computer to understand human language." }
  ]);
  const [flashcardLoading, setFlashcardLoading] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // Mindmap State
  const [mindmapTopic, setMindmapTopic] = useState('The AI Project Cycle');
  const [mindmapData, setMindmapData] = useState<any>({
    topic: "The AI Project Cycle",
    description: "Visual representation of AI systems development following CBSE NEP 2020 guidelines.",
    nodes: [
      { title: "Problem Scoping", details: "Defining what issue we want to solve using AI and setting milestones.", connections: ["Who, What, Where, Why framework"] },
      { title: "Data Acquisition", details: "Collecting structured or unstructured info/data from cameras, sensors, or databases.", connections: ["Surveys", "Sensors", "Web scraping"] },
      { title: "Data Exploration", details: "Organizing and visually plotting datasets to understand patterns.", connections: ["Histograms", "Scatters", "Bar charts"] },
      { title: "Modelling", details: "Choosing algorithms and constructing neural pathways.", connections: ["Supervised vs Unsupervised learning"] },
      { title: "Evaluation", details: "Testing performance and accuracy on brand-new validation metrics.", connections: ["Accuracy score", "Precision and recall"] }
    ]
  });
  const [mindmapLoading, setMindmapLoading] = useState(false);

  // Homework submission state
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [hwSubmissionText, setHwSubmissionText] = useState('');

  // Career Guidance State
  const [careerInterests, setCareerInterests] = useState('Coding and Game Design');
  const [careerGuidanceText, setCareerGuidanceText] = useState('');
  const [careerLoading, setCareerLoading] = useState(false);

  // Gamification Local State
  const [leaderboardTab, setLeaderboardTab] = useState<'school' | 'class'>('school');
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [challengeOption, setChallengeOption] = useState<number | null>(null);
  const [challengeResult, setChallengeResult] = useState<{ success?: boolean; msg?: string } | null>(null);
  const [badgeUnlockCelebration, setBadgeUnlockCelebration] = useState<string | null>(null);

  // Helper to determine levels dynamically
  const getLevelInfo = (pts: number = 0) => {
    if (pts <= 200) {
      const progress = (pts / 200) * 100;
      return { level: 1, name: "AI Explorer", nextThreshold: 200, prevThreshold: 0, icon: "🧭", progress, ptsNeeded: 200 - pts };
    } else if (pts <= 500) {
      const range = 500 - 200;
      const progress = ((pts - 200) / range) * 100;
      return { level: 2, name: "Byte Builder", nextThreshold: 500, prevThreshold: 200, icon: "🛠️", progress, ptsNeeded: 500 - pts };
    } else if (pts <= 900) {
      const range = 900 - 500;
      const progress = ((pts - 500) / range) * 100;
      return { level: 3, name: "Neural Navigator", nextThreshold: 900, prevThreshold: 500, icon: "🧠", progress, ptsNeeded: 900 - pts };
    } else if (pts <= 1400) {
      const range = 1400 - 900;
      const progress = ((pts - 900) / range) * 100;
      return { level: 4, name: "Quantum Innovator", nextThreshold: 1400, prevThreshold: 900, icon: "⚡", progress, ptsNeeded: 1400 - pts };
    } else {
      return { level: 5, name: "CBSE Futurist", nextThreshold: 5000, prevThreshold: 1400, icon: "🌌", progress: 100, ptsNeeded: 0 };
    }
  };

  // Automated achievement check and badge unlocking
  const checkAndUnlockBadges = () => {
    let unlockedAny = false;
    const currentStreak = currentUser.streak || 0;
    const currentPoints = currentUser.points || 0;
    const userBadges = currentUser.badges || [];

    // 1. Daily Explorer (streak >= 5)
    if (currentStreak >= 5 && !userBadges.includes('Daily Explorer')) {
      awardBadge('Daily Explorer');
      unlockedAny = true;
    }
    // 2. Consistent Learner (streak >= 10)
    if (currentStreak >= 10 && !userBadges.includes('Consistent Learner')) {
      awardBadge('Consistent Learner');
      unlockedAny = true;
    }
    // 3. Curriculum Scholar (points >= 500)
    if (currentPoints >= 500 && !userBadges.includes('Curriculum Scholar')) {
      awardBadge('Curriculum Scholar');
      unlockedAny = true;
    }
    // 4. Homework Hero
    const completedHws = homeworks.filter(hw => hw.status === 'submitted' || hw.status === 'graded').length;
    if (completedHws >= 1 && !userBadges.includes('Homework Hero')) {
      awardBadge('Homework Hero');
      unlockedAny = true;
    }
    // 5. Quiz Master
    if (quizResults.length >= 1 && !userBadges.includes('Quiz Master')) {
      awardBadge('Quiz Master');
      unlockedAny = true;
    }

    if (!unlockedAny) {
      alert("We scanned your achievements! No new badges unlocked yet. Keep completing quizzes, homeworks and lessons to unlock more!");
    } else {
      alert("Scan complete! New badges have been unlocked. Check your achievements!");
    }
  };

  // Speak Text using HTML5 Web Speech Synthesis
  const handleSpeak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const cleanText = textToSpeak.replace(/[#*`_]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN';
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  // Listen Speech using HTML5 Speech Recognition
  const handleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setDoubtText(speechToText);
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Graceful fallback
      setIsListening(true);
      setTimeout(() => {
        setDoubtText("What is supervised machine learning?");
        setIsListening(false);
      }, 1500);
    }
  };

  // Call backend AI API
  const askTutor = async () => {
    if (!doubtText.trim()) return;
    const userMsg = doubtText;
    setTutorMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setDoubtText('');
    setIsLoadingTutor(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tutor_doubt',
          language,
          payload: {
            doubt: userMsg,
            grade: currentUser.grade,
            subject: 'Artificial Intelligence & Future Skills'
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setTutorMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setTutorMessages(prev => [...prev, { sender: 'ai', text: `Error: ${err.message || "Failed to contact AI mentor. Please try again later."}` }]);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  // Start Dynamic Timed Quiz
  const startQuiz = async (topic: string) => {
    setQuizLoading(true);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsQuizSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizEnded(false);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_quiz',
          language,
          payload: { topic, grade: currentUser.grade }
        })
      });
      const resData = await response.json();
      if (resData.success && Array.isArray(resData.data)) {
        setQuizQuestions(resData.data);
      } else {
        throw new Error("Could not parse quiz questions");
      }
    } catch (err) {
      // fallback
      setQuizQuestions([
        {
          question: "What does NLP stand for in Artificial Intelligence?",
          options: ["Natural Language Processing", "Normal Logic Program", "Network Link Protocol", "Neural Leaf Pattern"],
          correctAnswerIndex: 0,
          explanation: "NLP enables computers to understand and translate human language.",
          example: "Siri or Google Assistant interpreting your spoken voice.",
          similarQuestion: "Give one real-world application of NLP."
        }
      ]);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (isQuizSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const submitAnswer = () => {
    if (selectedOptionIndex === null || isQuizSubmitted) return;
    setIsQuizSubmitted(true);

    const currentQ = quizQuestions[currentQuestionIndex];
    if (selectedOptionIndex === currentQ.correctAnswerIndex) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsQuizSubmitted(false);
    } else {
      // Quiz complete
      setQuizEnded(true);
      const score = correctAnswersCount;
      const total = quizQuestions.length;
      const feedback = score === total ? "Excellent work! Perfect score!" : `Good attempt. You scored ${score}/${total}. Keep learning!`;
      
      addQuizResult({
        studentId: currentUser.id,
        topic: quizTopic,
        subject: 'Artificial Intelligence',
        score,
        totalQuestions: total,
        date: new Date().toISOString(),
        feedback,
        weakTopics: score < total ? ['Advanced concepts of ' + quizTopic] : []
      });

      // Award badges and points
      if (score >= 4) {
        awardBadge('AI Wizard');
      }
      awardBadge('Quiz Master');
    }
  };

  // Generate Flashcards Dynamically
  const generateFlashcards = async (topic: string) => {
    setFlashcardLoading(true);
    setFlippedIndex(null);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_flashcards',
          language,
          payload: { topic }
        })
      });
      const resData = await response.json();
      if (resData.success && Array.isArray(resData.data)) {
        setFlashcards(resData.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      setFlashcards([
        { front: "Algorithm", back: "A step-by-step procedure or set of rules to be followed in calculations or problem-solving." },
        { front: "Big Data", back: "Extremely large data sets that may be analysed computationally to reveal patterns, trends, and associations." }
      ]);
    } finally {
      setFlashcardLoading(false);
    }
  };

  // Generate Mindmaps Dynamically
  const generateMindMap = async (topic: string) => {
    setMindmapLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_mindmap',
          language,
          payload: { topic }
        })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setMindmapData(resData.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Keep static mindmap
    } finally {
      setMindmapLoading(false);
    }
  };

  // Generate Career Guidance
  const getCareerGuidance = async () => {
    setCareerLoading(true);
    setCareerGuidanceText('');
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'career_guidance',
          language,
          payload: { interests: careerInterests, grade: currentUser.grade }
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setCareerGuidanceText(resData.text);
      } else {
        throw new Error();
      }
    } catch (err) {
      setCareerGuidanceText(`### Simulated Future Career Pathway
- **AI Game Developer**: Build neural network enemies that learn your strategies.
- **Recommended skills**: Learn Python list structures, functions, and elementary Pygame vectors.`);
    } finally {
      setCareerLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Student Nav Sidebar */}
      <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
          <div className="text-3xl">{currentUser.avatar}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
            <p className="text-xs text-gray-500">{currentUser.grade} • {currentUser.section}</p>
          </div>
        </div>

        {/* Streaks & XP Panel */}
        <div className="bg-slate-50 rounded-xl p-4 flex justify-around items-center text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-orange-500 font-bold text-lg">
              <Zap className="w-5 h-5 fill-current" />
              <span>{currentUser.streak || 0}</span>
            </div>
            <p className="text-[10px] uppercase text-gray-400 font-medium">Streak Days</p>
          </div>
          <div className="w-[1px] h-8 bg-gray-200" />
          <div>
            <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold text-lg">
              <Award className="w-5 h-5" />
              <span>{currentUser.points || 0}</span>
            </div>
            <p className="text-[10px] uppercase text-gray-400 font-medium">Mind Points</p>
          </div>
        </div>

        {/* Menu Tabs */}
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('today')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'today' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span>{t.todayLearning}</span>
          </button>
          <button
            onClick={() => setActiveTab('tutor')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tutor' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Brain className="w-4.5 h-4.5" />
            <span>{t.aiTutor}</span>
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'quizzes' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Clock className="w-4.5 h-4.5" />
            <span>{t.practiceQuizzes}</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'flashcards' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>{t.flashcards}</span>
          </button>
          <button
            onClick={() => setActiveTab('mindmaps')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mindmaps' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <HelpCircle className="w-4.5 h-4.5" />
            <span>{t.mindMaps}</span>
          </button>
          <button
            onClick={() => setActiveTab('homework')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'homework' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="w-4.5 h-4.5" />
            <span>{t.homeworkHelper}</span>
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'career' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Zap className="w-4.5 h-4.5" />
            <span>{t.careerGuidance}</span>
          </button>
          <button
            onClick={() => setActiveTab('gamification')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gamification' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Award className="w-4.5 h-4.5 text-amber-500" />
            <span className="font-semibold text-indigo-900 flex items-center gap-1.5">
              Leaderboard & Badges
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </span>
          </button>
        </nav>

        {/* Badges Panel */}
        <div className="pt-4 border-t border-gray-50">
          <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">My Badges</h4>
          <div className="flex flex-wrap gap-2">
            {(currentUser.badges || []).map((badge, idx) => (
              <span key={idx} className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                🏆 {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feature Content Area */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[500px]">
        
        {/* TAB 1: TODAY'S LEARNING */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full uppercase">CBSE NEP Curriculum</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">Classroom Chapter Lessons</h2>
              </div>
              <button
                onClick={() => handleSpeak(selectedTopic.contentMarkdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isSpeaking ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Stop Voice' : 'Voice Explainer (TTS)'}</span>
              </button>
            </div>

            {/* List of Syllabus Chapters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contentList.map((content) => (
                <button
                  key={content.id}
                  onClick={() => setSelectedTopic(content)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${selectedTopic.id === content.id ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide">{content.chapter}</p>
                  <h4 className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">{content.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2">{content.summary}</p>
                </button>
              ))}
            </div>

            {/* Selected Material Viewer */}
            <div className="border border-gray-100 rounded-xl p-5 bg-slate-50/50">
              <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                {selectedTopic.contentMarkdown.split('\n').map((line, idx) => {
                  if (line.startsWith('###')) {
                    return <h3 key={idx} className="text-lg font-bold text-gray-900 pt-3">{line.replace('###', '')}</h3>;
                  } else if (line.startsWith('####')) {
                    return <h4 key={idx} className="text-md font-bold text-gray-800 pt-2">{line.replace('####', '')}</h4>;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={idx} className="font-semibold text-gray-900">{line}</p>;
                  } else if (line.startsWith('-')) {
                    return <li key={idx} className="ml-4 list-disc text-xs">{line.substring(1).trim()}</li>;
                  } else if (line.trim() === '---') {
                    return <hr key={idx} className="my-4 border-gray-200" />;
                  } else if (line.trim().length > 0) {
                    return <p key={idx} className="text-xs leading-relaxed">{line}</p>;
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Complete Lesson gamified interaction */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  awardPoints(20, `Completed CBSE Lesson: ${selectedTopic.title}`);
                  awardBadge('Daily Explorer');
                }}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Lesson as Completed (+20 Mind Points)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AI TUTOR */}
        {activeTab === 'tutor' && (
          <div className="flex flex-col h-[520px]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <span>EduMind Personalized AI Tutor</span>
                </h2>
                <p className="text-xs text-gray-500">{t.cbseNepGoal}</p>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              {tutorMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-gray-800 border border-gray-100'}`}>
                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="mt-2 text-[10px] font-medium text-indigo-600 flex items-center gap-1 hover:underline"
                      >
                        <Volume2 className="w-3 h-3" /> Speak out loud
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoadingTutor && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs text-gray-500">
                    <span className="animate-pulse">Shiv is thinking... Generating step-by-step logical answer...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-100 pt-3 flex gap-2">
              <button
                onClick={handleListen}
                className={`p-3 rounded-xl border transition-all ${isListening ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                title="Speak your doubt"
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askTutor()}
                placeholder="Ask your query (e.g., 'What is natural language processing?' or submit a wrong quiz response for explanations)"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={askTutor}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZZES */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Interactive CBSE NEP Practice Quizzes</h2>
                <p className="text-xs text-gray-500">Timed assessments that award Mind Points and teach core concepts.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="Topic (e.g., AI Domains)"
                  className="border border-gray-200 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => startQuiz(quizTopic)}
                  disabled={quizLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  {quizLoading ? 'Generating...' : 'Start New AI Quiz'}
                </button>
              </div>
            </div>

            {quizQuestions.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-500">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700">Ready to take a challenge?</h3>
                <p className="text-xs text-gray-400 mt-1">Enter a CBSE AI topic or future skills keyword above and click Start New AI Quiz.</p>
              </div>
            ) : quizEnded ? (
              <div className="border border-gray-100 rounded-2xl p-8 text-center bg-indigo-50/30 space-y-4">
                <div className="text-5xl">🎉</div>
                <h3 className="text-xl font-bold text-gray-900">Quiz Completed!</h3>
                <p className="text-xs text-gray-600">You scored <span className="text-indigo-600 font-bold text-base">{correctAnswersCount}</span> out of {quizQuestions.length} correct.</p>
                <div className="bg-white rounded-xl p-4 border border-indigo-100 max-w-md mx-auto text-xs text-gray-600 italic">
                  "{userQuizFeedback || 'Excellent progress toward mastering 21st-century CBSE capabilities!'}"
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <button
                    onClick={() => startQuiz(quizTopic)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setQuizQuestions([])}
                    className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50"
                  >
                    Exit Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-100 rounded-xl p-6 bg-white space-y-6">
                {/* Progress Indicators */}
                <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                  <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px]">HOTS / Competency Level</span>
                </div>

                {/* Question */}
                <h3 className="text-sm font-bold text-gray-900">
                  {quizQuestions[currentQuestionIndex].question}
                </h3>

                {/* Options */}
                <div className="space-y-2">
                  {quizQuestions[currentQuestionIndex].options.map((option: string, idx: number) => {
                    let btnStyle = 'border-gray-100 hover:border-gray-200 hover:bg-slate-50';
                    if (selectedOptionIndex === idx) {
                      btnStyle = 'border-indigo-600 bg-indigo-50/50 text-indigo-900';
                    }
                    if (isQuizSubmitted) {
                      if (idx === quizQuestions[currentQuestionIndex].correctAnswerIndex) {
                        btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900';
                      } else if (selectedOptionIndex === idx) {
                        btnStyle = 'border-red-600 bg-red-50 text-red-900';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isQuizSubmitted}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {isQuizSubmitted && idx === quizQuestions[currentQuestionIndex].correctAnswerIndex && (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                        )}
                        {isQuizSubmitted && selectedOptionIndex === idx && idx !== quizQuestions[currentQuestionIndex].correctAnswerIndex && (
                          <XCircle className="w-4.5 h-4.5 text-red-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action panel */}
                <div className="flex justify-end pt-3">
                  {!isQuizSubmitted ? (
                    <button
                      onClick={submitAnswer}
                      disabled={selectedOptionIndex === null}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* CBSE Instant Explanations for wrong answers */}
                {isQuizSubmitted && (
                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Instant AI CBSE Doubt Solver Explanation</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                      <p className="text-xs text-gray-700"><strong className="text-gray-900">Why it is correct/wrong:</strong> {quizQuestions[currentQuestionIndex].explanation}</p>
                      <p className="text-xs text-gray-700"><strong className="text-gray-900">Real-world Example:</strong> {quizQuestions[currentQuestionIndex].example}</p>
                      <p className="text-xs text-indigo-700 font-medium"><strong className="text-gray-900">Try similar question:</strong> {quizQuestions[currentQuestionIndex].similarQuestion}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dynamic AI Flashcards</h2>
                <p className="text-xs text-gray-500">Perfect tool for revising complex definitions and quick formulas.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={flashcardTopic}
                  onChange={(e) => setFlashcardTopic(e.target.value)}
                  placeholder="Topic (e.g. AI ethics)"
                  className="border border-gray-200 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => generateFlashcards(flashcardTopic)}
                  disabled={flashcardLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  {flashcardLoading ? 'Generating...' : 'Regenerate Flashcards'}
                </button>
              </div>
            </div>

            {flashcardLoading ? (
              <div className="text-center py-12 text-gray-500 animate-pulse text-xs">Generating unique AI flashcards following CBSE specifications...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcards.map((card, idx) => {
                  const isFlipped = flippedIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setFlippedIndex(isFlipped ? null : idx)}
                      className={`h-40 rounded-xl border p-5 cursor-pointer flex flex-col justify-between transition-all select-none ${isFlipped ? 'bg-indigo-600 text-white border-indigo-700 shadow-md transform rotate-1' : 'bg-slate-50 hover:bg-white text-gray-800 border-gray-100 hover:shadow-sm'}`}
                    >
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${isFlipped ? 'text-indigo-200' : 'text-indigo-600'}`}>
                          {isFlipped ? "The Answer" : "The Question / Term"}
                        </span>
                        <p className="text-xs font-bold mt-2 leading-relaxed">
                          {isFlipped ? card.back : card.front}
                        </p>
                      </div>
                      <span className={`text-[9px] text-right block ${isFlipped ? 'text-indigo-200' : 'text-gray-400'}`}>
                        Click to Flip Card
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MIND MAPS */}
        {activeTab === 'mindmaps' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI CBSE Mind Maps</h2>
                <p className="text-xs text-gray-500">Visual mapping connecting curriculum chapters dynamically, similar to NotebookLM.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mindmapTopic}
                  onChange={(e) => setMindmapTopic(e.target.value)}
                  className="border border-gray-200 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => generateMindMap(mindmapTopic)}
                  disabled={mindmapLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  {mindmapLoading ? 'Mapping...' : 'Generate Map'}
                </button>
              </div>
            </div>

            {mindmapLoading ? (
              <div className="text-center py-12 text-gray-500 animate-pulse text-xs">Drawing conceptual mind maps using AI graph representations...</div>
            ) : (
              <div className="space-y-6 border border-gray-100 bg-slate-50/50 rounded-2xl p-6">
                <div>
                  <h3 className="font-bold text-indigo-900 text-base">{mindmapData.topic}</h3>
                  <p className="text-xs text-gray-500 mt-1">{mindmapData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mindmapData.nodes?.map((node: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 space-y-2.5">
                      <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                        <span>{node.title}</span>
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{node.details}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {node.connections?.map((conn: string, cidx: number) => (
                          <span key={cidx} className="bg-slate-50 text-gray-500 border border-gray-100 text-[9px] font-medium px-2 py-0.5 rounded">
                            🔗 {conn}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: HOMEWORK & ASSIGNMENTS */}
        {activeTab === 'homework' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Homework & Submissions</h2>
              <p className="text-xs text-gray-500">Track pending topics, upload responses, and review teacher feedback.</p>
            </div>

            <div className="space-y-4">
              {homeworks.filter(hw => hw.grade === currentUser.grade).map((hw) => (
                <div key={hw.id} className="border border-gray-100 rounded-2xl p-5 space-y-3 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wide">{hw.subject}</span>
                      <h3 className="font-bold text-gray-900 text-sm mt-0.5">{hw.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Assigned by: {hw.assignedBy} • Due: {hw.dueDate}</p>
                    </div>
                    <div>
                      {hw.status === 'pending' && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Pending</span>
                      )}
                      {hw.status === 'submitted' && (
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Submitted</span>
                      )}
                      {hw.status === 'graded' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Graded ({hw.score}/20)</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 italic">
                    "{hw.description}"
                  </p>

                  {hw.status === 'pending' && (
                    <div className="space-y-3 pt-2">
                      {submittingHwId === hw.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={hwSubmissionText}
                            onChange={(e) => setHwSubmissionText(e.target.value)}
                            placeholder="Type your response or answers here in detail..."
                            className="w-full h-28 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => { setSubmittingHwId(null); setHwSubmissionText(''); }}
                              className="border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                submitHomework(hw.id, hwSubmissionText);
                                awardPoints(30, `Completed homework for ${hw.subject}: ${hw.title}`);
                                awardBadge('Homework Hero');
                                setSubmittingHwId(null);
                                setHwSubmissionText('');
                              }}
                              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700"
                            >
                              Submit Draft
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setSubmittingHwId(hw.id); setHwSubmissionText(''); }}
                          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700"
                        >
                          Write Submission
                        </button>
                      )}
                    </div>
                  )}

                  {hw.status === 'submitted' && (
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-50">
                      <strong className="text-gray-700">My submission:</strong>
                      <p className="whitespace-pre-line bg-gray-50 p-2.5 rounded-lg mt-1">{hw.submissionText}</p>
                    </div>
                  )}

                  {hw.status === 'graded' && (
                    <div className="text-xs space-y-2.5 pt-3 border-t border-gray-50 bg-emerald-50/20 p-3 rounded-xl border border-emerald-50">
                      <div>
                        <strong className="text-gray-700">My submission:</strong>
                        <p className="whitespace-pre-line bg-white/70 p-2.5 rounded-lg mt-1 text-[11px] text-gray-600">{hw.submissionText}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-800">Teacher Evaluation Feedback:</strong>
                        <p className="text-emerald-700 mt-1 font-medium">"{hw.gradeFeedback}"</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CAREER GUIDANCE */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <span>AI 21st-Century Career Guidance</span>
              </h2>
              <p className="text-xs text-gray-500">Identify growing future-tech roles matching your passion.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-gray-500">What are you passionate about? (e.g., Drawing, space travel, environment, coding, biology)</label>
                <input
                  type="text"
                  value={careerInterests}
                  onChange={(e) => setCareerInterests(e.target.value)}
                  className="w-full border border-gray-200 px-3.5 py-2.5 text-xs rounded-xl focus:outline-none"
                />
              </div>
              <button
                onClick={getCareerGuidance}
                disabled={careerLoading}
                className="bg-indigo-600 text-white p-3 rounded-xl text-xs font-bold hover:bg-indigo-700 h-10.5 transition-colors"
              >
                {careerLoading ? 'Consulting Mentor...' : 'Consult AI Career Mentor'}
              </button>
            </div>

            {careerGuidanceText && (
              <div className="border border-gray-100 rounded-2xl p-5 bg-slate-50/50">
                <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                  {careerGuidanceText.split('\n').map((line, idx) => {
                    if (line.startsWith('###')) {
                      return <h3 key={idx} className="text-base font-bold text-gray-900 pt-2">{line.replace('###', '')}</h3>;
                    } else if (line.startsWith('####')) {
                      return <h4 key={idx} className="text-sm font-bold text-indigo-800 pt-1">{line.replace('####', '')}</h4>;
                    } else if (line.startsWith('-') || line.startsWith('1.')) {
                      return <li key={idx} className="ml-4 list-disc text-xs">{line}</li>;
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

        {/* TAB 8: GAMIFICATION, LEADERBOARDS & BADGES */}
        {activeTab === 'gamification' && (
          <div className="space-y-8">
            
            {/* Header section with sparkles */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      NEP 2020 Gamification Desk
                    </span>
                    <span className="animate-pulse bg-emerald-500 w-2 h-2 rounded-full"></span>
                  </div>
                  <h2 className="text-2xl font-black mt-1.5 flex items-center gap-2">
                    <span>🏆 Future Skills Achievement Hub</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Complete activities, lessons, and quizzes to earn Mind Points, level up, and unlock certificates.
                  </p>
                </div>
                
                <button
                  onClick={checkAndUnlockBadges}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Scan My Achievements</span>
                </button>
              </div>
            </div>

            {/* Level progression card */}
            {(() => {
              const lvl = getLevelInfo(currentUser.points || 0);
              return (
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-indigo-100 flex items-center justify-center text-3xl shadow-xs">
                      {lvl.icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-600 uppercase font-black tracking-wider">Active Level</span>
                      <h3 className="font-extrabold text-slate-800 text-lg">Level {lvl.level}: {lvl.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Title authorized by active school admin</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between items-end text-xs">
                      <span className="font-semibold text-slate-500">
                        {currentUser.points || 0} / {lvl.nextThreshold} Mind Points
                      </span>
                      {lvl.ptsNeeded > 0 ? (
                        <span className="text-slate-400">
                          <strong>{lvl.ptsNeeded}</strong> MP left to next rank
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">Max Rank achieved!</span>
                      )}
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, lvl.progress))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Daily Challenge & Ethics Pledge Bento Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card A: Daily Challenge Quiz of the Day */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">🗓️</span>
                    <span>Daily Mind Challenge</span>
                  </h3>
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded">
                    +25 MP Bonus
                  </span>
                </div>
                
                <p className="text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  Which United Nations Sustainable Development Goal (SDG) is most directly supported by building energy-efficient smart AI algorithms for electrical grids?
                </p>
                
                <div className="space-y-2">
                  {[
                    "SDG 13: Climate Action & Sustainable Energy Grids",
                    "SDG 14: Protecting Life Below Water Systems",
                    "SDG 15: Land Preservation & Deforestation"
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      disabled={challengeResult !== null && challengeResult.success}
                      onClick={() => {
                        setChallengeOption(idx);
                        if (idx === 0) {
                          awardPoints(25, "Answered Daily Mind Challenge correctly");
                          awardBadge('Top Thinker');
                          setChallengeResult({
                            success: true,
                            msg: "Excellent! You earned +25 points. Smart AI algorithms optimize renewable energy distribution, directly combating global climate change."
                          });
                        } else {
                          setChallengeResult({
                            success: false,
                            msg: "Incorrect option! Hint: Focus on climate change mitigation and power infrastructure."
                          });
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                        challengeOption === idx
                          ? idx === 0
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-red-50 border-red-300 text-red-800'
                          : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="inline-block w-5 h-5 rounded-full bg-slate-100 text-center font-bold text-[10px] mr-2 leading-5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>

                {challengeResult && (
                  <div className={`p-3 rounded-xl text-xs leading-relaxed ${challengeResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                    <div className="flex gap-2">
                      <span className="text-base">{challengeResult.success ? "✅" : "❌"}</span>
                      <p>{challengeResult.msg}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card B: Digital Ethics Pledge */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                      <span className="text-lg">⚖️</span>
                      <span>NEP Ethical AI Pledge</span>
                    </h3>
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded">
                      +20 MP Reward
                    </span>
                  </div>
                  
                  <div className="bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4 space-y-3">
                    <p className="text-[11px] font-bold text-indigo-900 italic leading-relaxed">
                      "I pledge to learn and design Artificial Intelligence technologies responsibly. I will ensure they respect citizen privacy, foster positive community integration, and align with environmental preservation goals."
                    </p>
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="ethics-pledge-check"
                        checked={pledgeChecked || (currentUser.badges || []).includes('NEP Pioneer')}
                        disabled={pledgeChecked || (currentUser.badges || []).includes('NEP Pioneer')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPledgeChecked(true);
                            awardPoints(20, "Signed Digital Ethics AI Pledge");
                            awardBadge('NEP Pioneer');
                          }
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="ethics-pledge-check" className="text-[10.5px] text-slate-600 font-medium select-none cursor-pointer">
                        I hereby agree to this 21st-century CBSE future skills code of digital conduct.
                      </label>
                    </div>
                  </div>
                </div>

                {(pledgeChecked || (currentUser.badges || []).includes('NEP Pioneer')) && (
                  <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs flex items-center gap-2">
                    <span>🌟</span>
                    <span><strong>Pledge Certified:</strong> You unlocked the "NEP Pioneer" achievement badge!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Leaderboards Podium & List */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Friendly Competition Arena</h3>
                  <p className="text-xs text-slate-400">See your current rank in comparison to peers</p>
                </div>
                
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setLeaderboardTab('school')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      leaderboardTab === 'school'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🏫 School Board
                  </button>
                  <button
                    onClick={() => setLeaderboardTab('class')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      leaderboardTab === 'class'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    📚 Class Board ({currentUser.grade})
                  </button>
                </div>
              </div>

              {/* Podium and list or custom ClassLeaderboard */}
              {leaderboardTab === 'class' ? (
                <ClassLeaderboard />
              ) : (
                <>
                  {/* Podium for top 3 */}
                  {(() => {
                    const students = allUsers
                      .filter(u => u.role === 'student' && u.schoolId === currentUser.schoolId)
                      .sort((a, b) => (b.points || 0) - (a.points || 0));

                    const first = students[0];
                    const second = students[1];
                    const third = students[2];

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        
                        {/* 2nd Place Podium */}
                        {second && (
                          <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 flex flex-col justify-between items-center text-center order-2 md:order-1 h-44 shadow-xs relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 text-slate-600 border border-slate-300 font-extrabold text-xs flex items-center justify-center shadow-xs">
                              2nd
                            </span>
                            <div className="mt-2">
                              <span className="text-3xl">{second.avatar || "👦"}</span>
                              <h4 className="font-bold text-xs text-slate-800 mt-1">{second.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium">{second.grade} • {second.section}</p>
                            </div>
                            <div className="bg-slate-200/60 border border-slate-300/40 text-slate-700 px-3 py-1 rounded-lg text-xs font-extrabold">
                              🥈 {second.points || 0} MP
                            </div>
                          </div>
                        )}

                        {/* 1st Place Podium */}
                        {first && (
                          <div className="bg-amber-50/50 rounded-2xl border-2 border-amber-200 p-4 flex flex-col justify-between items-center text-center order-1 md:order-2 h-48 shadow-md relative group">
                            <span className="absolute -top-4.5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 text-amber-950 border-2 border-amber-200 font-black text-sm flex items-center justify-center shadow-md animate-bounce">
                              👑
                            </span>
                            <div className="mt-3">
                              <span className="text-4xl">{first.avatar || "👦"}</span>
                              <h4 className="font-black text-xs text-amber-950 mt-1 flex items-center gap-1">
                                {first.name}
                              </h4>
                              <p className="text-[10px] text-amber-800 font-semibold">{first.grade} • {first.section}</p>
                            </div>
                            <div className="bg-amber-400 text-amber-950 px-4 py-1.5 rounded-xl text-xs font-black shadow-xs">
                              🥇 {first.points || 0} MP
                            </div>
                          </div>
                        )}

                        {/* 3rd Place Podium */}
                        {third && (
                          <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 flex flex-col justify-between items-center text-center order-3 h-40 shadow-xs relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-xs flex items-center justify-center shadow-xs">
                              3rd
                            </span>
                            <div className="mt-2">
                              <span className="text-3xl">{third.avatar || "👦"}</span>
                              <h4 className="font-bold text-xs text-slate-800 mt-1">{third.name}</h4>
                              <p className="text-[10px] text-slate-400 font-medium">{third.grade} • {third.section}</p>
                            </div>
                            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-xs font-extrabold">
                              🥉 {third.points || 0} MP
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })()}

                  {/* Complete Leaderboard List */}
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3 border-b border-slate-50 flex">
                      <span className="w-12">Rank</span>
                      <span className="flex-1">Student</span>
                      <span className="w-24 text-center">Streak</span>
                      <span className="w-24 text-right">Mind Points</span>
                    </div>
                    
                    <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                      {allUsers
                        .filter(u => u.role === 'student' && u.schoolId === currentUser.schoolId)
                        .sort((a, b) => (b.points || 0) - (a.points || 0))
                        .map((student, index) => {
                          const isSelf = student.id === currentUser.id;
                          return (
                            <div
                              key={student.id}
                              className={`px-5 py-3 flex items-center text-xs transition-colors ${
                                isSelf
                                  ? 'bg-indigo-50/60 font-bold border-l-4 border-indigo-500'
                                  : 'hover:bg-slate-50/50'
                              }`}
                            >
                              {/* Rank indicator */}
                              <div className="w-12">
                                <span className={`inline-block w-6 h-6 rounded-full text-center font-bold text-[11px] leading-6 ${
                                  index === 0
                                    ? 'bg-amber-100 text-amber-800'
                                    : index === 1
                                    ? 'bg-slate-200 text-slate-700'
                                    : index === 2
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {index + 1}
                                </span>
                              </div>

                              {/* Profile Avatar + Info */}
                              <div className="flex-1 flex items-center gap-2.5">
                                <span className="text-xl">{student.avatar || "👦"}</span>
                                <div>
                                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <span>{student.name}</span>
                                    {isSelf && (
                                      <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider scale-90">
                                        YOU
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-medium">
                                    {student.grade} • {student.section}
                                  </p>
                                </div>
                              </div>

                              {/* Streak Days */}
                              <div className="w-24 text-center">
                                <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                  🔥 {student.streak || 0} Days
                                </span>
                              </div>

                              {/* Points total */}
                              <div className="w-24 text-right">
                                <span className="font-black text-slate-800 text-xs">
                                  {student.points || 0} MP
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Badges Catalog Grid */}
            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Milestone Badges Catalog</h3>
                <p className="text-xs text-slate-400">Unlock these medals to show your CBSE AI curriculum excellence</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Daily Explorer', desc: 'Read lessons & keep active streaks.', icon: '🗓️', reward: '+20 MP', detail: 'Streak of 5+ days' },
                  { name: 'AI Wizard', desc: 'Score a perfect or near-perfect grade on quizzes.', icon: '🧙‍♂️', reward: '+50 MP', detail: 'Quiz result score >= 4' },
                  { name: 'Coding Champ', desc: 'Inquire coding pathways or complete homework.', icon: '💻', reward: '+40 MP', detail: 'Any code interaction' },
                  { name: 'Homework Hero', desc: 'Draft and submit course assignments.', icon: '📝', reward: '+30 MP', detail: 'Submit homework draft' },
                  { name: 'Doubt Buster', desc: 'Engage in conversational doubt resolution.', icon: '🔍', reward: '+25 MP', detail: 'Interact with AI Tutor' },
                  { name: 'NEP Pioneer', desc: 'Accept the 21st-Century future skills ethics pledge.', icon: '🌟', reward: '+20 MP', detail: 'Ethics pledge check' },
                  { name: 'Consistent Learner', desc: 'Maintain an outstanding streak of 10+ days.', icon: '🔥', reward: '+80 MP', detail: 'Streak of 10+ days' },
                  { name: 'Curriculum Scholar', desc: 'Accumulate substantial lifetime assessment points.', icon: '🏆', reward: '+100 MP', detail: 'Earn 500+ Mind Points' }
                ].map((badge) => {
                  const userBadges = currentUser.badges || [];
                  const isUnlocked = userBadges.includes(badge.name);
                  return (
                    <div
                      key={badge.name}
                      className={`border rounded-2xl p-4 flex flex-col justify-between h-44 transition-all ${
                        isUnlocked
                          ? 'bg-amber-50/20 border-amber-200/80 shadow-xs ring-1 ring-amber-100/50'
                          : 'bg-slate-50/50 border-slate-100 grayscale opacity-75'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${isUnlocked ? 'bg-amber-100' : 'bg-slate-200'}`}>
                          {badge.icon}
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                          isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>

                      <div className="space-y-1 mt-3">
                        <h4 className="font-extrabold text-xs text-slate-800">{badge.name}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{badge.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100/50 flex justify-between items-center text-[9px] text-slate-400">
                        <span>Requires: {badge.detail}</span>
                        <span className="font-bold text-indigo-600">{badge.reward}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
      <ShivChatOverlay />
    </div>
  );
}
