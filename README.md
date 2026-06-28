# MNNIT Mental Health Counseling — Full Stack Project

## Project Structure

```
mnnit-counseling/
├── backend/          ← Express.js + PostgreSQL API
│   ├── src/
│   │   ├── app.js              ← Main Express app (all routes)
│   │   ├── server.js           ← Entry point
│   │   ├── config/db.js        ← PostgreSQL pool
│   │   ├── controllers/
│   │   │   └── authController.js   ← ★ NEW: Login, JWT, password
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js   ← ★ NEW: JWT protect + restrictTo
│   │   ├── routes/
│   │   │   ├── authRoutes.js       ← ★ NEW: /api/auth/*
│   │   │   ├── studentApiRoutes.js ← ★ NEW: /api/student/*
│   │   │   ├── counsellorApiRoutes.js ← ★ NEW: /api/counsellor/*
│   │   │   ├── adminApiRoutes.js   ← ★ NEW: /api/admin/*
│   │   │   └── deanApiRoutes.js    ← ★ NEW: /api/dean/*
│   │   └── ...existing files kept
│   ├── db/schema.sql           ← ★ Updated: added password_hash column
│   ├── scripts/setup-db.js     ← ★ Updated: seeds demo users
│   ├── .env                    ← ★ Updated: added JWT_SECRET
│   └── package.json            ← ★ Updated: added bcryptjs, jsonwebtoken
│
└── frontend/         ← React + Vite app (your original src/)
    ├── src/           ← All your original source files (unchanged)
    ├── index.html     ← ★ NEW
    ├── vite.config.js ← ★ NEW: proxy /api → backend
    ├── package.json   ← ★ NEW
    └── .env           ← ★ NEW: VITE_API_URL
```

---

## What Changed (Integration Work)

### Backend Changes
| File | What Was Done |
|------|--------------|
| `src/controllers/authController.js` | **NEW** — Login, logout, forgot/reset/change password with bcrypt + JWT |
| `src/middlewares/authMiddleware.js` | **NEW** — JWT verification middleware (`protect`, `restrictTo`) |
| `src/routes/authRoutes.js` | **NEW** — `/api/auth/login`, `/api/auth/logout`, etc. |
| `src/routes/studentApiRoutes.js` | **NEW** — `/api/student/profile`, `/api/student/appointments` |
| `src/routes/counsellorApiRoutes.js` | **NEW** — `/api/counsellor/*` routes |
| `src/routes/adminApiRoutes.js` | **NEW** — `/api/admin/*` routes |
| `src/routes/deanApiRoutes.js` | **NEW** — `/api/dean/*` routes |
| `src/app.js` | **Updated** — Mounts all new routes |
| `db/schema.sql` | **Updated** — Added `password_hash`, `reset_token` columns |
| `scripts/setup-db.js` | **Updated** — Seeds 4 demo users with hashed passwords |
| `package.json` | **Updated** — Added `bcryptjs`, `jsonwebtoken` |
| `.env` | **Updated** — Added `JWT_SECRET`, `JWT_EXPIRES_IN` |

### Frontend Changes (None!)
The frontend source code is **completely unchanged**. It already had `services/api.js` with the correct endpoint paths. Only config files were added:
- `index.html` — HTML entry point
- `vite.config.js` — Vite config with `/api` proxy to backend
- `package.json` — Dependencies
- `.env` — `VITE_API_URL=http://localhost:5000/api`

---

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** v14 or higher (running locally)
- **npm** v9 or higher

---

## Setup & Run Instructions

### Step 1 — Set up PostgreSQL Database

1. Open pgAdmin or psql and create a new database:
   ```sql
   CREATE DATABASE mnnit_counseling_db;
   ```

### Step 2 — Configure Backend Environment

Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
DB_NAME=mnnit_counseling_db
FRONTEND_URL=http://localhost:5173
JWT_SECRET=mnnit_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

### Step 3 — Install Backend Dependencies & Set Up DB

```bash
cd backend
npm install
npm run setup-db
```

This will:
- Create all tables with updated schema
- Seed 4 demo users (password for all: `password123`)

### Step 4 — Start the Backend

```bash
# Still inside /backend
npm run dev
```

Backend will start at: **http://localhost:5000**

Verify with: http://localhost:5000/health

### Step 5 — Install Frontend Dependencies

Open a **new terminal**:

```bash
cd frontend
npm install
```

### Step 6 — Start the Frontend

```bash
# Still inside /frontend
npm run dev
```

Frontend will start at: **http://localhost:5173**

---

## Demo Login Credentials

All demo users have password: **`password123`**

| Role | User Type (select in dropdown) | User ID |
|------|-------------------------------|---------|
| Student | `student` | `STU001` |
| Counsellor | `counsellor` | *(UUID — see note below)* |
| Administrator | `administrator` | *(UUID — see note below)* |
| Dean | `dean` | *(UUID — see note below)* |

> **Getting Counsellor/Admin/Dean UUIDs:**
> After running `npm run setup-db`, run these queries in psql/pgAdmin:
> ```sql
> SELECT id FROM counsellors WHERE email = 'priya@mnnit.ac.in';
> SELECT id FROM administrators WHERE email = 'admin@mnnit.ac.in';
> SELECT id FROM deans WHERE email = 'dean@mnnit.ac.in';
> ```

---

## API Endpoints Reference

### Auth
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/login` | `{ userType, userId, password }` |
| POST | `/api/auth/logout` | — (Bearer token required) |
| POST | `/api/auth/forgot-password` | `{ email }` |
| POST | `/api/auth/reset-password` | `{ token, password }` |
| POST | `/api/auth/change-password` | `{ currentPassword, newPassword }` |

### Student (requires student JWT)
| Method | Endpoint |
|--------|----------|
| GET | `/api/student/profile` |
| PUT | `/api/student/profile` |
| GET | `/api/student/appointments` |
| POST | `/api/student/appointments` |
| GET | `/api/student/appointments/:id` |
| PUT | `/api/student/appointments/:id/cancel` |

### Counsellor (requires counsellor JWT)
| Method | Endpoint |
|--------|----------|
| GET | `/api/counsellor/profile` |
| GET | `/api/counsellor/appointments/pending` |
| GET | `/api/counsellor/appointments/solved` |
| PUT | `/api/counsellor/appointments/:id` |
| POST | `/api/counsellor/appointments/:id/confirm` |

### Admin (requires administrator JWT)
| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/appointments` |
| GET | `/api/admin/appointments/search?regNo=xxx` |
| GET | `/api/admin/statistics` |
| GET | `/api/admin/export` |

### Dean (requires dean JWT)
| Method | Endpoint |
|--------|----------|
| GET | `/api/dean/analytics` |
| GET | `/api/dean/statistics` |
| GET | `/api/dean/trends` |
| GET | `/api/dean/report?startDate=&endDate=` |

---

## Troubleshooting

**CORS error in browser?**
→ Make sure `FRONTEND_URL=http://localhost:5173` in `backend/.env`

**DB connection refused?**
→ Check `DB_PORT` — default PostgreSQL port is `5432`. Your original `.env` had `5435`.

**bcryptjs/jsonwebtoken not found?**
→ Run `npm install` inside the `backend/` folder again.

**Login returns 401 Invalid credentials?**
→ Make sure you ran `npm run setup-db` to seed the demo users with hashed passwords.
