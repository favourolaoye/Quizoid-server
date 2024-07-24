const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const secret = process.env.SECRET_ID;

const registerStudent = async (req, res) => {
  const { name, matricNo, level, department, password } = req.body;

  try {
    const existingStudent = await Student.findOne({ matricNo });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = new Student({
      name,
      matricNo,
      level,
      department,
      password: hashedPassword,
    });

    await newStudent.save();

    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


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
        }
      },
    };

    jwt.sign(
      payload,
      secret,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user:payload });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { registerStudent, loginStudent };
