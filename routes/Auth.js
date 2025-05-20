const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendOTPEmail = require('../utils/sendOTP');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

// Request OTP
router.post('/auth/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { otp, expiresAt } = await sendOTPEmail(email);

    user.otp = { code: otp, expiresAt };
    await user.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error in /request-otp:', err.message);
    res.status(500).json({ error: 'Failed to send OTP', details: err.message });
  }
});

// Verify OTP
router.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user || !user.otp || user.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Error in /verify-otp:', err.message);
    res.status(500).json({ error: 'OTP verification failed', details: err.message });
  }
});

// Signup
router.post('/auth/signup', async (req, res) => {
  try {
    const { fullName, gender, age, mobileNumber, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign(
      { fullName, gender, age, mobileNumber, email, hashedPassword },
      process.env.JWT_SECRET,
      { expiresIn: '30m' } // Increased to 30 minutes
    );

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendVerificationEmail(email, verificationLink, fullName);

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (err) {
    console.error('Error in /signup:', err.message);
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

// Verify Email
router.get('/auth/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) return res.status(400).json({ error: 'Verification token is required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { fullName, gender, age, mobileNumber, email, hashedPassword } = decoded;

    if (!email || !hashedPassword) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already verified and exists' });
    }

    const newUser = new User({
      fullName,
      gender,
      age,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(`User verified: ${email}`);

    res.status(201).json({ message: 'Email verified and user registered successfully' });
  } catch (err) {
    console.error('Error in /verify-email:', err.message);
    res.status(400).json({ error: 'Invalid or expired verification link', details: err.message });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error in /login:', err.message);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Send reset OTP
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { otp, expiresAt } = await sendOTPEmail(email);
    user.resetPassword = { otp, expiresAt };
    await user.save();

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error in /forgot-password:', err.message);
    res.status(500).json({ error: 'Failed to send reset OTP', details: err.message });
  }
});

// Reset password with OTP
router.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetPassword || user.resetPassword.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.resetPassword.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPassword = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error in /reset-password:', err.message);
    res.status(500).json({ error: 'Password reset failed', details: err.message });
  }
});

// Get User Profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -resetPassword');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error in /profile:', err.message);
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});

module.exports = router;
