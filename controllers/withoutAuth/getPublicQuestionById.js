const BlogPost = require('../../models/Blogpost');

const getPublicQuestionById = async (req, res) => {
  try {
    const question = await BlogPost.findOne({ 
      _id: req.params.id, 
      private: false // Ensure the question is public
    });

    if (!question) {
      return res.status(404).json({ error: 'Public question not found' });
    }
    
    // It's good practice to not send the author's ID in a public request
    const { authorId, ...publicQuestionData } = question.toObject();
    
    res.status(200).json(publicQuestionData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public question', details: err.message });
  }
};

module.exports = getPublicQuestionById;