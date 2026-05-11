import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const run = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // List models is not directly available in the high-level SDK sometimes,
  // but let's try to fetch it via a raw fetch if needed.
  // Actually, let's try 'text-embedding-004' again but check if there's any other name.
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const data = await response.json();
  console.log("Available models:", data.models?.map(m => m.name));
};

run();
