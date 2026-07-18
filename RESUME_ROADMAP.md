# Resume Projects & Features Roadmap

This document serves as a tracking guide for adding production-grade, mid-level features to the **Dream Jobs** portal. Use this checklists and technical hints when compiling your final resume entries once features are implemented.

---

## 🚀 Mid-Level Features Status

### 🔐 1. Enhanced Security
- [ ] **HTTP-Only Cookies JWT Storage**
  - *Goal*: Secure the token transmission from client to server against XSS injections.
  - *Action*: Install `cookie-parser` on server, use `res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })`.
- [ ] **API Rate Limiting**
  - *Goal*: Protect public registration and authentication endpoints from brute-force scripts.
  - *Action*: Install `express-rate-limit` on the server and apply to auth routers.
- [ ] **Express Security Headers (Helmet)**
  - *Goal*: Guard against HTTP header exploits.
  - *Action*: Configure `helmet` middleware.

### 💾 2. Database Scale & Reliability
- [ ] **PostgreSQL Index Optimization**
  - *Goal*: Enhance query response speeds on target search items.
  - *Action*: Add `@id` or `@@index` annotations in `prisma/schema.prisma` for `job.title`, `job.experience`, `application.status`, `user.email`.
- [ ] **Prisma Atomic Transactions**
  - *Goal*: Protect database state consistency.
  - *Action*: Wrap user account deletion and relations cleanup in `prisma.$transaction()`.
- [ ] **N+1 Query Resolution**
  - *Goal*: Avoid redundant query trips for relation lookups (e.g. applications + job + user profile).
  - *Action*: Refactor queries to selectively load properties via `select` and nested `includes`.

### ⚡ 3. Advanced Features (The "Resume Highlights")
- [ ] **S3 Resume Document Storage**
  - *Goal*: Replace simple text input links with real file uploads.
  - *Action*: Use `multer` on the backend to parse file streams and upload PDFs directly to an **Amazon S3** bucket (or Cloudinary), storing the returned secure static URL.
- [ ] **Asynchronous Email Notification Queue**
  - *Goal*: Send status/apply emails in background threads without blocking main API requests.
  - *Action*: Spin up a local **Redis** instance, install `bull` or `bullmq`, and process async tasks in a worker worker script.
- [ ] **Fuzzy Search Indices**
  - *Goal*: Enhance candidate keyword matching.
  - *Action*: Enable `pg_trgm` extension in PostgreSQL and map search queries to use full-text indexing.

### 🛠️ 4. Engineering Workflow
- [ ] **Automated Integration Tests (Jest & Supertest)**
  - *Goal*: Validate router security and application behavior.
  - *Action*: Setup tests covering the sign-up, job posting, and candidate apply processes.
- [ ] **Docker Compose Dev Environment**
  - *Goal*: Eliminate local setup constraints.
  - *Action*: Write `Dockerfile` and `docker-compose.yml` to automatically build services and connect PostgreSQL database.
- [ ] **CI/CD Build Check Pipeline**
  - *Goal*: Validate pull request stability.
  - *Action*: Write a GitHub Actions workflow to run type checks and test suites on repository pushes.

---

## 📝 Final Resume Summary Template

Once the checklist is completed, copy and refine these descriptions for your resume:

> **Full Stack Software Engineer**
> *   *Implemented secure cookie-based JWT session authentication with Lax/Strict configuration parameters and integrated rate-limiting middleware, protecting public APIs from CSRF and brute-force vulnerabilities.*
> *   *Redesigned application file upload flow to stream PDF candidate resumes directly to Amazon S3 buckets, increasing security and database document efficiency.*
> *   *Offloaded CPU-intensive tasks such as recruitment emails and document parsers from the main Express runtime into an asynchronous Redis-backed BullMQ processing thread.*
> *   *Improved PostgreSQL read performance by 30% through index planning on foreign keys and queries containing search predicates.*
> *   *Standardized project containerization with Docker Compose, reducing environment setup times for engineers to a single command.*
