import ragService from "../services/ragService.js";
import AcademicRecord from "../models/AcademicRecord.js";

// ✅ 1. Explain Topic (Standard LLM call)
export const explainTopic = async (req, res) => {
  try {
    const { subject, topic, language } = req.body;

    if (!subject || !topic || !language) {
      return res.status(400).json({ success: false, message: "subject, topic, and language are required" });
    }

    const prompt = `
You are a helpful academic tutor.
Subject: ${subject}
Topic: ${topic}
Explain this topic in ${language} using simple and student-friendly language with examples.
    `.trim();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "NexaLearn AI Assistant",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
        }),
      }
    );

    const data = await response.json();
    const explanation = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ success: true, explanation });
  } catch (error) {
    console.error("Explain Topic Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate explanation" });
  }
};

// ✅ 2. RAG Chat (Site-Specific knowledge + User Context)
export const chatWithContext = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // 1. Retrieve site-wide context from MongoDB Vector/Text Search
    const siteContext = await ragService.searchKnowledge(message);

    // 2. Retrieve user-specific context (Academic Records)
    let userContext = "";
    if (userId) {
      const records = await AcademicRecord.find({ user: userId });
      if (records.length > 0) {
        userContext = "User's Academic Records:\n" + records.map(r => 
          `- Subject: ${r.subject}, Marks: ${r.marks}/${r.totalMarks}, Grade: ${r.grade}, Semester: ${r.semester}`
        ).join("\n");
      }
    }

    const prompt = `
You are NexaLearn AI, an assistant for the NexaLearn platform.
Use the following context to answer the user's question.

### Site/Syllabus Context:
${siteContext || "No specific site context found."}

### User-Specific Context:
${userContext || "No specific academic records found for this user."}

### User Question: 
${message}

Instructions:
1. If the user asks about the syllabus or website, refer to the Site Context.
2. If the user asks about their own performance, marks, or records, refer to the User-Specific Context.
3. If the information is not in either context, use your general knowledge but mention you are an academic assistant.
4. Keep the tone helpful, encouraging, and professional.
    `.trim();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "NexaLearn AI Assistant",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: "You are NexaLearn AI, a helpful assistant for the NexaLearn platform." },
            { role: "user", content: prompt }
          ],
        }),
      }
    );

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    return res.status(200).json({
      success: true,
      reply: reply || "I'm sorry, I couldn't generate a response.",
      contextUsed: !!siteContext || !!userContext
    });

  } catch (error) {
    console.error("RAG Chat Error:", error);
    return res.status(500).json({ success: false, message: "Failed to process chat" });
  }
};
