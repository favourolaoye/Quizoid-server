import express from 'express';
import { getStudentAnswersByLecturer, downloadStudentAnswersPDF } from '../controllers/resultControllers.js';

const router = express.Router();

// Route to fetch student answers by lecturerID
router.get('/getStudentAnswers', getStudentAnswersByLecturer);

// Route to generate and download PDF for a student's answers
router.get('/downloadStudentAnswers', downloadStudentAnswersPDF);

export default router;
