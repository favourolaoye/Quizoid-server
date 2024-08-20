const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require("multer");
const Student = require('../models/Student');
const mongoose = require('mongoose');
const path = require('path')
const secret = "6c8b0f32-9d45-4f77-a19b-9e35a96bca8a";

// Register a new student
const registerStudents = async (req, res) => {
  const students = req.body;

  // Check if students is an array
  if (!Array.isArray(students)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  const errors = [];
  const successfulRegistrations = [];

  for (const student of students) {
    const { name, matricNo, level, department, password, email } = student;

    // Validate incoming data
    if (!name || !matricNo || !level || !department || !password || !email) {
      errors.push({ matricNo, message: 'All fields are required' });
      continue;
    }

    try {
      const existingStudent = await Student.findOne({ matricNo });
      if (existingStudent) {
        errors.push({ matricNo, message: 'Student already exists' });
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newStudent = new Student({
        name,
        matricNo,
        level,
        department,
        password: hashedPassword,
        email,
      });

      await newStudent.save();
      successfulRegistrations.push(newStudent);

    } catch (error) {
      console.error(error);
      errors.push({ matricNo, message: 'Server error', error });
    }
  }

  if (errors.length > 0) {
    return res.status(207).json({
      message: 'Some students could not be registered',
      errors,
      successfulRegistrations,
    });
  }

  res.status(201).json({
    message: 'All students added successfully',
    students: successfulRegistrations,
  });
};


// Login a student
const loginStudent = async (req, res) => {
  const { matricNo, password } = req.body;

  try {
    const student = await Student.findOne({ matricNo });

    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: student._id,
        name: student.name,
        role: 'student',
        details: {
          matricNo: student.matricNo,
          level: student.level,
          department: student.department,
        },
      },
    };

    jwt.sign(
      payload,
      secret,
      { expiresIn: '1h' },
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

// Generate one-time link for uploading face image
const generateLinksForAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nacoospdf@gmail.com',
        pass: 'cwzz lwee rqrs xuzj',
      },
    });

    for (const student of students) {
      const token = jwt.sign({ id: student._id }, secret, { expiresIn: '1h' });
      const link = `http://localhost:8004/upload-face?token=${token}`;

      const mailOptions = {
        from: 'nacoospdf@gmail.com',
        to: student.email,
        subject: 'Upload Your Face Image',
        text: `Click the link to upload your face image: ${link}`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Links sent to all students successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Function to get a list of up to 6 students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().limit(6); // Fetch 6 students from the database
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//face uploading
const storage = multer.diskStorage({
  destination: './uploads/faces/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Multer configuration
const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // Limit to 1 MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Controller function
const uploadFaceImage = async (req, res) => {
  jwt.verify(req.query.token, secret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    try {
      const student = await Student.findById(decoded.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Use the correct field name here
      upload.array('faceImages', 10)(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'File upload failed', error: err.message });
        }

        student.faceImage.push(...req.files.map(file => file.filename));
        await student.save();

        res.json({ message: 'Face image uploaded successfully' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};
module.exports = { registerStudents, loginStudent,uploadFaceImage, generateLinksForAllStudents,getStudents };
