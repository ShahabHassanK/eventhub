// backend/routes/event.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const eventController = require('../controllers/eventController');

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (must be logged in)
router.post('/', protect, eventController.createEvent);
router.put('/:id', protect, eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);

module.exports = router;
