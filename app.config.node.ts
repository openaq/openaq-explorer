import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
  server: {
    routeRules: {
      '/_build/assets/**': {
        headers: {
          'cache-control': `s-maxage=${60 * 60}; max-age:${60 * 60};`,
        },
      },
    },
  },
  vite: {
    inlineDynamicImports: true,
  },
  middleware: './src/middleware.ts',
});
