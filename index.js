import express from 'express';
import connectDB from './db/db.js'; // Ensure the db file uses .js extension
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';

// Import routes using ES modules
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import lecturerRoutes from './routes/lecturerRoutes.js';
import examRoutes from './routes/examRoutes.js';
import theoryRoutes from './routes/TheoryRoutes.js';

// Initialize Express app
const app = express();

// Database Connection
connectDB();

// Middleware Initialization
app.use(express.json());
app.use(helmet());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cors());
app.use(fileUpload());

// Define Routes
app.use('/api/admin', adminRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/mcq', examRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
