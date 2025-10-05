// backend/controllers/eventController.js
const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, capacity, tags } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      date,
      capacity,
      tags,
      organizer: req.user.id  // logged-in user
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (only organizer can update)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (only organizer can delete)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await event.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
