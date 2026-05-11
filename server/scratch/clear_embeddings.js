import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Clearing existing embeddings from 'syllabuses' collection...");
  const result = await mongoose.connection.collection("syllabuses").updateMany(
    {},
    { $unset: { embedding: "" } }
  );
  console.log(`Cleared ${result.modifiedCount} embeddings.`);
  process.exit(0);
};

run();
