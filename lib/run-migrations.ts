/* eslint-disable no-console */
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runMigrations() {
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'staging';

  try {
    await execAsync('npx prisma migrate deploy');
  } catch (error) {
    console.error('[Migrations] Error:', error);
    if (isProduction) {
      throw new Error('Database migration failed');
    }
    console.warn('[Migrations] Failed - continuing in development');
  }
}
