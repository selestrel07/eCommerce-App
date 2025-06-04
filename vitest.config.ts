import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    exclude: ['node_modules', 'dist'],
    reporters: ['default'],
    setupFiles: ['./src/setupTests'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: 'text',
      exclude: [
        'commitlint.config.ts',
        'lint-staged.config.mjs',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
