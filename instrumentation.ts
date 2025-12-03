/* eslint-disable no-console */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { runMigrations } = await import('./lib/run-migrations');
    try {
      await runMigrations();
      console.log('[Instrumentation] Migrations completed successfully');
    } catch (error) {
      console.error('[Instrumentation] Migration failed:', error);
      throw error;
    }
  }
}
