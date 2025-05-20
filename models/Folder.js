const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Ensure unique string IDs
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Associate folder with the user who created it
  },
  questionIds: [{
    type: Schema.Types.ObjectId,
    ref: 'BlogPost', // Reference to BlogPost model
  }],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Folder', FolderSchema);