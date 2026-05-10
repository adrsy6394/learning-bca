import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  metadata: {
    source: String, // e.g., "README", "Syllabus", "FAQ"
    category: String,
  },
  embedding: {
    type: [Number], // Array of numbers for vector search
    required: true,
  }
}, { timestamps: true });

const Knowledge = mongoose.model("Knowledge", knowledgeSchema);

export default Knowledge;
