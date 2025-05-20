const BlogPost = require('../../models/Blogpost');

const getQuestion = async (req, res) => {
  try {
    const question = await BlogPost.findOne({ id: req.params.id, authorId: req.user.id });
    if (!question) {
      return res.status(404).json({ error: 'Question not found or not authorized' });
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch question', details: err.message });
  }
};

module.exports = getQuestion;