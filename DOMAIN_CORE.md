# Domain Core Architecture

This project uses a layered architecture. The "domain core" includes the service and repository
layers, and **only the repository implementation layer communicates with the database**.

## Architecture Flow

```
Client Side
    ↓
Server Actions (app/actions/)
    ↓
Service Layer (lib/services/)
    ↓
Repository Interface (lib/repositories/dc_interface.ts)
    ↓
Repository Implementation (lib/repositories/dc_repo.ts) ← ONLY layer that touches DB
    ↓
Prisma Client (lib/prisma.ts)
    ↓
PostgreSQL Database
```

## How It Works

### 1. Shared Domain Model (`lib/domain/domain_core.ts`)

Pure entities and input types. No database dependencies.

```typescript
export interface Competency {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateCompetencyInput {
  title: string;
  description?: string;
}
```

### 2. Repository Interface (`lib/repositories/dc_interface.ts`)

Contract definition. No implementation.

```typescript
export interface CompetencyRepository {
  create(data: CreateCompetencyInput): Promise<Competency>;
  findById(id: string): Promise<Competency | null>;
  findAll(): Promise<Competency[]>;
}
```

### 3. Repository Implementation (`lib/repositories/dc_repo.ts`)

Prisma implementation. **ONLY this layer touches the database.**

```typescript
export class PrismaCompetencyRepository implements CompetencyRepository {
  async create(data: CreateCompetencyInput): Promise<Competency> {
    return await prisma.competency.create({ data });
  }
}

export const competencyRepository = new PrismaCompetencyRepository();
```

### 4. Service Layer (`lib/services/`)

Business logic and validation.

```typescript
export class CompetencyService {
  constructor(private readonly repository: CompetencyRepository) {}

  async createCompetency(data: CreateCompetencyInput) {
    return await this.repository.create(data);
  }
}

export const competencyService = new CompetencyService(competencyRepository);
```

### 5. Server Actions (`app/actions/`)

Exposes operations to Client Side.

```typescript
'use server';

import { competencyService } from '@/lib/services/competency';

export async function createCompetencyAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const competency = await competencyService.createCompetency({ title });
    return { success: true, competency };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Usage from Client Side

### Server Components (Default)

```tsx
import { getAllCompetenciesAction } from '@/app/actions/competencies';

export default async function CompetenciesPage() {
  const { success, competencies } = await getAllCompetenciesAction();

  if (!success) return <div>Error loading competencies</div>;

  return (
    <div>
      {competencies?.map(comp => (
        <div key={comp.id}>
          <h2>{comp.title}</h2>
          <p>{comp.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Client Components

```tsx
'use client';

import { createCompetencyAction } from '@/app/actions/competencies';
import { useState } from 'react';

export default function CreateCompetencyForm() {
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    const result = await createCompetencyAction(formData);
    setMessage(result.success ? 'Created!' : result.error);
  }

  return (
    <form action={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit">Create</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

## Connecting to an API

To expose data through an API endpoint:

```typescript
// app/api/competencies/route.ts
import { competencyService } from '@/lib/services/competency';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const competencies = await competencyService.getAllCompetencies();
    return NextResponse.json({ success: true, competencies });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const competency = await competencyService.createCompetency(body);
    return NextResponse.json({ success: true, competency });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

## Rules

### ✅ DO

- Use Server Actions from Client Side
- Add business logic in Service layer
- Use repository interfaces in services
- Call services from API routes for external APIs

### ❌ DON'T

- Never import `prisma` in Client Side/services/API routes
- Never skip layers (call repository directly from actions/routes)
- Never put business logic in Server Actions or API routes
- Never put database queries outside repositories

## Existing Entities

Full CRUD implementations available:

- **User** - [actions/users.ts](app/actions/users.ts)
- **Competency** - [actions/competencies.ts](app/actions/competencies.ts)
- **LearningResource** - [actions/learning_resources.ts](app/actions/learning_resources.ts)
- **CompetencyRelationship** -
  [actions/competency_relationships.ts](app/actions/competency_relationships.ts)
- **CompetencyResourceLink** -
  [actions/competency_resource_links.ts](app/actions/competency_resource_links.ts)
