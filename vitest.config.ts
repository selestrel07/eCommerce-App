import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
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
