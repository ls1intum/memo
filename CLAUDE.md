# Memo - Competency-Based Education Benchmark Platform

Platform for scientists and educators to collect and combine educational data into benchmarks for
competency-based learning.

## Tech Stack

Next.js 15 (App Router) · React 19 · TypeScript · shadcn/ui · Tailwind CSS 4 · PostgreSQL 16 ·
Prisma (planned) · Zustand + TanStack Query · Vitest + Playwright (planned) · Docker

## Key Conventions

- **Components**: PascalCase files, Server Components by default, `'use client'` only when needed
- **Code Style**: Self-documenting code, minimal comments, rely on ESLint/Prettier
- **Git**: Feature branches → PR → merge to main, multiple commits per branch OK
- **Deployment**: Manual GitHub Actions triggers for staging/production
- **Docker**: Use `./docker-manage.sh` for all operations (memo-dev, memo-staging, memo-prod)

## AI Subagents

Five specialized agents in `.claude/agents/`:

1. **senior-architect** - Plans & orchestrates (NO implementation). Use proactively for new
   features.
2. **nextjs-expert** - App Router, routing, Server Actions
3. **shadcn-expert** - UI components, Tailwind
4. **database-expert** - PostgreSQL, Prisma, domain modeling
5. **docker-expert** - Containers, deployment

## Workflow

For new features: senior-architect analyzes → designs → creates plan → gets approval → orchestrates
specialized agents

Commands: `npm run quality` (type-check + lint + format), `npm run dev`,
`./docker-manage.sh up development`
