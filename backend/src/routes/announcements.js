const express = require('express');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Simple in-memory list of SSE clients
const clients = new Set();

router.post('/', authRequired, requireRole('admin'), async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Missing fields' });
  const ann = {
    id: uuidv4(),
    title,
    body,
    created_at: new Date()
  };
  await db('announcements').insert(ann);
  // broadcast
  const payload = JSON.stringify({ announcement: ann });
  for (const resClient of clients) {
    try {
      resClient.write(`data: ${payload}\n\n`);
    } catch (e) {
      // ignore
    }
  }
  res.json({ ann });
});

// List recent announcements
router.get('/', authRequired, async (req, res) => {
  const list = await db('announcements').orderBy('created_at', 'desc').limit(50);
  res.json({ announcements: list });
});

// SSE stream for announcements
router.get('/stream', authRequired, (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  res.write('\n');
  clients.add(res);
  req.on('close', () => {
    clients.delete(res);
  });
});

module.exports = router;
