import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import ragService from "../src/services/ragService.js";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Testing vector search for 'Binary Number System'...");
  
  const results = await ragService.searchContext("Binary Number System");
  console.log("Results found:", results.length);
  results.forEach((r, i) => {
    console.log(`${i+1}: ${r.text} (Score: ${r.score})`);
  });
  
  process.exit(0);
};

run();
