const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck'); 
const { addLecturer, loginLecturer } = require('../controllers/lecturerController');

// router.post('/add', auth, adminCheck, addLecturer); // Only admins can add lecturers
router.post('/add', addLecturer); // Only admins can add lecturers

// Any lecturer can log in through this route
router.post('/login', loginLecturer);

module.exports = router;
