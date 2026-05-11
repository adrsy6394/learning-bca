import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const run = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  try {
    const result = await model.embedContent({
      content: { parts: [{ text: "test" }] },
      outputDimensionality: 768,
    });
    console.log("✅ Dimensions forced to 768:", result.embedding.values.length);
  } catch (e) {
    console.log("❌ Failed to force dimensions:", e.message);
  }
};

run();
