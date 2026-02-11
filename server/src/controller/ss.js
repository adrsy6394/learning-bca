class AIController {
  static async explain(req, res) {
    const { selectedSubject, selectedTopic, customTopic, language } = req.body;

    // 🧠 Final topic decide karte hain
    const topic = customTopic || selectedTopic;

    // ✅ Validation
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "OPENROUTER_API_KEY not found in .env",
      });
    }

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "NexaLearn AI Assistant",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful academic AI tutor. Explain clearly and in simple language.",
              },
              {
                role: "user",
                content: `
Subject: ${selectedSubject || "General"}
Topic: ${topic}
Language: ${language || "English"}

Explain in simple student-friendly language.
Add real-world examples if possible.
Use bullet points where helpful.
                `,
              },
            ],
           
          }),
        },
      );

      // ✅ Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          success: false,
          message: errorText,
        });
      }

      const data = await response.json();
      console.log("OpenRouter RAW 👉", data);

      const reply = data?.choices?.[0]?.message?.content;

      if (!reply) {
        return res.status(200).json({
          success: false,
          message: "No explanation generated",
          raw: data,
        });
      }

      return res.status(200).json({
        success: true,
        reply,
      });
    } catch (error) {
      console.error("OpenRouter Error 👉", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default AIController;
