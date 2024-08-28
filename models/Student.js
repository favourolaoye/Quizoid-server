import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  matricNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  enrolledCourses: [
    {
      courseCode: { type: String, required: true } 
    }
  ],
  trainedModel: {
    type: [[Number]], 
    default: []
  }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
