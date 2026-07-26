# Dream Jobs

A multi-role job platform connecting **Employers** and **Job Seekers**, with role-based access control, async email processing, fuzzy search, and containerized infrastructure.

**Live:** [dream-jobs-kat.vercel.app](https://dream-jobs-kat.vercel.app/)

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js, TypeScript, Express 5 |
| **Frontend** | Next.js, Tailwind CSS, Shadcn UI |
| **Database** | PostgreSQL, Prisma ORM |
| **Queue** | Redis, BullMQ |
| **Auth** | JWT (HTTP-only cookies), OAuth 2.0 (Google) via Passport.js |
| **File Storage** | Cloudinary (resumes, company logos) |
| **Infrastructure** | Docker, Docker Compose |
| **Validation** | Zod |

---

## Architecture

```
client/          → Next.js frontend (deployed on Vercel)
server/          → Express API (containerized with Docker)
├── src/
│   ├── modules/       → Feature modules (controller + service + routes + validation)
│   ├── middlewares/    → Auth, RBAC, rate limiting, validation, error handling
│   ├── config/        → Redis, Cloudinary, SMTP configuration
│   ├── queues/        → BullMQ job definitions
│   ├── workers/       → Background job processors (email)
│   ├── utils/         → Shared utilities
│   ├── app.ts         → Express app setup
│   └── server.ts      → Server entrypoint
├── prisma/            → Schema, migrations, seed data
├── Dockerfile         → Multi-stage production build
└── docker-compose.dev.yml → Dev environment (Postgres + Redis + Backend)
```

The backend follows a **modular Controller → Service** architecture. Each feature (auth, jobs, applications, employers, admin) is a self-contained module with its own routes, controller, service, and validation schemas.

---

## Key Features

### Backend
- **RBAC with 3 roles** (User, Employer, Admin) — middleware-enforced authorization per route
- **JWT auth stored in HTTP-only cookies** — XSS-resistant token storage with secure/sameSite flags
- **OAuth 2.0** — Google sign-in via Passport.js
- **Fuzzy search** — PostgreSQL `pg_trgm` extension for typo-tolerant job search
- **Async email processing** — Redis-backed BullMQ workers decouple SMTP from the request lifecycle
- **File uploads** — Multer + Cloudinary for resume PDFs and company logos
- **Input validation** — Zod schemas validated at the middleware layer before reaching controllers
- **Security hardening** — Helmet headers, CORS whitelisting, API rate limiting
- **Database indexing** — Strategic indexes on filter/sort columns for O(log N) query performance
- **Centralized error handling** — Custom `ApiError` class with consistent error response format

### Frontend
- **Next.js** with server-side rendering
- **Shadcn UI + Tailwind CSS** — component library with responsive design
- **Debounced search** — minimizes API calls during user input
- **Role-based UI** — different dashboards for Job Seekers, Employers, and Admins

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth (`/auth`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in | No |
| POST | `/auth/logout` | Log out | Yes |
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |

### Jobs (`/jobs`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/jobs` | List jobs (filters, search, pagination) | No |
| GET | `/jobs/:id` | Get job details | No |
| POST | `/jobs` | Create a job | Employer |
| PUT | `/jobs/:id` | Update a job | Employer |
| DELETE | `/jobs/:id` | Delete a job | Employer, Admin |

### Applications (`/applications`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/applications` | List applications | User, Employer, Admin |
| GET | `/applications/stats` | Application statistics | Employer, Admin |
| GET | `/applications/:id` | Get application details | User, Employer, Admin |
| POST | `/applications` | Submit an application | User |
| PATCH | `/applications/:id/status` | Update application status | Employer, Admin |
| DELETE | `/applications/:id` | Withdraw an application | User, Admin |

### Employers (`/employers`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/employers/register` | Register as employer | User |
| GET | `/employers/me` | Get own employer profile | Employer |
| PATCH | `/employers/me` | Update employer profile | Employer |
| GET | `/employers/stats` | Employer statistics | Employer, Admin |
| GET | `/employers/:id` | Public employer profile | No |
| GET | `/employers/:id/jobs` | Jobs by employer | No |

### Admin (`/admin`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/admin` | List all users (paginated) | Admin |
| GET | `/admin/stats` | Platform-wide statistics | Admin |
| DELETE | `/admin/:id` | Delete a user | Admin |

### Upload (`/upload`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/upload/resume` | Upload resume PDF | User |
| POST | `/upload/company-logo` | Upload company logo | Employer |

### User (`/users`)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/users/me` | Get current user profile | Yes |

---

## Database Schema

```
Users ──< Applications >── Jobs ──< SavedJobs >── Users
  │                          │
  └── Employer ──────────────┘
```

Key design decisions:
- **Composite unique constraint** on `[userId, jobId]` in Applications — prevents duplicate applications
- **Cascade deletes** on User → Applications and Job → Applications
- **Strategic indexes** on `[jobId, status]`, `[title]`, `[employerId, isActive]` for query performance
- **`pg_trgm` extension** enabled for fuzzy text search on job titles and descriptions

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v22+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/ka-tasin/dream-jobs.git
cd dream-jobs

# Copy environment template and fill in your values
cp server/.env.example server/.env

# Start PostgreSQL, Redis, and Backend
docker compose -f docker-compose.dev.yml up -d --build

# Run database migrations
docker compose -f docker-compose.dev.yml run --rm migrate

# Start the frontend (in a separate terminal)
cd client && npm install && npm run dev
```

### Option 2: Manual Setup

```bash
# Backend
cd server
npm install
cp .env.example .env        # Fill in your values
npx prisma generate
npx prisma migrate dev
npm run dev                  # Runs on http://localhost:3000

# Frontend (separate terminal)
cd client
npm install
npm run dev                  # Runs on http://localhost:5173
```

### Environment Variables

See [`server/.env.example`](server/.env.example) for the full list of required environment variables.

---

## Docker Architecture

```
┌────────────────────────────────────────────────┐
│          Docker Bridge Network                  │
│                                                 │
│  ┌────────────┐  ┌────────┐  ┌──────────────┐  │
│  │ PostgreSQL  │  │ Redis  │  │   Backend    │  │
│  │  :5432      │  │ :6379  │  │   :3000      │  │
│  └────────────┘  └────────┘  └──────────────┘  │
└────────────────────────────────────────────────┘
                                      ↕ port mapping
┌────────────────────────────────────────────────┐
│          Host Machine                           │
│   Frontend (Next.js) → localhost:3000 (API)     │
└────────────────────────────────────────────────┘
```

- **Multi-stage Dockerfile** — builder stage compiles TypeScript, final stage contains only production dependencies
- **Health checks** on PostgreSQL and Redis — backend waits until dependencies are ready
- **Named volumes** for data persistence across container restarts

---

## License

This project is for educational purposes.
