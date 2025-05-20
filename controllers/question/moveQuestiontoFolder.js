const BlogPost = require('../../models/Blogpost');

const moveQuestionToFolder = async (req, res) => {
  try {
    const { folderId } = req.body;
    const question = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, authorId: req.user.id },
      { folderId: folderId || null },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ error: 'Question not found or not authorized' });
    }

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Failed to move question', details: err.message });
  }
};

module.exports = moveQuestionToFolder;