const Exam  = require('../models/TheoryModel');
const checkIfExamExist = require('../utils/global');



const createExam = async (req, res) => {
  const { courseCode, instruction, type, questions, lecturerID } = req.body;
  
  try {
    const exists = await Exam.findOne({ courseCode });
    if (exists) {
      return res.status(400).json({ message: 'Exam already exists for this course' });
    }

    const newExam = new Exam({
      courseCode,
      instruction,
      type,
      questions,
      lecturerID
    });

    await newExam.save();
    res.status(201).json({ message: 'Exam created successfully', exam: newExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getExamsByCourse = async (req, res) => {
  const { courseCode } = req.params;
  
  try {
    const exams = await Exam.find({ courseCode });
    res.status(200).json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateExam = async (req, res) => {
  const { id } = req.params;
  const { title, questions } = req.body;

  try {
    const updatedExam = await Exam.findByIdAndUpdate(id, { title, questions }, { new: true });
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json({ message: 'Exam updated successfully', exam: updatedExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const deleteExam = async (req, res) => {
  const { courseCode } = req.params;
  
  try {
    const exam = await Exam.findOne({ courseCode });
    if (exam) {
      await Exam.deleteOne();  
      res.status(200).json({ message: 'Exam deleted successfully' });
    }else{
      return res.status(404).json({ message: 'Exam not found' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const checkExam = async (req, res) => {
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



module.exports = { createExam, getExamsByCourse, getExamById, updateExam, deleteExam, checkExam };
