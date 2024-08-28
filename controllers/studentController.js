import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Student from '../models/Student.js';
import sharp from 'sharp';
import * as faceapi from 'face-api.js';
import { fileURLToPath } from 'url';
import canvas, { loadImage } from 'canvas';
import path from 'path';
// import fs from 'fs';

const secret = "6c8b0f32-9d45-4f77-a19b-9e35a96bca8a";

// const fetchBlob = async () => {
//   const { Blob } = await import('fetch-blob');
//   return Blob;
// };

// Register a new student
export const registerStudents = async (req, res) => {
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
export const loginStudent = async (req, res) => {
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
export const generateLinksForAllStudents = async (req, res) => {
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
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().limit(6); // Fetch 6 students from the database
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Upload face images
// Get the current file URL and derive __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Canvas for face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load the face-api.js models
const MODELS_PATH = path.join(__dirname, 'trainers');
await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);


// Function to upload face images
export const uploadFaceImage = async (req, res) => {
  jwt.verify(req.query.token, secret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    try {
      const student = await Student.findById(decoded.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded' });
      }

      const faceImages = req.files.faceImages;
      const faceImageArray = Array.isArray(faceImages) ? faceImages : [faceImages];

      const descriptors = [];

      for (const file of faceImageArray) {
        const imageBuffer = Buffer.from(file.data);

        const img = await sharp(imageBuffer)
          .resize({ width: 640, height: 480 }) // Resize if necessary
          .toBuffer();

        // Convert Buffer to Image
        const imgCanvas = await loadImage(img);
        const detection = await faceapi.detectSingleFace(imgCanvas)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const descriptorArray = Array.from(detection.descriptor);
          descriptors.push(descriptorArray);
        }
      }

      // Ensure the student's trainedModel is initialized as an array
      if (!Array.isArray(student.trainedModel)) {
        student.trainedModel = [];
      }

      // Add the new descriptors to the student's trained model
      student.trainedModel.push(...descriptors);
      await student.save();

      res.json({ message: 'Face image uploaded and trained model saved!' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

// Verify face
export const verifyFace = async (req, res) => {
  const { image } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Verify the JWT token to get student ID
    const decoded = jwt.verify(token, secret);
    const student = await Student.findById(decoded.user.id);

    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Convert the base64 image to a Buffer
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
    
    // Process the image
    const imgCanvas = await canvas.loadImage(imageBuffer);
    const detection = await faceapi.detectSingleFace(imgCanvas).withFaceLandmarks().withFaceDescriptor();
    
    if (!detection) return res.status(400).json({ message: 'No face detected' });

    // Convert stored descriptors to Float32Array
    const descriptors = student.trainedModel.map(desc => new Float32Array(desc));

    // Create a face matcher
    const faceMatcher = new faceapi.FaceMatcher(
      descriptors.map(desc => new faceapi.LabeledFaceDescriptors(student.matricNo, [desc]))
    );
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

    if (bestMatch.label === student.matricNo) {
      res.json({ success: true, message: 'Face verified successfully!' });
    } else {
      res.status(401).json({ success: false, message: 'Face verification failed!' });
    }
  } catch (err) {
    console.error('Face verification error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
