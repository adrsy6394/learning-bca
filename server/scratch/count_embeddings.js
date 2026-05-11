import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await mongoose.connection.collection("syllabuses").countDocuments({ embedding: { $exists: true } });
  console.log(`Total documents with embeddings in 'syllabuses': ${count}`);
  process.exit(0);
};

run();
