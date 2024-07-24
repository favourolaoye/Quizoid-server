// controllers/lecturerController.js
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const Lecturer = require('../models/Lecturer');
const secret = process.env.SECRET_ID;

const addLecturer = async (req, res) => {
  const { name, lecturerID, password, department, courses } = req.body;

  try {
    const existingLecturer = await Lecturer.findOne({ lecturerID });
    if (existingLecturer) {
      return res.status(400).json({ message: 'Lecturer ID already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newLecturer = new Lecturer({
      name,
      lecturerID,
      password: hashedPassword,
      department,
      courses
    });

    await newLecturer.save();

    res.status(201).json({ message: 'Lecturer added successfully', lecturer: newLecturer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const loginLecturer = async (req, res) => {
  const { lecturerID, password } = req.body;

  try {
    const lecturer = await Lecturer.findOne({ lecturerID });

    if (!lecturer) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, lecturer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // if( password !== lecturer.password ){
    //   return res.status(400).json({ message: 'Invalid Password' });
    // }

    const payload = {
      id: lecturer._id,
      name: lecturer.name,
      role: 'lecturer',
      details: {
        lecturerID: lecturer.lecturerID,
        department: lecturer.department,
        courses: lecturer.courses
      }
    };

    jwt.sign(
      payload,
      secret,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { addLecturer, loginLecturer };
