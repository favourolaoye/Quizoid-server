import express from 'express';
import auth from '../middleware/auth.js';
import { createExam, getExamsByCourse, submitTheoryExam, getCoursesWithExams, deleteExamByCourseCode, updateExamStatus, updateExam, submitObjectiveExam, checkExam, getExamDetails, getExamStatus } from '../controllers/examController.js';

const router = express.Router();

// Create a new exam
router.post('/', auth, createExam);

// Get all exams by course code
router.get('/course/:courseCode', auth, getExamsByCourse);

// Get exam by ID
// router.get('/:id', auth, getExamById);

// Update exam
router.put('/:id', auth, updateExam);

// Route to get courses with existing exams
router.get('/courses-with-exams', getCoursesWithExams);

// Route to update exam status
router.patch('/update-exam-status/:courseCode', updateExamStatus)


// Check exam existence
router.get('/check/:courseCode', auth, checkExam);

//fetch exam details
router.get('/:courseCode', getExamDetails);

// Route to delete an exam by course code
router.delete('/delete-exam/:courseCode', deleteExamByCourseCode);

//submit exam
router.post('/:courseCode/submit-objective', submitObjectiveExam);

router.get('/exam-status/:courseCode', getExamStatus);

// Route for submitting theory exams
router.post('/:courseCode/submit-theory', submitTheoryExam);

export default router;
