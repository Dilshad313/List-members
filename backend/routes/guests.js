const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

// GET /api/guests - all guests, newest first
router.get('/', async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guests', details: err.message });
  }
});

// POST /api/guests - create a guest
router.post('/', async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create guest', details: err.message });
  }
});

// PUT /api/guests/:id - update a guest
router.put('/:id', async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    Object.assign(guest, req.body);
    await guest.save();
    res.status(200).json(guest);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid guest id' });
    }
    res.status(500).json({ error: 'Failed to update guest', details: err.message });
  }
});

// DELETE /api/guests/:id - delete one guest
router.delete('/:id', async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.status(200).json({ message: 'Guest deleted', id: req.params.id });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid guest id' });
    }
    res.status(500).json({ error: 'Failed to delete guest', details: err.message });
  }
});

// DELETE /api/guests - delete all guests
router.delete('/', async (req, res) => {
  try {
    await Guest.deleteMany({});
    res.status(200).json({ message: 'All guests deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete guests', details: err.message });
  }
});

module.exports = router;
