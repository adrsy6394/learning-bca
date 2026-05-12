import ragService from "../services/ragService.js";

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

// ✅ 2. Chat with RAG Context
export const chatWithContext = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // 1. Fetch Context using Vector Search
    console.log("🔍 Searching vector database for context...");
    const contextResults = await ragService.searchContext(message);
    const contextText = contextResults.length > 0 
      ? contextResults.map(c => `- ${c.text} (Semester: ${c.semester}, Subject: ${c.subjectName})`).join("\n")
      : "No specific syllabus context found.";

    console.log("📄 Context Found:", contextResults.length, "items");

    // 2. Prepare System Prompt with Context
    const systemPrompt = `
You are NexaLearn AI, a premium academic assistant for BCA students. 
Your goal is to provide clear, structured, and professional answers.

Syllabus Context:
${contextText}

Instructions:
1. Use clean Markdown formatting:
   - Use bold (**) for subject names and unit titles.
   - Use bullet points (-) for listing topics.
   - Use paragraphs for explanations.
2. Avoid excessive symbols or random stars.
3. If the context contains syllabus data, present it in a well-organized list.
4. Maintain a helpful, academic, and professional tone.
    `.trim();

    // 3. Call LLM via OpenRouter
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
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
        }),
      }
    );

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    return res.status(200).json({
      success: true,
      reply: reply || "I'm sorry, I couldn't generate a response.",
      contextUsed: contextResults.length > 0
    });

  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ success: false, message: "Failed to process chat" });
  }
};
