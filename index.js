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
import resultRoutes from './routes/resultRoutes.js';
import theResultRoutes from './routes/theoryResultRoutes.js'
// import theoryRoutes from './routes/TheoryRoutes.js';

// Initialize Express app
const app = express();

// Database Connection
connectDB();

// Middleware Initialization

// Increase the limit for JSON and URL-encoded payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(helmet());
app.use(cors());

// Set file upload limits if needed
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Define Routes
app.use('/api/admin', adminRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/mcq', examRoutes);
app.use('/api/info', courseRoutes);
app.use('/api/submit', resultRoutes);  
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/answers', theResultRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
