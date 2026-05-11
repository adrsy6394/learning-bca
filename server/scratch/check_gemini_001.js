import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const run = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("Checking gemini-embedding-001...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent("test");
    console.log("✅ Works! Dimensions:", result.embedding.values.length);
  } catch (e) {
    console.log("❌ Failed:", e.message);
  }
};

run();
