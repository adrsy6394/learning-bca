import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const docs = await mongoose.connection.collection("syllabuses").find({ embedding: { $exists: true } }).limit(10).toArray();
  docs.forEach(d => console.log(d.text));
  process.exit(0);
};

run();
