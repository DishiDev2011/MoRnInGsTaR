const express = require('express');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Students create issue
router.post('/', authRequired, async (req, res) => {
  const { title, description, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });
  const issue = {
    id: uuidv4(),
    title,
    description: description || '',
    category: category || 'general',
    status: 'OPEN',
    reporter_id: req.user.id,
    assignee_id: null,
    created_at: new Date()
  };
  await db('issues').insert(issue);
  res.json({ issue });
});

// Get issues - students see their own, admin sees all
router.get('/', authRequired, async (req, res) => {
  if (req.user.role === 'admin') {
    const issues = await db('issues').orderBy('created_at', 'desc');
    return res.json({ issues });
  } else {
    const issues = await db('issues').where({ reporter_id: req.user.id }).orderBy('created_at', 'desc');
    return res.json({ issues });
  }
});

// Admin update status / assign
router.put('/:id', authRequired, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { status, assignee_id } = req.body;
  const allowed = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
  if (status && !allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const update = {};
  if (status) update.status = status;
  if (assignee_id !== undefined) update.assignee_id = assignee_id;
  update.updated_at = new Date();
  await db('issues').where({ id }).update(update);
  const issue = await db('issues').where({ id }).first();
  res.json({ issue });
});

module.exports = router;
