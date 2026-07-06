import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini API Client
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set. AI features will run in mock fallback mode.");
      return null;
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

const app = express();
app.use(express.json());

const PORT = 3000;

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI endpoints
app.post("/api/ai", async (req, res) => {
  const { action, payload, language = "English" } = req.body;
  const aiClient = getAI();

  if (!aiClient) {
    // Return mock fallback data if API key is missing
    return handleMockAI(action, payload, language, res);
  }

  try {
    let systemInstruction = "";
    let userPrompt = "";

    switch (action) {
      case "tutor_doubt":
        systemInstruction = `You are Shiv, an expert CBSE NEP 2020 AI Tutor. The student is asking a doubt in ${language}.
Always guide the student clearly on every topic, explaining how to build logical thinking and coding skills. Use simple analogies.
If they ask about an incorrect answer, explain:
1. Why it is incorrect
2. What the correct answer is
3. A simple explanation
4. An easy example
5. A similar practice question for them to try.
Keep the formatting clean using Markdown.`;
        userPrompt = `Doubt/Topic: "${payload.doubt}"\nContext/Subject: "${payload.subject || "AI & Future Skills"}"\nClass Grade: "${payload.grade || "Class 9"}"`;
        break;

      case "explain_lesson":
        systemInstruction = `You are Shiv, an animated lesson explainer for CBSE students. Explain the topic in ${language} clearly and focus on building logical coding skills where applicable.
Use extremely engaging storytelling, dynamic examples, and analogies. Break it down into:
- The Big Idea (Hook)
- Simple Explanation
- Real-World Applications (21st Century Skills)
- Check Your Understanding (Quick MCQ question).
Format in clean Markdown.`;
        userPrompt = `Explain Topic: "${payload.topic}"\nSubject: "${payload.subject || "Artificial Intelligence"}"\nGrade: "${payload.grade || "Class 10"}"`;
        break;

      case "generate_quiz":
        systemInstruction = `You are Shiv, a professional CBSE paper setter and quiz generator for CBSE curriculum conforming to NEP 2020 standards.
Generate 5 high-quality, conceptual multiple-choice questions (MCQs) in ${language} for the given topic, emphasizing coding logic and critical reasoning. Include competency-based and HOTS (High Order Thinking Skills) questions.
Response MUST be valid JSON only. Do not wrap in markdown blocks like \`\`\`json. Return a JSON array of questions, where each question has:
{
  "question": "text",
  "options": ["A", "B", "C", "D"],
  "correctAnswerIndex": number (0-3),
  "explanation": "Simple explanation of why it is correct and others are incorrect",
  "example": "Real-world example",
  "similarQuestion": "A small similar practice question text"
}`;
        userPrompt = `Topic: "${payload.topic}"\nGrade: "${payload.grade || "Class 8"}"`;
        break;

      case "generate_mindmap":
        systemInstruction = `You are Shiv, a visual AI education assistant. Generate a structured mind map for CBSE students on the given topic in ${language} to clearly guide them.
Response MUST be valid JSON only. Do not wrap in markdown blocks. Return a JSON object representing the mind map:
{
  "topic": "Main Topic",
  "description": "Brief 1-sentence overview",
  "nodes": [
    {
      "title": "Subtopic Title",
      "details": "Explanation of subtopic",
      "connections": ["connected idea 1", "connected idea 2"]
    }
  ]
}`;
        userPrompt = `Topic: "${payload.topic}"\nSubject: "${payload.subject || "Future Skills"}"`;
        break;

      case "generate_flashcards":
        systemInstruction = `You are Shiv, an AI study assistant. Generate a set of 6 educational flashcards for the given topic in ${language} to clarify concepts and coding logical patterns.
Response MUST be valid JSON only. Do not wrap in markdown blocks. Return a JSON array:
[
  {
    "front": "Term / Question",
    "back": "Definition / Key Explanation / Answer"
  }
]`;
        userPrompt = `Topic: "${payload.topic}"\nGrade: "${payload.grade || "Class 9"}"`;
        break;

      case "generate_worksheet":
        systemInstruction = `You are Shiv, a Teacher Assistant and CBSE paper setter. Create an interactive CBSE worksheet/question paper in ${language} following NEP 2020 guidelines.
Include:
1. Short conceptual questions (3 questions)
2. Case-study/Competency-based question (1 question with sub-parts)
3. Higher Order Thinking Skills (HOTS) question (1 question to test logical coding skills)
Format beautifully in Markdown. Provide solutions/marking scheme at the very bottom.`;
        userPrompt = `Topic: "${payload.topic}"\nGrade: "${payload.grade || "Class 10"}"\nDifficulty: "${payload.difficulty || "Medium"}"`;
        break;

      case "career_guidance":
        systemInstruction = `You are Shiv, an AI Career Mentor. Provide personalized guidance in ${language} on how the student can build robust logical coding skills and prepare for future AI and 21st-century careers under CBSE standards.
Highlight:
- Growing future career roles related to the student's interests
- Relevant CBSE AI elective modules and skills to learn
- Suggested simple hands-on projects they can build right now.
Format beautifully in Markdown.`;
        userPrompt = `Student Interests: "${payload.interests}"\nGrade: "${payload.grade || "Class 9"}"`;
        break;

      default:
        return res.status(400).json({ error: "Invalid action type" });
    }

    // Call Gemini API using gemini-2.5-flash
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        // If action expects JSON, we can instruct the model, or use JSON responseMimeType
        responseMimeType: action.includes("json") || action.startsWith("generate_quiz") || action.startsWith("generate_mindmap") || action.startsWith("generate_flashcards") ? "application/json" : "text/plain"
      }
    });

    const responseText = response.text || "";

    if (action.includes("json") || action.startsWith("generate_quiz") || action.startsWith("generate_mindmap") || action.startsWith("generate_flashcards")) {
      try {
        // Clean markdown backticks just in case
        let cleanText = responseText.trim();
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.substring(7);
        }
        if (cleanText.endsWith("```")) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        const jsonData = JSON.parse(cleanText.trim());
        return res.json({ success: true, data: jsonData });
      } catch (parseError) {
        console.error("JSON Parse Error on Gemini response:", responseText, parseError);
        // Fall back to sending raw text or a parsed mock
        return res.json({ success: true, raw: responseText, error: "Response was not perfect JSON" });
      }
    }

    return res.json({ success: true, text: responseText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || "Failed to contact Gemini API" });
  }
});

