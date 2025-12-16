# Database Setup and Migrations

## Overview

PostgreSQL 16 with Prisma ORM. **Migrations auto-apply on server startup** in all environments.

## Setup

**Using Docker (recommended):**

```bash
./docker-manage.sh up development
```

- Database runs automatically in Docker
- No `.env` file needed - `DATABASE_URL` is set in `docker-compose.yml`
- Migrations run on startup

**Using Prisma Studio GUI:**

1. Ensure Docker database is running: `./docker-manage.sh up development`
2. Create `.env` file in project root with `DATABASE_URL` from
   `docker/development/docker-compose.yml`
3. Run: `npm run db:studio`

## Quick Start

```bash
# Development
./docker-manage.sh up development

# Production/Staging
./docker-manage.sh up production
./docker-manage.sh up staging
```

## How Migrations Work

**Automatic on startup:**

- **Production/Staging**: Crashes if migration fails (safe)
- **Development**: Continues if migration fails (non-blocking)

**Creating migrations:**

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration file
npm run db:migrate

# 3. Restart server - migration auto-applies
./docker-manage.sh restart development
```

## Database Scripts

| Script        | Purpose                           |
| ------------- | --------------------------------- |
| `db:migrate`  | Create new migration file         |
| `db:studio`   | Open Prisma Studio GUI            |
| `db:reset`    | Reset database (⚠️ destroys data) |
| `db:generate` | Regenerate Prisma Client          |
| `db:seed`     | Seed demo user + competencies     |

## Common Tasks

**View database:**

```bash
# Prisma Studio (GUI) - requires .env file with DATABASE_URL
npm run db:studio
# Opens at http://localhost:5555
```

Alternatively, use VS Code PostgreSQL extensions with connection:

- Host: `localhost`, Port: `5432`, Database: `memo_dev`
- Username: `memo_user`, Password: `memo_password`

**Check migration status:**

```bash
npx prisma migrate status
```

**Reset database (dev only):**

```bash
npm run db:reset
```

**Seed demo content (user + 5 competencies):**

```bash
npm run db:seed
```

Creates a demo user (`demo@memo.local`) and 5 sample competencies. Idempotent, safe to run multiple
times.

## Schema

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema.

Models: User, Competency, CompetencyRelationship, LearningResource, CompetencyResourceLink

## Troubleshooting

**"Database schema is not in sync"**

```bash
npm run db:migrate
```

**"Prisma Client out of sync"**

```bash
npm run db:generate
```

**Production migration failed**

- Check `DATABASE_URL` environment variable
- View logs: `./docker-manage.sh logs production`
