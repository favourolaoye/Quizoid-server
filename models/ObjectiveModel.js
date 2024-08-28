import mongoose from 'mongoose';
const { Schema } = mongoose;

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: [String],
  correctOption: { type: String, required: true },
  score: { type: Number, required: true }, 
});

const ObjectiveSchema = new Schema({
  courseCode: { type: String, required: true },
  instruction: { type: String, required: true },
  type: { type: String, required: true, enum: ['theory', 'multichoice'] },
  questions: [questionSchema],
  lecturerID: { type: String, required: true },
  status: { type: Boolean, required: true },
  duration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Objective = mongoose.model('Objective', ObjectiveSchema);

export default Objective;
