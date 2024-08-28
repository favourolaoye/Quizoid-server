import mongoose from 'mongoose';

const TheoryResultSchema = new mongoose.Schema({
  matricNo: { type: String, required: true },
  courseCode: { type: String, required: true },
  answers: { type: Map, of: String, required: true },
  lecturerID: {type: String, required: true} 
});

export default mongoose.model('TheoryResult', TheoryResultSchema);