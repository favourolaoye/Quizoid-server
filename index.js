const express = require('express');
const connectDB = require('./db/db');
const cors = require('cors');
const path = require("path");
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const app = express();
const studentRoutes = require("./routes/studentRoutes");

// Database Connection
connectDB();

// Middleware Initialization
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cors());


// Define Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/lecturer', require('./routes/lecturerRoutes'));
app.use('/api/students', studentRoutes);
app.use('/api/mcq', require('./routes/examRoutes')); 
app.use('/api/theory', require('./routes/TheoryRoutes'));
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
