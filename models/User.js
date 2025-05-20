const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /\S+@\S+\.\S+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  otp: {
    code: { type: String },
    expiresAt: { type: Date }
  },
  resetPassword: {
  otp: { type: String },
  expiresAt: { type: Date }
},

}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
