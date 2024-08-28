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



// Fetch courses based on department and level
export const getCoursesByDeptAndLevel = async (req, res) => {
  try {
    const { department, level } = req.query; 
    console.log(department);
    // Query the Course model to find courses that match the department and level
    const courses = await Course.find({ department, level });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Enroll a student in a course
export const enrollStudentInCourse = async (req, res) => {
  try {
    const { courseCode, studentId } = req.body;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the course exists
    const course = await Course.findOne({ code: courseCode });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the student is already enrolled in the course by courseCode
    if (student.enrolledCourses.some(enrolledCourse => enrolledCourse.courseCode === courseCode)) {
      return res.status(400).json({ message: "Student is already enrolled in this course." });
    }

    // Push the courseCode to the enrolledCourses array
    student.enrolledCourses.push({ courseCode });

    // Save the updated student document
    await student.save();

    res.status(200).json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//fetch enrolled courses
export const getEnrolledCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get the enrolled courses
    const enrolledCourses = await Course.find({
      code: { $in: student.enrolledCourses.map(course => course.courseCode) }
    });

    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
