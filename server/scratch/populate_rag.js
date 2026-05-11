import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import ragService from "../src/services/ragService.js";

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected! Starting RAG processing...");
    
    const result = await ragService.processSyllabuses();
    console.log("Result:", result);
    
    process.exit(0);
  } catch (error) {
    console.error("Fatal Error:", error);
    process.exit(1);
  }
};

run();
