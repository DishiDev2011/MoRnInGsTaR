const express = require('express');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Create a booking
router.post('/', authRequired, async (req, res) => {
  const { resource, start_at, end_at } = req.body;
  if (!resource || !start_at || !end_at) return res.status(400).json({ error: 'Missing fields' });
  const s = new Date(start_at);
  const e = new Date(end_at);
  if (s >= e) return res.status(400).json({ error: 'Invalid time range' });
  // Prevent double booking: overlap check
  const conflicts = await db('bookings').where({ resource }).andWhere(function () {
    this.whereBetween('start_at', [s.toISOString(), e.toISOString()]).orWhereBetween('end_at', [s.toISOString(), e.toISOString()]);
  });
  if (conflicts.length > 0) return res.status(409).json({ error: 'Resource already booked for that time' });
  const booking = {
    id: uuidv4(),
    resource,
    start_at: s.toISOString(),
    end_at: e.toISOString(),
    user_id: req.user.id,
    created_at: new Date()
  };
  await db('bookings').insert(booking);
  res.json({ booking });
});

// Get booking history: admins see all
router.get('/', authRequired, async (req, res) => {
  if (req.user.role === 'admin') {
    const list = await db('bookings').orderBy('created_at', 'desc');
    return res.json({ bookings: list });
  } else {
    const list = await db('bookings').where({ user_id: req.user.id }).orderBy('created_at', 'desc');
    return res.json({ bookings: list });
  }
});

module.exports = router;