// Mock Fallback Handler in case GEMINI_API_KEY is not defined
function handleMockAI(action: string, payload: any, language: string, res: any) {
  console.log(`Fallback mock response for: ${action} (${language})`);
  const topic = payload.topic || payload.doubt || "Artificial Intelligence";

  if (action === "tutor_doubt") {
    return res.json({
      success: true,
      text: `### Shiv AI Tutor (Demo Mode)
You asked about **"${topic}"** in **${language}**.
Here is a simplified explanation for a CBSE student to build robust logical skills:

- **What it is**: Think of ${topic} like a helpful logical brain partner. It helps you design processes step-by-step and write structured code.
- **NEP 2020 Connection**: This is critical for developing your 21st-century problem-solving, computing, and logical coding skills!
- **Did you know?**: Coding logic helps you break large problems into small, solveable pieces (decomposition).

**Coding Practice Challenge for You:**
Try sketching a basic flowchart or pseudo-code to solve this topic's key problem!
*Try answering below!*`
    });
  }

  if (action === "explain_lesson") {
    return res.json({
      success: true,
      text: `### Animated Lesson: ${topic} 🚀
*Language: ${language}*

#### 💡 The Big Idea
Imagine having a companion that could learn to recognize your voice, solve complex puzzles with you, and help you program code! That's the power of modern Future Skills.

#### 🧠 Simple Explanation
In CBSE AI syllabus, we learn that AI isn't magic—it's **data + algorithms**. By showing a computer thousands of photos of cats, it learns what a cat looks like. That's Machine Learning!

#### 🛠️ Real-World Application (21st Century Skills)
- **Smart Cities**: Managing traffic lights using real-time camera data.
- **Healthcare**: Predicting diseases before they become severe.

#### ✏️ Quick Quiz
Which of the following is a subfield of AI?
A) Web browsing
B) Machine Learning
C) Keyboarding
*Answer: B!*`
    });
  }

  if (action === "generate_quiz") {
    return res.json({
      success: true,
      data: [
        {
          question: `What is the core difference between Human Intelligence and Artificial Intelligence in ${topic}?`,
          options: [
            "AI has emotions and consciousness, while humans only process data.",
            "Humans learn from experiences and intuition, while AI learns from pre-fed data and algorithms.",
            "AI does not require electrical power to function.",
            "There is no difference; they are exactly the same."
          ],
          correctAnswerIndex: 1,
          explanation: "Humans possess natural cognitive skills, emotional intelligence, and intuition. AI relies on algorithms, structured datasets, and computational power to mimic specific cognitive functions.",
          example: "A human feels happy when solving a puzzle, while an AI simply flags the puzzle as solved in 0.02 seconds.",
          similarQuestion: "Which component is essential for machine learning algorithms to train?"
        },
        {
          question: "Which of the following is considered a core 21st Century skill?",
          options: [
            "Rote memorization of historical dates",
            "Critical thinking and collaborative problem-solving",
            "High-speed physical typing",
            "Copying files manually between drives"
          ],
          correctAnswerIndex: 1,
          explanation: "NEP 2020 emphasizes the 4 Cs: Critical thinking, Communication, Collaboration, and Creativity. These are foundational 21st-century skills.",
          example: "Working in a team of 4 to design an AI chatbot that alerts local authorities about overflowing storm drains.",
          similarQuestion: "Define 'Computational Thinking' in your own words."
        },
        {
          question: "In Python programming, what is a 'List' used for?",
          options: [
            "To send an email to a group of people",
            "To store multiple items in a single ordered variable",
            "To speed up the computer's CPU speed",
            "To draw graphics on the screen"
          ],
          correctAnswerIndex: 1,
          explanation: "Lists are used to store collections of data in order, which can be modified, appended, or sorted programmatically.",
          example: "Storing the grades of 10 students: grades = [85, 92, 78, 90, 88].",
          similarQuestion: "What is the index of the first element in a Python list?"
        }
      ]
    });
  }

  if (action === "generate_mindmap") {
    return res.json({
      success: true,
      data: {
        topic: topic,
        description: `Visual representation of ${topic} aligned with CBSE NEP 2020 curriculum guidelines.`,
        nodes: [
          {
            title: "Core Definition",
            details: "Understanding the basic concept and how it affects our daily interactions.",
            connections: ["Data inputs", "Algorithmic thinking"]
          },
          {
            title: "Key Elements",
            details: "The building blocks of this future skill and digital literacy.",
            connections: ["Problem identification", "Creative solution design"]
          },
          {
            title: "CBSE Syllabus Application",
            details: "Practical hands-on projects, ethical considerations, and board examination patterns.",
            connections: ["Social impact projects", "HOTS questions"]
          }
        ]
      }
    });
  }

  if (action === "generate_flashcards") {
    return res.json({
      success: true,
      data: [
        {
          front: "What is Machine Learning?",
          back: "A subset of AI where computers learn from data without being explicitly programmed."
        },
        {
          front: "Name the 4 Cs of 21st Century Skills defined by NEP 2020",
          back: "Critical Thinking, Creativity, Collaboration, and Communication."
        },
        {
          front: "What is Computer Vision?",
          back: "An AI field that enables computers to interpret and understand digital images and videos."
        },
        {
          front: "What is NLP?",
          back: "Natural Language Processing - the ability of a computer to understand human language."
        }
      ]
    });
  }

  if (action === "generate_worksheet") {
    return res.json({
      success: true,
      text: `### CBSE Practice Worksheet: ${topic} 📝
*Aligned with NEP 2020 Competency-Based Learning*

#### Section A: Short Conceptual Questions (3 Marks Each)
1. Differentiate between narrow AI and general AI with one example of each.
2. Explain the role of 'data bias' in training machine learning models. How does it affect society?
3. What is the significance of the "Ethical AI" framework discussed in the CBSE AI handbook?

#### Section B: Case-Study / Competency-Based Question (5 Marks)
**Read the scenario below and answer the questions:**
*Delhi Public School wants to implement an automated attendance system using facial recognition. However, some parents are concerned about biometric data privacy and the potential for false negatives.*
- a) Identify the primary AI domain used in this scenario.
- b) Discuss two ethical considerations the school administration must address before launching this system.

#### Section C: HOTS (High Order Thinking Skills) Question (5 Marks)
"AI is not a replacement for teachers, but teachers who use AI will replace those who do not." Analyse this statement in the context of personalized learning pathways in schools.

---
#### 🔑 Marking Scheme & Solutions
- **Section A1**: Narrow AI performs a specific task (e.g., Alexa playing music). General AI is hypothetical human-level intelligence.
- **Section A2**: Bias in training data leads to unfair decisions. (e.g., recruiting AI favoring one gender because of historical hiring trends).
- **Section B**: Domain is Computer Vision. Ethics includes: consent, data encryption, and having a manual backup attendance option.`
    });
  }

  if (action === "career_guidance") {
    return res.json({
      success: true,
      text: `### 🚀 EduMind Future Careers Guide: ${topic}
*Specialized Guidance for CBSE AI & Coding Students*

#### 🌟 Emerging Career Roles
1. **AI Ethicist & Bias Auditor**: Ensuring algorithmic models are fair, transparent, and align with human welfare.
2. **Data Scientist (Future Skills)**: Processing and analyzing huge volumes of student or industrial data.
3. **Robotics Engineer**: Designing intelligent systems for smart automation, farming, and space exploration.

#### 📚 Key CBSE AI Modules to Study
- **Introduction to AI** (Class 9)
- **AI Project Cycle** (Class 10)
- **Machine Learning & Neural Networks** (Class 11/12 elective)

#### 🛠️ Recommended Hands-on Projects
- Create a Teachable Machine model to detect garbage items (biodegradable vs. non-biodegradable) to promote school sustainability.`
    });
  }

  return res.status(400).json({ error: "Invalid action" });
}

// Vite middleware configuration for full-stack operation
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduMind AI Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
