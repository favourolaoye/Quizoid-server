import express from 'express';
import { uploadCourses, getCoursesForStudent } from '../controllers/courseController.js';

const router = express.Router();

// Admin: Upload Courses via CSV
router.post('/upload', uploadCourses);

// Student: Get Courses by Department and Level
router.get('/:studentId', getCoursesForStudent);

export default router;
