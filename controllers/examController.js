import ObjectiveExam from '../models/ObjectiveModel.js';
import TheoryExam from '../models/TheoryModel.js';
import checkIfExamExist from '../utils/global.js';
import ExamSubmission from '../models/objectiveResult.js';

export const createExam = async (req, res) => {
  // Extract fields from the request body
  const { courseCode, instruction, type, questions, lecturerID, duration } = req.body;
  console.log(courseCode);

  // Determine which model to use based on the exam type
  const ExamModel = type === 'multichoice' ? ObjectiveExam : TheoryExam;

  try {
    // Check if an exam already exists for the given course code
    const exists = await ExamModel.findOne({ courseCode });
    if (exists) {
      return res.status(400).json({ message: 'Exam already exists for this course' });
    }

    // Create a new exam instance using the appropriate model
    const newExam = new ExamModel({
      courseCode,
      instruction,
      type,
      status: false,
      questions,
      lecturerID,
      duration,
    });

    // Save the new exam to the database
    await newExam.save();
    res.status(201).json({ message: 'Exam created successfully', exam: newExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Handle objective exam submission
export const submitObjectiveExam = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const { answers, matricNo, department, score } = req.body;

    const submission = new ExamSubmission({
      courseCode,
      matricNo,
      department,
      type: 'multichoice',
      score,
      answers,
    });

    await submission.save();
    res.status(200).json({ message: 'Objective exam submitted successfully' });
  } catch (error) {
    console.error('Error submitting objective exam:', error);
    res.status(500).json({ message: 'Failed to submit objective exam' });
  }
};

// Handle theory exam submission
export const submitTheoryExam = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const { answers, matricNo, department, questions } = req.body;

    const submission = new ExamSubmission({
      courseCode,
      matricNo,
      department,
      type: 'theory',
      answers,
      questions,
    });

    await submission.save();
    res.status(200).json({ message: 'Theory exam submitted successfully' });
  } catch (error) {
    console.error('Error submitting theory exam:', error);
    res.status(500).json({ message: 'Failed to submit theory exam' });
  }
};



export const getExamsByCourse = async (req, res) => {
  const { courseCode } = req.params;

  try {
    const exams = await ObjectiveExam.find({ courseCode });
    res.status(200).json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//
export const getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await ObjectiveExam.findById(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//
export const updateExam = async (req, res) => {
  const { id } = req.params;
  const { title, questions } = req.body;

  try {
    const updatedExam = await ObjectiveExam.findByIdAndUpdate(id, { title, questions }, { new: true });
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json({ message: 'Exam updated successfully', exam: updatedExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


export const checkExam = async (req, res) => {
  const { courseCode } = req.params;

  try {
    const examExists = await checkIfExamExist(courseCode);
    if (examExists) {
      res.status(200).json({ message: 'Exam already exists for this course' });
    } else {
      return res.status(404).json({ message: 'Exam not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//get exam details
export const getExamDetails = async (req, res) => {
  try {
    const { courseCode } = req.params;
    console.log(courseCode);

    // Check for Objective exam
    const objectiveExam = await ObjectiveExam.findOne({ courseCode });
    if (objectiveExam) {
      // Modify the response to include score for each question
      const questionsWithScores = objectiveExam.questions.map((question) => ({
        question: question.question,
        options: question.options,
        correctOption: question.correctOption,
        score: question.score, 
      }));

      return res.status(200).json({
        status: objectiveExam.status,
        lecturerID: objectiveExam.lecturerID,
        type: 'multichoice',
        instruction: objectiveExam.instruction,
        questions: questionsWithScores, // Use modified questions array
        duration: objectiveExam.duration,
      });
    }


    // Check for Theory exam
    const theoryExam = await TheoryExam.findOne({ courseCode });
    if (theoryExam) {
      return res.status(200).json({
        status: theoryExam.status,
        type: 'theory',
        instruction: theoryExam.instruction,
        lecturerID: theoryExam.lecturerID,
        questions: theoryExam.questions,
        duration: theoryExam.duration
      });
    }

    // If neither found, return status as false
    return res.status(200).json({
      status: false,
      message: 'Exam not found',
    });
  } catch (error) {
    console.error('Error fetching exam details:', error);
    res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};


//delete exam(admin)
export const deleteExamByCourseCode = async (req, res) => {
  const { courseCode } = req.params;

  try {
    // Attempt to find and delete the exam in both models
    const objectiveExam = await ObjectiveExam.findOneAndDelete({ courseCode });
    const theoryExam = await TheoryExam.findOneAndDelete({ courseCode });

    if (!objectiveExam && !theoryExam) {
      return res.status(404).json({ message: 'Exam not found for this course' });
    }

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
//controller to find course with exam data
export const getCoursesWithExams = async (req, res) => {
  try {
    // Fetch all courses with exams from both schemas
    const objectiveExams = await ObjectiveExam.find({});
    const theoryExams = await TheoryExam.find({});

    // Extract unique course codes from both types of exams
    const courseCodesWithExams = new Set([
      ...objectiveExams.map(exam => exam.courseCode),
      ...theoryExams.map(exam => exam.courseCode)
    ]);

    // Convert Set to an array for response
    res.status(200).json(Array.from(courseCodesWithExams));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//controller to update the status of the exam
export const updateExamStatus = async (req, res) => {
  const { courseCode } = req.params;

  try {
    // Find the exam by course code in both schemas
    const objectiveExam = await ObjectiveExam.findOne({ courseCode });
    const theoryExam = await TheoryExam.findOne({ courseCode });

    let updatedExam;

    // Update the exam status if found
    if (objectiveExam) {
      objectiveExam.status = true;
      updatedExam = await objectiveExam.save();
    } else if (theoryExam) {
      theoryExam.status = true;
      updatedExam = await theoryExam.save();
    } else {
      return res.status(404).json({ message: 'Exam not found for the given course code' });
    }

    res.status(200).json({ message: 'Exam status updated successfully', exam: updatedExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//get exam status
// Example backend endpoint for fetching exam initialization status
export const getExamStatus = async (req, res) => {
  const { courseCode } = req.params;

  try {
    // Fetch the exam status from both ObjectiveExam and TheoryExam schemas
    const objectiveExam = await ObjectiveExam.findOne({ courseCode });
    const theoryExam = await TheoryExam.findOne({ courseCode });

    if (!objectiveExam && !theoryExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const exam = objectiveExam || theoryExam;
    const response = {
      initialized: exam.status, // true if initialized
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
