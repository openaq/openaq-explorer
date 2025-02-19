import path from 'path';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';
import solidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
  plugins: [solid(), solidSvg()],

  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
