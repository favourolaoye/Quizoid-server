import express from 'express';
import { enrollCourses } from '../controllers/enrollmentController.js';

const router = express.Router();

// Student: Enroll in Courses
router.post('/enroll', enrollCourses);

export default router;
