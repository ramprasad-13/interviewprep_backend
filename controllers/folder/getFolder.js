const Folder = require('../../models/Folder');

const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id })
      .populate('questionIds')
      .sort({ createdAt: -1 });
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch folders', details: err.message });
  }
};

module.exports = getFolders;