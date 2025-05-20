const BlogPost = require('../../models/Blogpost');

const updateQuestion = async (req, res) => {
  try {
    const { title, question, solution, category, difficulty, author, folderId, publishedDate, private } = req.body;

    if (!title || !question || !solution || !category || !difficulty || !author || !publishedDate) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const updatedQuestion = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, authorId: req.user.id },
      {
        title,
        question,
        solution,
        category,
        difficulty,
        author,
        folderId: folderId || null,
        publishedDate,
        private: private || false,
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found or not authorized' });
    }

    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update question', details: err.message });
  }
};

module.exports = updateQuestion;