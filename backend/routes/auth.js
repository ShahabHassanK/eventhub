// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// registration validation example
router.post('/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  authController.register
);

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
