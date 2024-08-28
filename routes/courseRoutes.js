import express from 'express';
import { getCoursesByDeptAndLevel, enrollStudentInCourse, uploadCourses,getEnrolledCourses } from '../controllers/courseController.js';

const router = express.Router();

// Route to fetch courses based on department and level
router.get('/courses', getCoursesByDeptAndLevel);

router.post('/upload', uploadCourses);

// Route to enroll in a course
router.post('/enroll', enrollStudentInCourse)

//fetch ennrolled courses
router.get('/:studentId/enrolled-courses', getEnrolledCourses);

export default router;
