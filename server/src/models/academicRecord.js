import mongoose from "mongoose";

const academicRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    default: 100
  },
  grade: {
    type: String
  },
  semester: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const AcademicRecord = mongoose.model("AcademicRecord", academicRecordSchema);
export default AcademicRecord;
