const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const { registerStudent, loginStudent } = require('../controllers/studentController');

router.post('/add', auth, adminCheck, registerStudent);
router.post('/login', loginStudent); // Login route for students

module.exports = router;
