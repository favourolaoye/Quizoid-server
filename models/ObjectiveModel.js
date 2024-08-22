import mongoose from 'mongoose';
const { Schema } = mongoose;

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
  lecturerID: { type: String, required: true }, // Change to String
  createdAt: { type: Date, default: Date.now }
});

const Objective = mongoose.model('Objective', ObjectiveSchema);

export default Objective;
