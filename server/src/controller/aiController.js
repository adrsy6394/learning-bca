import User from "../models/User.js";

// @desc    Analyze custom performance based on user-provided marks
// @route   POST /api/v2/ai/analyze-custom
// @access  Private
export const analyzeCustomPerformance = async (req, res) => {
  try {
    const { subjectsWithMarks } = req.body; // Array of { subject, marks }

    if (!subjectsWithMarks || !Array.isArray(subjectsWithMarks)) {
      return res.status(400).json({ success: false, message: "Subjects and marks are required" });
    }

    const prompt = `
      You are an AI Academic Analyst. A student has provided their marks:
      ${JSON.stringify(subjectsWithMarks)}

      Analyze this data and identify:
      1. Top Weak Subjects (marks < 40 or relatively low).
      2. A 1-week study strategy for these subjects.
      3. Specific resources (YouTube/Google) to improve.

      IMPORTANT: Return ONLY a valid JSON object. 
      For "youtube" and "google" links, use search query URLs to ensure they work.
      YouTube format: https://www.youtube.com/results?search_query=BCA+[Subject]+[Topic]+tutorial
      Google format: https://www.google.com/search?q=BCA+[Subject]+[Topic]+notes+pdf
      
      Structure:
      {
        "weaknesses": ["Subject 1", "Subject 2"],
        "analysis": "Brief analysis",
        "studyPlan": [
          {"day": "Day 1", "task": "Task description"},
          ...
        ],
        "resources": [
          {"subject": "Subject Name", "youtube": "link", "google": "link"}
        ]
      }
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    let content = data.choices[0].message.content;
    content = content.replace(/```json|```/g, "").trim();
    
    const result = JSON.parse(content);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Analyze user performance and identify weaknesses
// @route   POST /api/v2/ai/analyze
// @access  Private
export const analyzePerformance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const progress = user.progress || {};
    
    // Check if OpenRouter key exists
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ success: false, message: "OpenRouter API Key missing" });
    }

    const prompt = `
      You are an AI Academic Analyst. Below is the learning progress of a BCA student:
      ${JSON.stringify(progress)}

      Analyze this data and identify:
      1. Top 3 Weak Subjects (subjects with least progress).
      2. Specific areas for improvement.
      3. A short encouraging feedback message.

      IMPORTANT: Return ONLY a valid JSON object. Do not include any preamble or explanation.
      For "youtube" and "google" links, use search query URLs to ensure they work.
      YouTube format: https://www.youtube.com/results?search_query=BCA+[Subject]+[Topic]+tutorial
      Google format: https://www.google.com/search?q=BCA+[Subject]+[Topic]+notes+pdf

      Structure:
      {
        "weaknesses": ["Subject Name 1", "Subject Name 2", "Subject Name 3"],
        "analysis": "Brief analysis text",
        "tips": ["Tip 1", "Tip 2"],
        "resources": [
          {"subject": "Subject Name", "youtube": "link", "google": "link"}
        ]
      }
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean markdown if present
    content = content.replace(/```json|```/g, "").trim();
    
    const result = JSON.parse(content);

    // Save weaknesses to user profile
    user.weaknesses = result.weaknesses;
    await user.save();

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate a custom weekly study plan
// @route   POST /api/v2/ai/generate-plan
// @access  Private
export const generateStudyPlan = async (req, res) => {
  try {
    const { dailyHours } = req.body;
    const user = await User.findById(req.user._id);

    const prompt = `
      Create a 7-day study plan for a BCA student.
      Daily study limit: ${dailyHours} hours.
      Weak subjects to focus on: ${user.weaknesses.join(", ")}.
      
      IMPORTANT: Return ONLY a valid JSON array of objects. Do not include any preamble.
      
      Structure:
      [
        {"day": "Monday", "tasks": ["Task 1", "Task 2"], "focus": "Subject Name"},
        ...
      ]
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Clean markdown if present
    content = content.replace(/```json|```/g, "").trim();
    
    const plan = JSON.parse(content);

    user.studyPlan = plan;
    await user.save();

    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate an answer for a specific flashcard topic
// @route   POST /api/v2/ai/flashcard-answer
// @access  Private
export const generateFlashcardAnswer = async (req, res) => {
  try {
    const { topic, subject, semester } = req.body;

    if (!topic || !subject) {
      return res.status(400).json({ success: false, message: "Topic and subject are required" });
    }

    const prompt = `
      You are an expert tutor for a BCA (Bachelor of Computer Applications) student in Semester ${semester || "unknown"}.
      The student is studying the subject: "${subject}".
      
      Explain the following topic in a way that is perfect for a flashcard: "${topic}".
      
      Rules:
      1. Be extremely concise but comprehensive.
      2. Use bullet points for readability.
      3. Keep it under 100 words.
      4. Use Markdown formatting (bolding important terms).
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;

    res.status(200).json({ success: true, answer });
  } catch (error) {
    console.error("Error generating flashcard answer:", error);
    res.status(500).json({ success: false, message: "Failed to generate answer" });
  }
};
