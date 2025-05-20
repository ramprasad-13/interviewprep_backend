const BlogPost = require('../../models/Blogpost');

const addQuestion = async (req, res) => {
  try {
    const { title, question, solution, category, difficulty, author, folderId, publishedDate, private } = req.body;

    if (!title || !question || !solution || !category || !difficulty || !author || !publishedDate) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const newQuestion = new BlogPost({
      title,
      question,
      solution,
      category,
      difficulty,
      author,
      authorId: req.user.id,
      folderId: folderId || null,
      publishedDate,
      private: private || false,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add question', details: err.message });
  }
};

module.exports = addQuestion;