import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  code: { type: String, required: true },
  units: { type: Number, required: true }
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
