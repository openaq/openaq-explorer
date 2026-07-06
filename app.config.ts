import { defineConfig } from '@solidjs/start/config';
import { configDefaults } from 'vitest/config';
import autoprefixer from 'autoprefixer';
import solidSvg from 'vite-plugin-solid-svg';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  server: {
    preset: 'aws-lambda',
    inlineDynamicImports: true,
  },
  vite: {
    assetsInclude: ['**/*.md'],
    plugins: [
      solidSvg()
    ],
    optimizeDeps: {
      include: ['mapbox-gl'],
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    test: {
      exclude: [...configDefaults.exclude, 'cdk/*'],
      environment: 'jsdom',
      globals: true,
      setupFiles: ['node_modules/@testing-library/jest-dom/vitest'],
      isolate: false,
    },
  },
  middleware: './src/middleware/index.ts',
});
