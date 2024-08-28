// routes/examRoutes.js
import express from 'express';
import { submitObjectiveExam, submitTheoryExam,getResultsByCourseCode, getCoursesByLecturer } from '../controllers/resultControllers.js';

const router = express.Router();

// Route for submitting objective exam
router.post('/submit-objective', submitObjectiveExam);

// Route for submitting theory exam
router.post('/submit-theory', submitTheoryExam);

router.get('/result/:courseCode', getResultsByCourseCode);
router.get('/:lecturerID', getCoursesByLecturer);






export default router;
