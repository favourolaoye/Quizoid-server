import express from 'express';
import auth from '../middleware/auth.js';
import { createExam, getExamsByCourse, getExamById, updateExam, deleteExam, checkExam } from '../controllers/theoryController.js';

const router = express.Router();

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

export default router;
