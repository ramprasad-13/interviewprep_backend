const BlogPost = require('../../models/Blogpost');

const getAllQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 12, query = '' } = req.query;
    const searchCriteria = {
      authorId: req.user.id, // Filter by the authenticated user's ID
      $or: [
        { title: new RegExp(query, 'i') },
        { question: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') },
      ],
    };

    const questions = await BlogPost.find(searchCriteria)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await BlogPost.countDocuments(searchCriteria);

    res.status(200).json({
      questions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit), // Added for frontend pagination
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
  }
};

module.exports = getAllQuestions;