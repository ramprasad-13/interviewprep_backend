const BlogPost = require('../../models/Blogpost');

const getAllQuestionswithoutAuth = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const query = req.query.query || '';
    const skip = (page - 1) * limit;

    const searchQuery = {
      private: false, // Only public questions
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { question: { $regex: query, $options: 'i' } },
      ],
    };

    const questions = await BlogPost.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await BlogPost.countDocuments(searchQuery);
    res.status(200).json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public questions', details: err.message });
  }
};

module.exports = getAllQuestionswithoutAuth;