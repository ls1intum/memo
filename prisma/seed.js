// Load environment variables from .env file
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

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
  console.log('Starting database seed');

  // Create or update demo user (upsert = update if exists, create if not)
  const user = await prisma.user.upsert({
    where: { email: 'demo@memo.local' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@memo.local',
      role: 'USER',
    },
  });
  console.log('Demo user created:', user.email);

  // Seed competencies, skipping any that already exist
  let created = 0;
  for (const competency of competencies) {
    // Check if competency with this title already exists
    const exists = await prisma.competency.findFirst({
      where: { title: competency.title },
    });

    if (exists) {
      console.log(`Skipping existing competency: ${competency.title}`);
      continue;
    }

    // Create new competency
    await prisma.competency.create({
      data: competency,
    });
    created++;
    console.log(`Created competency: ${competency.title}`);
  }

  console.log(`Seeding complete! Created ${created} new competencies.`);
}

// Execute main function and handle errors
main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect from database, even if errors occur
    await prisma.$disconnect();
  });
