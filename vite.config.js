import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import remarkHtml from 'vite-remark-html';
import visualizer from 'rollup-plugin-visualizer';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    remarkHtml(),
    solidPlugin(),
    visualizer(),
    devtools({
      autoname: true,
    }),
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: { web: [/.\/src\/.*\.[j]sx?$/] },
    setupFiles: [
      'node_modules/@testing-library/jest-dom/extend-expect.js',
    ],
    deps: { registerNodeLoader: true },
    threads: false,
    isolate: false,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
