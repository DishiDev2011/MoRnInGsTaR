const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const issuesRoutes = require('./routes/issues');
const announcementsRoutes = require('./routes/announcements');
const bookingsRoutes = require('./routes/bookings');
const { authRequired } = require('./middleware/auth');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ensure tables (simple setup for dev; for production use migrations)
async function ensureSchema() {
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (t) => {
      t.string('id').primary();
      t.string('name');
      t.string('email').unique();
      t.string('password');
      t.string('role');
      t.timestamp('created_at');
    });
  }
  const hasIssues = await db.schema.hasTable('issues');
  if (!hasIssues) {
    await db.schema.createTable('issues', (t) => {
      t.string('id').primary();
      t.string('title');
      t.text('description');
      t.string('category');
      t.string('status');
      t.string('reporter_id');
      t.string('assignee_id');
      t.timestamp('created_at');
      t.timestamp('updated_at');
    });
  }
  const hasAnnouncements = await db.schema.hasTable('announcements');
  if (!hasAnnouncements) {
    await db.schema.createTable('announcements', (t) => {
      t.string('id').primary();
      t.string('title');
      t.text('body');
      t.timestamp('created_at');
    });
  }
  const hasBookings = await db.schema.hasTable('bookings');
  if (!hasBookings) {
    await db.schema.createTable('bookings', (t) => {
      t.string('id').primary();
      t.string('resource');
      t.timestamp('start_at');
      t.timestamp('end_at');
      t.string('user_id');
      t.timestamp('created_at');
    });
  }
}

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/bookings', bookingsRoutes);

// a health endpoint
app.get('/api/health', (req, res) => res.json({ ok: true }));

(async () => {
  await ensureSchema();
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    console.log('Ensure you copied .env.example -> .env and installed dependencies');
  });
})();
