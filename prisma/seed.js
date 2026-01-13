// Load environment variables from .env file
require('dotenv').config();
const { PrismaClient, UserRole } = require('@prisma/client');

// Initialize Prisma Client for database operations
const prisma = new PrismaClient();

// Define competencies to seed into the database
const competencies = [
  {
    title: 'Data Structures',
    description:
      'Utilize built-in data types, implement pattern matching to deconstruct complex types, and create user-defined data structures.',
  },
  {
    title: 'Functional Programming',
    description:
      'Implement solutions using pure functions without side effects, write recursive functions, and optimize through tail recursion.',
  },
  {
    title: 'Higher-Order Functions',
    description:
      'Differentiate between named and anonymous functions, create higher-order functions, and apply currying and partial application techniques.',
  },
  {
    title: 'Polymorphism',
    description:
      'Understand polymorphism and instantiation, implement polymorphic functions and data types for general-purpose reusable code.',
  },
  {
    title: 'Module System and Abstraction',
    description:
      'Design modules with clear interfaces, implement information hiding through abstract types, create functors, and structure programs using modular components.',
  },
];

// Define learning resources to seed into the database
const learningResources = [
  {
    title:
      'Cornell CS 3110: Data Structures and Functional Programming (OCaml) – Course Notes',
    url: 'https://example.com/learning-resource-1',
  },
  {
    title: 'Real World OCaml (2nd Edition)',
    url: 'https://example.com/learning-resource-2',
  },
  {
    title: 'Functional Programming in OCaml',
    url: 'https://example.com/learning-resource-3',
  },
  {
    title: 'OCaml Manual: The Module System and Functors',
    url: 'https://example.com/learning-resource-4',
  },
  {
    title: 'On Understanding Types, Data Abstraction, and Polymorphism',
    url: 'https://example.com/learning-resource-5',
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Provide it in environment variables or a .env file.'
    );
  }

  console.log('[Seed] Starting database seed');

  // Create or update demo user (upsert = update if exists, create if not)
  const user = await prisma.user.upsert({
    where: { email: 'demo@memo.local' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@memo.local',
      role: UserRole.USER,
    },
  });
  console.log(`[Seed] Demo user ready: ${user.email}`);

  // Seed competencies in bulk, skipping duplicates by title
  const competencyResult = await prisma.competency.createMany({
    data: competencies,
    skipDuplicates: true,
  });

  console.log(
    `[Seed] Created ${competencyResult.count} new competencies (duplicates skipped).`
  );

  // Seed learning resources in bulk, skipping duplicates by title
  const learningResourceResult = await prisma.learningResource.createMany({
    data: learningResources,
    skipDuplicates: true,
  });

  console.log(
    `[Seed] Created ${learningResourceResult.count} new learning resources (duplicates skipped).`
  );

  console.log('[Seed] Seeding complete.');
}

// Execute main function and handle errors
main()
  .catch(error => {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
