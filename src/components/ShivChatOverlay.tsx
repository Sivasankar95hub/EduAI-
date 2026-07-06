/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSaaSState } from '../lib/stateStore';
import { 
  MessageSquare, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, 
  ArrowRight, Brain, Trophy, GraduationCap, Star, BookOpen, ChevronRight, Zap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function ShivChatOverlay() {
  const { currentUser, language, awardPoints } = useSaaSState();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice & Audio Speech State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null); // message id currently speaking
  const [chatLanguage, setChatLanguage] = useState<'English' | 'Hindi'>(
    language === 'Hindi' ? 'Hindi' : 'English'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize with greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'ai',
          text: `Namaste ${currentUser.name}! 📚

I am **Shiv**, your personal CBSE NEP 2020 AI Tutor & Future Career Mentor. 

How can I help you today? You can:
1. Ask any doubt from your Artificial Intelligence or Coding lessons.
2. Request a quick conceptual puzzle or coding challenge.
3. Inquire about future tech careers under CBSE guidelines.

Try clicking the 🎤 button to ask your doubt using your voice!`,
          timestamp: new Date()
        }
      ]);
    }
  }, [currentUser, messages]);

  // Synchronize language selection from parent context
  useEffect(() => {
    if (language === 'Hindi') {
      setChatLanguage('Hindi');
    } else {
      setChatLanguage('English');
    }
  }, [language]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  // Handle Text-to-Speech (reading message aloud)
  const speakMessage = (msgId: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
    } else {
      window.speechSynthesis.cancel(); // cancel any active speech first
      const cleanText = textToSpeak.replace(/[#*`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = chatLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      setIsSpeaking(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop speaking when overlay closes
  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(null);
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isOpen, isListening]);

  // Handle Speech Recognition (listening to voice input)
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback stimulation for environment without audio drivers/API
      setIsListening(true);
      const mockPhrases = [
        "What is the difference between supervised and unsupervised learning?",
        "Explain Python loops with an analogy",
        "Give me a coding challenge on algorithms",
        "How does Neural Networks work in CBSE AI?"
      ];
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      setTimeout(() => {
        setInputText(randomPhrase);
        setIsListening(false);
      }, 1500);
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current?.stop();
        return;
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.lang = chatLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
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
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Submit query to AI
  const handleSendMessage = async (customQuery?: string) => {
    const query = (customQuery || inputText).trim();
    if (!query) return;

    if (!customQuery) {
      setInputText('');
    }

    // Add User Message
    const userMsgId = `msg-user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tutor_doubt',
          language: chatLanguage,
          payload: {
            doubt: query,
            grade: currentUser.grade || 'Class 10',
            subject: 'Artificial Intelligence & Future Skills'
          }
        })
      });

      const data = await response.json();
      if (data.success && data.text) {
        // Add AI response
        setMessages(prev => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            sender: 'ai',
            text: data.text,
            timestamp: new Date()
          }
        ]);

        // Award points occasionally for interacting with Shiv
        if (Math.random() > 0.4) {
          awardPoints(5, 'Engaging with Shiv AI Career & Doubt Mentor');
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      // Elegant demo mode fallback answers
      let fallbackText = '';
      const lowercaseQuery = query.toLowerCase();

      if (lowercaseQuery.includes('loop') || lowercaseQuery.includes('coding') || lowercaseQuery.includes('programming')) {
        fallbackText = `### 🐍 Coding & Python Loops under CBSE NEP 2020

In coding, a **Loop** is like a round-about track. It tells the computer to repeat a block of code until a condition is satisfied.

**Analogy Time:**
Think of writing line-impositions as a punishment in school: 
*"Write 'I will practice coding daily' 10 times."* 
Rather than writing the line 10 separate times in code, you write a **For Loop**:

\`\`\`python
for i in range(10):
    print("I will practice coding daily")
\`\`\`

**Try this Challenge:**
What would happen if the condition in a loop is always True? (Comment below or tell me!)`;
      } else if (lowercaseQuery.includes('career') || lowercaseQuery.includes('job') || lowercaseQuery.includes('future')) {
        fallbackText = `### 🚀 Future Careers in AI (CBSE Class 11 & 12 Electives)

Under CBSE NEP 2020 guidelines, future skills prepare you for careers like:
1. **Machine Learning Engineer**: Designing models that learn.
2. **Data Ethicist**: Ensuring AI respects human bias and fairness.
3. **Computer Vision Architect**: Helping smart cameras recognize objects.

**Next Action Step:**
Make sure you choose the CBSE Subject Code 417 (Artificial Intelligence) as an elective to acquire early hands-on portfolio credits!`;
      } else if (lowercaseQuery.includes('supervised') || lowercaseQuery.includes('machine learning')) {
        fallbackText = `### 🧠 Supervised vs. Unsupervised Learning

In the CBSE AI Project Cycle, machine learning algorithms are divided into:

- **Supervised Learning**: Learning with a teacher. The dataset has inputs with matching correct answers (labels).
  - *Example*: Showing an AI pictures of dogs explicitly labeled "Dog" and cats explicitly labeled "Cat".
- **Unsupervised Learning**: Learning by exploring on your own. The dataset has no labels.
  - *Example*: Giving an AI hundreds of mixed animal pictures and letting it group similar objects by shapes/colors itself.

Would you like a multiple-choice question on this to test your understanding?`;
      } else {
        fallbackText = `### 🌟 Shiv's Educational Brainstorm

You asked about **"${query}"** in **${chatLanguage}**.

Under the CBSE Class 8-12 AI Curriculum, we focus on three primary computational domains:
1. **Data Sciences**: Gathering, analyzing, and plotting trends.
2. **Computer Vision (CV)**: Giving vision capabilities to automated software.
3. **Natural Language Processing (NLP)**: Empowering computers to understand spoken dialects.

**How to approach this topic logically:**
- Breakdown this topic into smaller sub-problems.
- Identify real-world AI applications (like self-driving cars, translations).
- Focus on critical thinking and ethical AI impacts!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-ai-fallback-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick prompt triggers
  const SUGGESTED_DOUBTS = [
    { text: "🐍 Explain Python Loops", short: "Loops" },
    { text: "🤖 Supervised vs Unsupervised AI", short: "Supervised AI" },
    { text: "💼 Future Careers in AI", short: "AI Careers" },
    { text: "💡 Give me a logic puzzle", short: "Logic Puzzle" }
  ];

  // Markdown-like text formatter
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content: React.ReactNode = line;

      // Handle custom blockquotes/headings
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-bold text-slate-800 mt-2 mb-1 uppercase tracking-wider flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /> {line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-sm font-extrabold text-slate-900 mt-3 mb-1.5">{line.replace('## ', '')}</h3>;
      }

      // Handle list items
      const isListItem = line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line);
      let listStyle = "";
      if (isListItem) {
        listStyle = "pl-3 text-slate-700 font-medium my-0.5 list-disc";
        content = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
      }

      // Format bold markup: **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      const textToParse = typeof content === 'string' ? content : line;

      while ((match = boldRegex.exec(textToParse)) !== null) {
        const index = match.index;
        if (index > lastIndex) {
          parts.push(textToParse.substring(lastIndex, index));
        }
        parts.push(<strong key={index} className="font-extrabold text-indigo-950">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < textToParse.length) {
        parts.push(textToParse.substring(lastIndex));
      }

      const renderedLine = parts.length > 0 ? parts : textToParse;

      if (isListItem) {
        return (
          <li key={idx} className="list-none flex items-start gap-1.5 my-1 text-slate-700">
            <span className="text-indigo-500 mt-1 select-none text-[8px]">●</span>
            <span className="flex-1">{renderedLine}</span>
          </li>
        );
      }

      return <p key={idx} className="leading-relaxed mb-1.5">{renderedLine}</p>;
    });
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Floating action tool-tip when closed */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1 }}
            className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border border-slate-800"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ask Shiv, your AI Mentor!</span>
          </motion.div>
        )}

        {/* Trigger Button */}
        <motion.button
          id="shiv-fab-button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer relative ${
            isOpen
              ? 'bg-slate-800 text-white'
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 text-white ring-4 ring-indigo-100/50'
          }`}
          title="Chat with Shiv AI"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-[8px] font-black text-white animate-pulse">
                !
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* CHAT OVERLAY BOX */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="shiv-chat-overlay"
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xl relative">
                  👦
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>Shiv AI Tutor</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  </h3>
                  <p className="text-[10px] text-indigo-200 font-semibold tracking-wide flex items-center gap-1">
                    <span>CBSE NEP 2020 Mentor</span>
                  </p>
                </div>
              </div>

              {/* Language Selector & Close */}
              <div className="flex items-center gap-2">
                <div className="flex bg-white/10 p-0.5 rounded-lg border border-white/5">
                  <button
                    onClick={() => {
                      setChatLanguage('English');
                      setMessages(prev => [
                        ...prev,
                        {
                          id: `lang-sw-${Date.now()}`,
                          sender: 'ai',
                          text: "Switched to English instructions! Clear doubts & code efficiently.",
                          timestamp: new Date()
                        }
                      ]);
                    }}
                    className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                      chatLanguage === 'English' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      setChatLanguage('Hindi');
                      setMessages(prev => [
                        ...prev,
                        {
                          id: `lang-sw-${Date.now()}`,
                          sender: 'ai',
                          text: "अब मैं आपके प्रश्नों का उत्तर हिंदी में दूँगा। पूछिए अपना कोई भी संदेह!",
                          timestamp: new Date()
                        }
                      ]);
                    }}
                    className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                      chatLanguage === 'Hindi' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Micro Announcement bar */}
            <div className="bg-indigo-50 border-b border-indigo-100/60 px-4 py-1.5 flex items-center justify-between text-[10px] text-indigo-700 font-semibold">
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                <span>Interact with Shiv & earn assessment Mind Points (+MP)</span>
              </span>
              <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono font-bold">ACTIVE</span>
            </div>

            {/* Chat message feed */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%] flex flex-col gap-1">
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs border ${
                          isUser
                            ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white border-indigo-500 rounded-tr-none'
                            : 'bg-white text-slate-800 border-slate-200/60 rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-line leading-relaxed">
                          {isUser ? msg.text : formatMessageText(msg.text)}
                        </div>

                        {/* Speech controls for AI message */}
                        {!isUser && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => speakMessage(msg.id, msg.text)}
                              className={`text-[9px] font-bold flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                                isSpeaking === msg.id 
                                  ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' 
                                  : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent'
                              }`}
                            >
                              {isSpeaking === msg.id ? (
                                <>
                                  <VolumeX className="w-3 h-3" />
                                  <span>Stop Speaking</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3" />
                                  <span>Speak Aloud</span>
                                </>
                              )}
                            </button>
                            <span className="text-[8px] text-slate-400 font-mono font-medium">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-500 shadow-xs flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-200" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-300" />
                    </span>
                    <span className="font-semibold text-slate-400">Shiv is analyzing curriculum...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length < 4 && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none">
                {SUGGESTED_DOUBTS.map((doubt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(doubt.text)}
                    className="shrink-0 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 px-2.5 py-1 rounded-full transition-all flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{doubt.short}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Panel */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex gap-2 items-center">
                {/* Voice Input Button */}
                <button
                  onClick={startSpeechRecognition}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer relative shrink-0 ${
                    isListening
                      ? 'bg-red-50 text-red-600 border-red-200 ring-4 ring-red-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                  title={isListening ? "Shiv is listening..." : "Click to speak your doubt"}
                >
                  {isListening ? (
                    <>
                      <Mic className="w-4 h-4 text-red-600" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                    </>
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isListening 
                      ? "Shiv is listening to you..." 
                      : `Ask doubt in ${chatLanguage}...`
                  }
                  disabled={isListening}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800 font-medium"
                />

                {/* Send button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isListening}
                  className={`p-2.5 rounded-xl transition-all font-bold cursor-pointer shrink-0 ${
                    inputText.trim() && !isListening
                      ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-400 border border-slate-100'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Mini Disclaimer */}
              <div className="mt-2 text-[9px] text-slate-400 font-medium text-center">
                Shiv utilizes AI to answer doubts. Follow CBSE study guidelines.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
