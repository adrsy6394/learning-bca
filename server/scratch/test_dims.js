import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const run = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const models = ["gemini-embedding-001", "gemini-embedding-2", "text-embedding-004"];
  
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.embedContent("test");
      console.log(`✅ ${m}: ${result.embedding.values.length} dims`);
    } catch (e) {
      console.log(`❌ ${m}: ${e.message}`);
    }
  }
};

run();
