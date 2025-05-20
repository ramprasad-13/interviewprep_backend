const Folder = require('../../models/Folder');
const { v4: uuidv4 } = require('uuid');

const addFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Folder name is required' });
    }
    const newFolder = new Folder({
      id: uuidv4(), // Generate unique string ID
      name,
      userId: req.user.id, // Associate with the authenticated user
      questionIds: [],
    });
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create folder', details: err.message });
  }
};

module.exports = addFolder;