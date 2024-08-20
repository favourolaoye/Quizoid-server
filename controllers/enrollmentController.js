const Enrollment = require('../models/Enrollment');

// Enroll Student in Courses
exports.enrollCourses = async (req, res) => {
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
