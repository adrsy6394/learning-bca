import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
  semester: { type: Number, required: true },
  subjectName: { type: String, required: true },
  units: [
    {
      unitName: { type: String, required: true },
      topics: [{ type: String, required: true }]
    }
  ]
}, { timestamps: true });

const Syllabus = mongoose.model("Syllabus", syllabusSchema);
export default Syllabus;
