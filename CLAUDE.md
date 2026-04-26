# Memo - Competency-Based Education Benchmark Platform

Platform for scientists and educators to collect and combine educational data into benchmarks for
competency-based learning.

## Tech Stack

**Frontend**: Vite 6 · React 19 · React Router 7 · TypeScript · shadcn/ui · Tailwind CSS 4 ·
TanStack Query · Axios · Keycloak JS

**Backend**: Spring Boot 3.4 · Java 17 · PostgreSQL 18 · Flyway · JPA/Hibernate · Lombok · SpringDoc
OpenAPI

**Auth**: Keycloak 26.4 · OAuth2 · JWT

**Deployment**: Docker Compose · Gradle · Nginx (production)

## Architecture

```
Vite + React Frontend (port 3000)
├── React Components (shadcn/ui + Tailwind)
├── React Router 7 (client-side routing)
├── TanStack Query (server state)
├── Axios API Client (JWT injected via interceptor)
└── Keycloak JS (OAuth2 PKCE)

Spring Boot Backend (port 8080)
├── REST Controllers + OpenAPI
├── Service Layer
├── Spring Data JPA
├── JPA Entities
├── Flyway Migrations
└── Spring Security + OAuth2 (JWT resource server)

Keycloak (port 8081)
└── OAuth2/JWT Authentication

PostgreSQL (port 5433)
└── Application Database
```

## Key Conventions

- **Components**: PascalCase files. No SSR — Vite SPA, all components run in the browser.
- **Code Style**: Self-documenting code, minimal comments, rely on ESLint/Prettier.
- **Git**: Feature branches → PR → merge to main, multiple commits per branch OK.
- **API**: RESTful endpoints, JWT authentication required.
- **Backend**: Use `server/server-manage.sh` for Spring Boot operations.
- **Frontend**: Standard Vite development workflow.

## Quick Start

**Backend:**

```bash
cd server
./server-manage.sh up
```

**Frontend:**

```bash
npm run dev
```

**Access:**

- Frontend: http://localhost:3000
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Keycloak: http://localhost:8081 (admin/admin)

## AI Subagents

Four specialized agents in `.claude/agents/`:

1. **senior-architect** - Plans & orchestrates (NO implementation). Use proactively for new
   features.
2. **shadcn-expert** - UI components, Tailwind
3. **database-expert** - PostgreSQL, JPA, Spring Data
4. **docker-expert** - Containers, deployment

## Workflow

For new features: senior-architect analyzes → designs → creates plan → gets approval → orchestrates
specialized agents

**Frontend Commands:**

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run quality` - Type-check + lint + format
- `npm run test:integration` - Run FE↔BE integration tests against the local docker stack

**Backend Commands:**

- `cd server && ./server-manage.sh up` - Start all services
- `./server-manage.sh logs` - View logs
- `./server-manage.sh build` - Build Spring Boot app
- `./server-manage.sh test` - Run tests

## Documentation

- **README.md** - Setup guide and project overview
- **server/README.md** - Backend documentation
- **SECURITY.md** - Security guidelines

## Authentication

All API requests require a JWT token from Keycloak. The frontend obtains tokens via the
authorization code flow with PKCE; integration tests obtain them via the password grant against the
seeded test users (`e2e-user@memo.local`, `e2e-admin@memo.local`).
