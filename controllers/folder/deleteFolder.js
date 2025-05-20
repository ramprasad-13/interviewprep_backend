const Folder = require('../../models/Folder');
const BlogPost = require('../../models/Blogpost');

const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ id: req.params.id, userId: req.user.id });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found or not authorized' });
    }
    // Update questions to remove folderId
    await BlogPost.updateMany(
      { folderId: folder._id, authorId: req.user.id },
      { $set: { folderId: null } }
    );
    // Delete the folder
    await Folder.deleteOne({ id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete folder', details: err.message });
  }
};

module.exports = deleteFolder;