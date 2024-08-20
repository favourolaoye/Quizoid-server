const ObjectiveExam = require('../models/ObjectiveModel');
const TheoryExam = require("../models/TheoryModel");


const checkIfExamExist = async (courseCode) => {
    const objExam = await ObjectiveExam.findOne({ courseCode });
    if (objExam) {
        return true
    }
    const theoryExam = await TheoryExam.findOne({ courseCode });
    if (theoryExam) {
        return true
    } else {
        return false
    }
}


module.exports = checkIfExamExist;