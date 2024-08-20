const express = require('express');
const multer = require('multer');
const studentController = require('../controllers/studentController');
const router = express.Router();

// Multer configuration for handling multiple file uploads (max 10 files)
const storage = multer.diskStorage({
  destination: './uploads/faces/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Register a new student
router.post('/register', studentController.registerStudents);

// Login a student
router.post('/login', studentController.loginStudent);

// Generate one-time link for uploading face images for all students
router.post('/generate-link-all', studentController.generateLinksForAllStudents);

// Route to get a list of up to 6 students
router.get('/limited', studentController.getStudents);

// Route to get details of a specific student by ID
// router.get('/:id', studentController.getStudentDetails);

// Route for uploading face images for a specific student (multiple images allowed, max 10)
router.post('/upload-face', upload.array('faceImages', 10), studentController.uploadFaceImage);

module.exports = router;
