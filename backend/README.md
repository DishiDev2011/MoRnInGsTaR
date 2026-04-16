# Campus Ops Backend

This is a minimal Express backend for the Campus Ops sample application.

Features:

- JWT authentication (students + admin)
- Role-based access control
- Issue reporting lifecycle: OPEN -> IN_PROGRESS -> RESOLVED
- Announcements with Server-Sent Events (SSE) for real-time updates
- Resource booking with conflict prevention

Quick start (development using SQLite):

1. Copy env example:

```bash
cp .env.example .env
# optionally edit .env (JWT_SECRET, PORT)
```

2. Install dependencies and seed admin:

```bash
cd backend
npm install
npm run seed
npm start
```

The server will create a local SQLite file (dev.sqlite3) and create tables.

Production: set `DATABASE_CLIENT=pg` and `DATABASE_URL` to your Postgres connection string, then use migrations (not included here) or adapt the schema creation.

API endpoints (examples):

- POST /api/auth/register
- POST /api/auth/login
- POST /api/issues
- GET /api/issues
- PUT /api/issues/:id (admin)
- POST /api/announcements (admin)
- GET /api/announcements
- GET /api/announcements/stream (SSE)
- POST /api/bookings
- GET /api/bookings
