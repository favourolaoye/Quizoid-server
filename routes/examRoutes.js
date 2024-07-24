const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createExam, getExamsByCourse, getExamById, updateExam, deleteExam, checkExam } = require('../controllers/examController');

// Create a new exam
router.post('/', auth, createExam);

// Get all exams by course code
router.get('/course/:courseCode', auth, getExamsByCourse);

// Get exam by ID
router.get('/:id', auth, getExamById);

// Update exam
router.put('/:id', auth, updateExam);

// Delete exam
router.delete('/:courseCode', auth, deleteExam);

// Check exam existence
router.get('/check/:courseCode', auth, checkExam);
// router.get('/check/:code', checkExam);

module.exports = router;
