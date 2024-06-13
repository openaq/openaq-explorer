import { defineConfig } from '@solidjs/start/config';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  server: {
    preset: 'aws-lambda',
  },
  vite: {
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
  },
  middleware: './src/middleware.ts',
});
