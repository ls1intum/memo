import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Competency } from '@prisma/client';

export async function GET() {
  try {
    // Fetch two random competencies from the database
    const competencies: Competency[] = await prisma.$queryRaw`
      SELECT * FROM "competencies" ORDER BY RANDOM() LIMIT 2
    `;

    // Ensure we have at least two competencies to return
    if (competencies.length < 2) {
      return NextResponse.json(
        { error: 'Not enough competencies in database. Run db:seed first.' },
        { status: 400 },
      );
    }

    const [competency1, competency2] = competencies;

    // Return the two competencies as a JSON response
    return NextResponse.json({
      competency1,
      competency2,
    });
  } catch (error) {
    // Log any errors
    console.error('Failed to fetch random competencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competencies' },
      { status: 500 },
    );
  }
}
