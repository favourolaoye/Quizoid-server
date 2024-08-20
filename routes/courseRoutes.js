const express = require('express');
const courseController = require('../controllers/courseController');
const router = express.Router();

// Admin: Upload Courses via CSV
router.post('/upload', courseController.uploadCourses);

// Student: Get Courses by Department and Level
router.get('/:studentId', courseController.getCoursesForStudent);

module.exports = router;
