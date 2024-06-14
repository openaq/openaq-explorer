import { defineConfig } from '@solidjs/start/config';
import { configDefaults } from 'vitest/config'

export default defineConfig({
  start: {
    middleware: './src/middleware.ts',
  },
  vite: {
    test: {
      exclude:[
        ...configDefaults.exclude, 
        'cdk/*'
      ],
      environment: 'jsdom',
      globals: true,
      setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
      isolate: false,
    },
  }
});
