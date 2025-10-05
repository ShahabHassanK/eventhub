// backend/controllers/authController.js
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const createSendToken = (user, res) => {
  const payload = { id: user._id.toString(), role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

  // cookie maxAge - default to 1 day
  const maxAge = 24 * 60 * 60 * 1000;

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge
  });

  // remove password field from output
  user.password = undefined;

  res.json({
    success: true,
    token,
    user
  });
};

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    // optional: use express-validator in route to validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    createSendToken(user, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    createSendToken(user, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route GET /api/auth/logout
exports.logout = async (req, res) => {
  try {
    // Clear cookie if you’re storing token in cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    // req.user should be set by protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Please provide your email' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user found with that email' });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `You requested a password reset. Click the link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`;

    try {
      await sendEmail({ to: user.email, subject: 'Password reset for EventHub', text: message });
      res.json({ success: true, message: 'Email sent' });
    } catch (err) {
      // rollback on email failure
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error(err);
      res.status(500).json({ error: 'Email could not be sent' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Please provide a new password' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) return res.status(400).json({ error: 'Token is invalid or expired' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // auto-login after password reset
    createSendToken(user, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
