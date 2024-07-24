// models/Exam.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  correctOption: { type: String },
});

// const objQuestionSchema = new Schema({
//   question: { type: String, required: true },
//   options: [String],
//   correctOption: { type: String },
// });

// const thrQuestionSchema = new Schema({
//   question: { type: String, required: true },
//   options: [String],
//   correctOption: { type: String },
// });

const examSchema = new Schema({
  courseCode: { type: String, required: true },
  instruction: { type: String, required: true },
  type: { type: String, required: true, enum: ['theory', 'multichoice'] },
  questions: [questionSchema],
  lecturerID: { type: String, ref: 'Lecturer', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
