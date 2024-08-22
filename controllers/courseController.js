import Course from '../models/Course.js';
import Student from '../models/Student.js';

export const uploadCourses = async (req, res) => {
  try {
    const courses = req.body.courses;

    if (!courses || courses.length === 0) {
      return res.status(400).send('No courses data provided.');
    }

    await Course.insertMany(courses);
    res.status(200).send('Courses uploaded successfully');
  } catch (error) {
    console.error('Error uploading courses:', error);
    res.status(500).send('Error uploading courses: ' + error.message);
  }
};

// Fetch courses for student
export const getCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).send('Student not found');
    }

    const courses = await Course.find({
      department: student.department,
      level: student.level,
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Error fetching courses: ' + error.message);
  }
};
