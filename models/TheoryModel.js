import mongoose from "mongoose";

// Define the schema for theory exams
const theoryExamSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true },
    instruction: { type: String, required: true },
    type: { type: String, default: 'theory', required: true },
    duration: { type: Number, required: true },
    status: { type: Boolean, required: true },
    questions: [{ question: { type: String, required: true } }], // Update here
    lecturerID: { type: String, ref: 'Lecturer', required: true },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const TheoryExam = mongoose.model('TheoryExam', theoryExamSchema);

export default TheoryExam;
