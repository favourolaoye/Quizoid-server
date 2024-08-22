import express from 'express';
// import auth from '../middleware/auth.js';
// import adminCheck from '../middleware/adminCheck'; 
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Uncomment this line if you want to apply both auth and adminCheck middleware for registration
// router.post('/register', auth, adminCheck, registerAdmin);

router.post('/register', registerAdmin);

router.post('/login', loginAdmin);

export default router;
