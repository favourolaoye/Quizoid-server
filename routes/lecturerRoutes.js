import express from 'express';
import auth from '../middleware/auth.js';
// import adminCheck from '../middleware/adminCheck.js'; 
import { addLecturer, loginLecturer } from '../controllers/lecturerController.js';

const router = express.Router();

// Only admins can add lecturers
router.post('/add', addLecturer);

// Any lecturer can log in through this route
router.post('/login', loginLecturer);

export default router;
