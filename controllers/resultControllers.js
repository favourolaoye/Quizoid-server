
import ObjectiveResult from '../models/objectiveResult.js';
import TheoryResult from '../models/theoryResult.js';
import PDFDocument from 'pdfkit';

// Submit Objective Exam
export const submitObjectiveExam = async (req, res) => {
  try {
    const { matricNo, courseCode, totalMark, lecturerID } = req.body;
    console.log({matricNo, courseCode, totalMark});
    // Create or update the objective exam result record
    const result = new ObjectiveResult({ matricNo, courseCode, totalMark, lecturerID });
    await result.save();

    res.status(200).json({ success: true, message: 'Objective exam submitted successfully' });
  } catch (error) {
    console.error('Error submitting objective exam:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

//get course data
export const getCoursesByLecturer = async (req, res) => {
    try {
      const { lecturerID } = req.params;
      const results = await ObjectiveResult.aggregate([
        { $match: { lecturerID } },
        { $group: {
          _id: "$courseCode",
          totalStudents: { $sum: 1 }
        }},
        { $project: {
          _id: 0,
          courseCode: "$_id",
          students: "$totalStudents"
        }}
      ]);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courses' });
    }
  };

// Submit Theory Exam
export const submitTheoryExam = async (req, res) => {
  try {
    const { matricNo,lecturerID, courseCode, answers } = req.body;

    // Create or update the theory exam result record
    const result = new TheoryResult({ matricNo, courseCode, answers, lecturerID });
    await result.save();

    res.status(200).json({ success: true, message: 'Theory exam submitted successfully' });
  } catch (error) {
    console.error('Error submitting theory exam:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

//show pdf result
// controllers/resultController.js


export const getResultsByCourseCode = async (req, res) => {
    
    try {
        let { courseCode } = req.params;
        console.log('Received courseCode:', courseCode); // Log the received courseCode
        courseCode = decodeURIComponent(courseCode); // Decode the course code
        console.log('Decoded courseCode:', courseCode); // Log the decoded courseCode
        const results = await ObjectiveResult.find({ courseCode }).select('matricNo totalMark');
        console.log('Query results:', results); // Log the results
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results' });
    }
};

//theory answer controller
export const getStudentAnswersByLecturer = async (req, res) => {
    const { lecturerID } = req.query;
  
    if (!lecturerID) {
      return res.status(400).json({ error: 'Lecturer ID is required' });
    }
  
    try {
      const results = await TheoryResult.find({ lecturerID }).select('matricNo answers');
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  };
  
  // Controller to generate PDF for a student's answers
  export const downloadStudentAnswersPDF = async (req, res) => {
    const { matricNo } = req.query;
  
    if (!matricNo) {
      return res.status(400).json({ error: 'Matric number is required' });
    }
  
    try {
      const studentResult = await TheoryResult.findOne({ matricNo });
  
      if (!studentResult) {
        return res.status(404).json({ error: 'Student result not found' });
      }
  
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${matricNo}_answers.pdf`);
  
      doc.text(`Matric Number: ${studentResult.matricNo}`);
      doc.text(`Course Code: ${studentResult.courseCode}`);
      doc.text('Answers:');
  
      studentResult.answers.forEach((answer, question) => {
        doc.text(`${question}: ${answer}`);
      });
  
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  };

