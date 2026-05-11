import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const run = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // There is no listModels in the client directly like this in some versions, 
  // but let's try to see if we can find the right model name.
  console.log("Checking model names...");
  // Try to use a common one
  const models = ["text-embedding-004", "embedding-001", "models/text-embedding-004", "models/embedding-001"];
  
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.embedContent("test");
      console.log(`✅ Model ${m} works!`);
      process.exit(0);
    } catch (e) {
      console.log(`❌ Model ${m} failed: ${e.message}`);
    }
  }
};

run();
