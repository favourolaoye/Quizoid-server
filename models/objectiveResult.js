import mongoose from 'mongoose';

const ObjectiveResultSchema = new mongoose.Schema({
  matricNo: { type: String, required: true },
  courseCode: { type: String, required: true },
  totalMark: { type: Number, required: true },
  lecturerID: {type: String, required: true}
});

export default mongoose.model('ObjectiveResult', ObjectiveResultSchema);