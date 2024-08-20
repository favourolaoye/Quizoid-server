const mongoose = require('mongoose');

const theoryExamSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
  },
  instruction: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'theory',
    required: true,
  },
  questions: {
    type: [String],
    required: true,
  },
  lecturerID: {
    type: String,
    ref: 'Lecturer', 
    required: true,
  },
}, {
  timestamps: true
});

const Theory = mongoose.model('Theory', theoryExamSchema);

module.exports = Theory;
