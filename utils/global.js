import ObjectiveExam from '../models/ObjectiveModel.js';
import TheoryExam from '../models/TheoryModel.js';

const checkIfExamExist = async (courseCode) => {
    const objExam = await ObjectiveExam.findOne({ courseCode });
    if (objExam) {
        return true;
    }

    const theoryExam = await TheoryExam.findOne({ courseCode });
    return theoryExam ? true : false;
};

export default checkIfExamExist;
