// Load environment variables from .env file
require('dotenv').config();
const { PrismaClient, UserRole } = require('@prisma/client');

// Initialize Prisma Client for database operations
const prisma = new PrismaClient();

// Define competencies to seed into the database
const competencies = [
  {
    title: 'Data Structures and Pattern Matching',
    description:
      'Utilize built-in data types, implement pattern matching to deconstruct complex types, and create user-defined data structures.',
  },
  {
    title: 'Functional Programming Paradigms',
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

  // Seed competencies, skipping any that already exist
  let created = 0;
  for (const competency of competencies) {
    // Check if competency with this title already exists
    const exists = await prisma.competency.findFirst({
      where: { title: competency.title },
      select: { id: true },
    });

    if (exists) {
      console.log(`[Seed] Skipping existing competency: ${competency.title}`);
      continue;
    }

    // Create new competency
    await prisma.competency.create({ data: competency });
    created += 1;
    console.log(`[Seed] Created competency: ${competency.title}`);
  }

  console.log(`[Seed] Seeding complete. Created ${created} new competencies.`);
}

// Execute main function and handle errors
main()
  .catch((error) => {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
