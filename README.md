# CourseGraph

Plan your degree with confidence. **CourseGraph** lets you model courses and prerequisites, visualize them as a directed graph, and generate a simple term-by-term plan.

- **Tech:** Next.js (App Router) · TypeScript · React · Tailwind · Prisma · PostgreSQL · Cytoscape.js  
- **Infra:** pnpm · GitHub Actions (with Postgres service) · Vercel  
- **Docs:** Swagger UI at `/docs` (OpenAPI spec served from `/public`)

<br/>

## Demo

- **Live:** https://course-graph.vercel.app/  
  - **Graph:** `/graph`  
  - **Planner:** `/plan`  
  - **Courses (CRUD + prereqs):** `/courses`  
  - **API Docs:** `/docs`

> The demo uses seeded data (e.g., `CS101 → CS201 → CS301`). You can add courses and manage edges directly on `/courses`.

<br/>

## Features

- **Relational schema:** `Course`, `Prereq`, `Plan`, `PlanItem` (with composite-unique on `(fromCourseId, toCourseId)` to prevent duplicate edges).
- **Graph view:** Cytoscape.js rendering with highlighting and a sensible layout.
- **Planner preview:** Greedy, prereq-aware batching (topological sort under the hood).
- **Inline prereq manager:** Add/remove prerequisite edges from the `/courses` page (Server Actions).
- **REST endpoint:** `/api/courses/graph` returns `{ nodes, edges }` for the visualization and planner.
- **API docs:** Swagger UI at `/docs`, OpenAPI spec in `public/openapi/openapi.yaml`.
- **CI:** GitHub Actions runs Postgres, Prisma migrate/seed, ESLint, typecheck, build (Turbopack), and Vitest unit tests.

<br/>

## Local Development

### Prerequisites
- Node **20.x** (recommended via `nvm use 20`)
- **pnpm 10.x** (`corepack enable` or `npm i -g pnpm@10`)
- Docker (for local Postgres) **or** a hosted Postgres connection string

### 1) Clone & install
```bash
git clone https://github.com/cbitti/CourseGraph.git
cd CourseGraph/web
pnpm install
