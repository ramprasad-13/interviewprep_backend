const express = require('express');
const router = express.Router();

const getAllQuestions = require('../controllers/withoutAuth/getAllQuestionswithoutAuth');
// Import the new controller
const getPublicQuestionById = require('../controllers/withoutAuth/getPublicQuestionById');

router.get('/questions', getAllQuestions);

// Add this new route for fetching a single public question
router.get('/questions/:id', getPublicQuestionById);

module.exports = router;