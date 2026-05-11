import mongoose from "mongoose";

const syllabusChunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  semester: { type: Number, required: true },
  subjectName: { type: String, required: true },
  unit: { type: String, required: true },
  topic: { type: String, required: true },
}, { timestamps: true, collection: "syllabuses" });

// Optional: Add a text index for hybrid search if needed in the future
syllabusChunkSchema.index({ text: "text" });

const SyllabusChunk = mongoose.model("SyllabusChunk", syllabusChunkSchema);
export default SyllabusChunk;
