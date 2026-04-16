const db = require('./db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@campus.local';
  const existing = await db('users').where({ email: adminEmail }).first();
  if (existing) {
    console.log('Admin already exists:', adminEmail);
    process.exit(0);
  }
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'adminpass', 10);
  await db('users').insert({ id: uuidv4(), name: 'Admin', email: adminEmail, password: hash, role: 'admin', created_at: new Date() });
  console.log('Admin user created:', adminEmail);
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
