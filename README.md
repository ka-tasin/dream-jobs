# Dream Jobs

**Dream Jobs** is a full-stack job platform that connects **employers** and **job seekers**.  
This repository includes both the frontend (`client/`) and backend (`server/`) — with the backend being the core logic layer, designed for scalability, and clean architecture.

---

## Overview

The backend of Dream Jobs is built with **Node.js**, **TypeScript**, **Express**, and **Prisma ORM**, **PostgreSQL** following the **Controller–Service–Repository** architecture pattern with **inversion of control/DI** for dependency management.  
This ensures a **Scalable**, **testable**, **maintainable**, and **loosely coupled** codebase.

---

### Live link: https://dream-jobs-kat.vercel.app/

## Features

### Backend Highlights
-  **Clean Architecture** (Controller → Service → Repository)
-  **Inversion of control / Dependency Injection** (InversifyJS) 
-  **Prisma ORM** (type-safe DB access)
-  **Unit Testing** with Jest
-  **TypeScript** for static typing and scalability
-  **Express.js** API design with modular routes
-  **Environment-based configuration** via dotenv

### Frontend (Client)
-  **Next.js** with TypeScript for type-safe components
-  **Tailwind CSS** for responsive, modern UI
-  **API integration** with backend endpoints
-  **Dynamic job listings** and detail views

---

##  Architecture Explanation

The backend is structured using a **3-layered clean architecture**:

### 1. Controller Layer
- Handles incoming HTTP requests.
- Delegates logic to the service layer.
- Sends structured API responses.

### 2. Service Layer
- Contains the **business logic**.
- Interacts with repositories for data access.
- Abstracts application logic from request/response flow.

### 3. Repository Layer
- Interacts directly with the **database** via Prisma.
- Responsible for querying, updating, and deleting records.

### 4. IOC / Dependency Injection (InversifyJS)
Dependencies (controllers, services, repositories) are registered in an IoC container and injected automatically, promoting testability and modularity.

Example:
```ts
@injectable()
class JobService {
  constructor(
    @inject(TYPES.JobRepository) private jobRepository: JobRepository
  ) {}

  async getAllJobs() {
    return this.jobRepository.findAll();
  }
}
```
## #Testing
Unit testing is implemented using Jest.
Each service and repository is tested in isolation to verify functionality.

Example test (job.service.test.ts):

```ts
describe('JobService', () => {
  it('should create a job via repository', async () => {
    const job = await jobService.createJob(mockJobData);
    expect(job.title).toBe(mockJobData.title);
  });
});
```

### Run Tests
```bash
npm test
```

---

## 💾 Database & Performance Optimization

### 1. N+1 Query Resolution
To prevent database query loops, all nested relational assets are fetched using Prisma's eager-loading `include` and selective `select` options. For example, when fetching job details or list items, the system utilizes joined queries to retrieve employer metadata in a single network round-trip rather than executing separate downstream lookups for each row.

*   **Anti-Pattern (N+1 Queries)**: Fetching `N` jobs, then running `N` separate queries inside a loop to look up company profiles.
*   **Optimized Pattern (Single Query)**: Joining `Job` and `Employer` models at the database level inside a single query block implemented in job.service.ts:
    ```ts
    const jobs = await prisma.job.findMany({
      include: {
        employer: {
          select: {
            companyName: true,
            companyLogo: true,
          }
        }
      }
    });
  ```

### 2. Database Indexing
Database indexes are strategically configured on key filter columns in `schema.prisma` to keep search and ordering processes performing at $\mathcal{O}(\log N)$ time:
*   `@@index([jobId, status])`: Optimizes employer dashboard queries when filtering candidates by application status.
*   `@@index([title])` and `@@index([type])`: Speeds up job listings search queries on the main page.
*   `@unique` on email: Generates an automatic unique B-Tree index to keep credentials lookup instantaneous during login.

---

### Setup and Run
***Backend Setup***
- Install Dependencies

```bash
cd server
npm install
```
- Setup Environment Variables
- Create a .env file in the server/ folder:

.env
```.env
DATABASE_URL=your_database_url
PORT=3000
JWT_SECRET=your_secret
```
- Setup Prisma

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

- Run the Server
  
```bash
npm run dev
```



**Frontend Setup**
- Navigate to client directory

```bash
cd client
```

```bash
npm install
```
- Start development server

```bash
npm run dev
```

Frontend runs at: http://localhost:5173 (Vite default)

Backend runs at: http://localhost:3000

### API Endpoints
Endpoint	Method	Description
```
/api/jobs	GET	Fetch all jobs
/api/jobs/:id	GET	Get job by ID
/api/jobs	POST	Create a new job
/api/jobs/:id	PUT	Update existing job
/api/jobs/:id	DELETE	Delete a job
```

