const BlogPost = require('../../models/Blogpost');

const deleteQuestion = async (req, res) => {
  try {
    const question = await BlogPost.findOneAndDelete({
      _id: req.params.id,
      authorId: req.user.id,
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found or not authorized' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question', details: err.message });
  }
};

module.exports = deleteQuestion;