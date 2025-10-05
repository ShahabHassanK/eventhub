// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['attendee', 'organizer', 'admin'], default: 'attendee' },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// Hash password before save (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain text password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset token (plain token returned; hashed stored)
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash it and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token expiry (1 hour)
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
