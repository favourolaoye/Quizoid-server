const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck'); // the middleware that checks for admin role
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

// router.post('/register', auth, adminCheck, registerAdmin);
router.post('/register', registerAdmin);

router.post('/login', loginAdmin);

module.exports = router;
