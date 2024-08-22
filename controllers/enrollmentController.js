import Enrollment from '../models/Enrollment.js';

// Enroll Student in Courses
export const enrollCourses = async (req, res) => {
  try {
    const { studentId, selectedCourses } = req.body;
    const enrollments = selectedCourses.map(courseId => ({
      studentId,
      courseId,
    }));
    await Enrollment.insertMany(enrollments);
    res.status(200).send('Courses enrolled successfully');
  } catch (error) {
    res.status(500).send('Error enrolling courses: ' + error.message);
  }
};
