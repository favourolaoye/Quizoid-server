import express from 'express';
import * as studentController from '../controllers/studentController.js'; // Ensure controller file uses .js extension

const router = express.Router();

// Register a new student
router.post('/register', studentController.registerStudents);

// Login a student
router.post('/login', studentController.loginStudent);

// Generate one-time link for uploading face images for all students
router.post('/generate-link-all', studentController.generateLinksForAllStudents);

// Route to get a list of up to 6 students
router.get('/limited', studentController.getStudents);

// Verify face
router.post('/verify-face', studentController.verifyFace);

// Route for uploading face images for a specific student (multiple images allowed)
router.post('/upload-face', studentController.uploadFaceImage);

export default router;
