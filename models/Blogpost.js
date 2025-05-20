const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  question: { type: String, required: true },
  solution: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  publishedDate: { type: String, required: true },
  private: { type: Boolean, default: false }, // New field for private/public
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);