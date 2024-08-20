const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const router = express.Router();

// Student: Enroll in Courses
router.post('/enroll', enrollmentController.enrollCourses);

module.exports = router;
