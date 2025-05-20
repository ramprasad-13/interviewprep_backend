const express = require('express');
const router = express.Router();

// POST /api/folders
const addFolder = require('../controllers/folder/addFolder');
router.post('/folders', addFolder);

// GET /api/folders
const getFolder = require('../controllers/folder/getFolder.js');
router.get('/folders',getFolder );

// GET /api/folder by id
const getFolderById = require('../controllers/folder/getByFolderById.js');
router.get('/folders/:id', getFolderById);

// DELETE /api/folders/:id
const deleteFolder = require('../controllers/folder/deleteFolder.js')
router.delete('/folders/:id', deleteFolder);


module.exports = router;