const express = require('express');
const router = express.Router();

// GET /api/questions/:id
const getQuestion = require('../controllers/question/getQuestion');
router.get('/questions/:id', getQuestion);

// GET /api/questions
const getAllQuestions = require('../controllers/question/getAllQuestions');
router.get('/questions', getAllQuestions);

// POST /api/questions
const addQuestion = require('../controllers/question/addQuestion');
router.post('/questions', addQuestion);

// PUT /api/questions/:id
const updateQuestion = require('../controllers/question/updateQuestion');
router.put('/questions/:id', updateQuestion);

// PATCH /api/questions/:id/move
const moveQuestionToFolder = require('../controllers/question/moveQuestiontoFolder');
router.patch('/questions/:id/move', moveQuestionToFolder);

// DELETE /api/questions/:id
const deleteQuestion = require('../controllers/question/deleteQuestion');
router.delete('/questions/:id', deleteQuestion);

module.exports = router;
