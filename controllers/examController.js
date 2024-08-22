import ObjectiveExam from '../models/ObjectiveModel.js';
// import TheoryExam from '../models/TheoryModel.js';
import checkIfExamExist from '../utils/global.js';

export const createExam = async (req, res) => {
  const { courseCode, instruction, type, questions, lecturerID } = req.body;

  try {
    const exists = await ObjectiveExam.findOne({ courseCode });
    if (exists) {
      return res.status(400).json({ message: 'Exam already exists for this course' });
    }

    const newExam = new ObjectiveExam({
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

export const deleteExam = async (req, res) => {
  const { courseCode } = req.params;

  try {
    const exam = await ObjectiveExam.findOne({ courseCode });
    if (exam) {
      await ObjectiveExam.deleteOne({ courseCode });
      res.status(200).json({ message: 'Exam deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Exam not found' });
    }
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
