// server
const express = require('express');
const connectDB = require('./db/db');
const cors = require('cors');

const app = express();

// Database Connection
connectDB();

// Middleware Initialization
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/lecturer', require('./routes/lecturerRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/exam', require('./routes/examRoutes')); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
