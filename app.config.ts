import { defineConfig } from '@solidjs/start/config';
import { configDefaults } from 'vitest/config'
import autoprefixer from 'autoprefixer';

export default defineConfig({
  server: {
    preset: 'aws-lambda',
    inlineDynamicImports: true
  },
  vite: {
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
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
  },
  middleware: './src/middleware.ts',
});
