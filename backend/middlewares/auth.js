// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Try cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2) Fallback to Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user info (id, role) to req
    req.user = { id: decoded.id, role: decoded.role };

    // Optionally fetch full user from DB
    // req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Not authorized' });
  }
};

// role check middleware: allow if user role matches or if admin
exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role === role || req.user.role === 'admin') return next();
  res.status(403).json({ error: 'Forbidden: insufficient permissions' });
};
