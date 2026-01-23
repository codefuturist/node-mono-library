/**
 * Shared Vitest configuration for the monorepo
 * 
 * This configuration can be extended by individual packages
 * to maintain consistency across the monorepo.
 */
export const sharedConfig = {
  test: {
    globals: true,
    environment: 'node' as const,
    coverage: {
      provider: 'v8' as const,
      reporter: [
        ['json', { file: 'coverage.json' }],
        'text',
        'html',
      ] as const,
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules',
        'dist',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/__tests__/**',
      ],
    },
  },
} as const;
