import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    include: ['src/lib/api/__tests__/**/*.integration.test.ts'],
    environment: 'node',
    globals: false,
    setupFiles: ['src/test/setup.ts'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 20000,
    hookTimeout: 60000,
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
  },
});
