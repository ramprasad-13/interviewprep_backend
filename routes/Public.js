const express = require('express');
const router = express.Router();

const getAllQuestions = require('../controllers/withoutAuth/getAllQuestionswithoutAuth');
router.get('/questions', getAllQuestions);

module.exports = router;
