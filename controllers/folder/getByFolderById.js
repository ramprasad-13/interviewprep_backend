const Folder = require('../../models/Folder');

const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findOne({ id: req.params.id, userId: req.user.id }).populate('questionIds');
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found or not authorized' });
    }
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch folder', details: err.message });
  }
};

module.exports = getFolderById;