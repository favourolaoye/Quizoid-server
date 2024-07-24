// models/lecturer.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

const lecturerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lecturerID: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  courses: [courseSchema]
});

const Lecturer = mongoose.model('Lecturer', lecturerSchema);
module.exports = Lecturer;
