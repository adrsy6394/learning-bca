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

// ✅ 2. Simple Chat (Without RAG/Context)
export const chatWithContext = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

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
            { role: "system", content: "You are NexaLearn AI, a helpful academic assistant. Answer user questions clearly and professionally." },
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
    });

  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json({ success: false, message: "Failed to process chat" });
  }
};
