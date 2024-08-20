const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  correctOption: { type: String },
});

const ObjectiveSchema = new Schema({
  courseCode: { type: String, required: true },
  instruction: { type: String, required: true },
  type: { type: String, required: true, enum: ['theory', 'multichoice'] },
  questions: [questionSchema],
  lecturerID: { type: String, ref: 'Lecturer', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Objective = mongoose.model('Objective', ObjectiveSchema);
module.exports = Objective;
