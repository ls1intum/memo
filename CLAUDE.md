# Memo - Competency-Based Education Benchmark Platform

Platform for scientists and educators to collect and combine educational data into benchmarks for
competency-based learning.

## Tech Stack

**Frontend**: Next.js 15 (App Router) · React 19 · TypeScript · shadcn/ui · Tailwind CSS 4 · React Query · Axios

**Backend**: Spring Boot 4.0 · Java 25 · PostgreSQL 16 · Flyway · JPA/Hibernate

**Auth**: Keycloak 26.4 · OAuth2 · JWT

**Deployment**: Docker Compose · Gradle

## Architecture

```
Next.js Frontend (port 3000)
├── React Components
├── TanStack Query (server state)
├── Axios API Client
├── Keycloak Authentication
└── TypeScript API Types

Spring Boot Backend (port 8080)
├── REST Controllers + OpenAPI
├── Service Layer
├── Spring Data JPA
├── JPA Entities
├── Flyway Migrations
└── Spring Security + OAuth2

Keycloak (port 8081)
└── OAuth2/JWT Authentication

PostgreSQL (port 5433)
└── Application Database
```

## Key Conventions

- **Components**: PascalCase files, Server Components by default, `'use client'` only when needed
- **Code Style**: Self-documenting code, minimal comments, rely on ESLint/Prettier
- **Git**: Feature branches → PR → merge to main, multiple commits per branch OK
- **API**: RESTful endpoints, JWT authentication required
- **Backend**: Use `server/server-manage.sh` for Spring Boot operations
- **Frontend**: Standard Next.js development workflow

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

Five specialized agents in `.claude/agents/`:

1. **senior-architect** - Plans & orchestrates (NO implementation). Use proactively for new features.
2. **nextjs-expert** - App Router, routing, React components
3. **shadcn-expert** - UI components, Tailwind
4. **database-expert** - PostgreSQL, JPA, Spring Data
5. **docker-expert** - Containers, deployment

## Workflow

For new features: senior-architect analyzes → designs → creates plan → gets approval → orchestrates specialized agents

**Frontend Commands:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run quality` - Type-check + lint + format

**Backend Commands:**
- `cd server && ./server-manage.sh up` - Start all services
- `./server-manage.sh logs` - View logs
- `./server-manage.sh build` - Build Spring Boot app
- `./server-manage.sh test` - Run tests

## Documentation

- **QUICKSTART.md** - Step-by-step setup guide
- **MIGRATION_COMPLETE.md** - Migration summary
- **server/README.md** - Backend documentation
- **SECURITY.md** - Security guidelines

## Authentication

All API requests require JWT token from Keycloak. Default users:
- **Demo**: `demo@memo.local` / `demo` (USER role)
- **Admin**: `admin@memo.local` / `admin` (ADMIN role)
