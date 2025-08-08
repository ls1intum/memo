import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Detect TODO and FIXME comments
      'no-warning-comments': [
        'warn',
        {
          terms: ['todo', 'fixme', 'hack', 'bug', 'xxx'],
          location: 'start',
        },
      ],
      // Additional code quality rules
      'no-console': 'warn', // Warn about console statements
      'no-debugger': 'error', // Prevent debugger statements
      'prefer-const': 'error', // Prefer const over let when possible
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Warn about 'any' usage
    },
  },
];

export default eslintConfig;
