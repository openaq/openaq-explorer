import { defineConfig } from '@solidjs/start/config';
import { configDefaults } from 'vitest/config';
import autoprefixer from 'autoprefixer';
import solidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
  server: {
    preset: 'aws-lambda',
    inlineDynamicImports: true,
    esbuild: {
      options: {
        target: 'es2022',
      },
    },
  },
  vite: {
    assetsInclude: ['**/*.md'],
    plugins: [
      solidSvg()
    ],
    optimizeDeps: {
      exclude: ['maplibre-gl'],
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
