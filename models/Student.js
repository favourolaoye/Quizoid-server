const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  matricNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  faceImage:[], 
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
