import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.{ts,tsx}'],
    reporters: ['default'],
    // Coverage is measured and published because it finds untested branches;
    // no build fails on a percentage (NFR-009). These numbers are read, not a
    // threshold, and there is deliberately no `thresholds` block here.
    //
    // `projectRoot` is load-bearing. The repository is analysed as a single
    // SonarQube Cloud project, so an LCOV record of `src/App.tsx` does not
    // resolve against the project base directory and imports as no coverage at
    // all; pointing it one level up records `frontend/src/App.tsx` instead.
    coverage: {
      provider: 'v8',
      reporter: ['text', ['lcovonly', { projectRoot: '..' }]],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}'],
    },
  },
});
