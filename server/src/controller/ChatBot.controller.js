export const explainTopic = async (req, res) => {
  try {
    const { subject, topic, language } = req.body;

    // ✅ Validation
    if (!subject || !topic || !language) {
      return res.status(400).json({
        success: false,
        message: "subject, topic, and language are required",
      });
    }

    // ✅ API Key Check
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "OPENROUTER_API_KEY not found in .env",
      });
    }

    // ✅ Prompt Engineering (clean & structured)
    const prompt = `
You are a helpful academic tutor.

Subject: ${subject}
Topic: ${topic}

Explain this topic in ${language}.
Use simple and student-friendly language.
Include examples if possible.
    `.trim();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5000", // recommended by OpenRouter
          "X-Title": "Learning Assistant",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // Stable free model
          messages: [
            {
              role: "system",
              content: "You are a helpful academic tutor.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      }
    );

    // ✅ Check HTTP Status
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        message: errorText,
      });
    }

    const data = await response.json();
    console.log("OpenRouter RAW 👉", data);

    const explanation = data?.choices?.[0]?.message?.content;

    if (!explanation) {
      return res.status(200).json({
        success: false,
        message: "No explanation generated",
        raw: data,
      });
    }

    return res.status(200).json({
      success: true,
      explanation,
    });

  } catch (error) {
    console.error("OpenRouter Error 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message || "OpenRouter failed",
    });
  }
};
