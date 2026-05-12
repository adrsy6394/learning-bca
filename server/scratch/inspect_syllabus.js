import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const doc = await mongoose.connection.collection("syllabuses").findOne({ units: { $exists: true } });
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
};

run();
