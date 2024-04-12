import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  server: {
    preset: 'aws-lambda',
  },
  start: {
    middleware: './src/middleware.ts',
  },
});
