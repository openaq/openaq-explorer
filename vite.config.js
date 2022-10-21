import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import remarkHtml from 'vite-remark-html'
import visualizer from 'rollup-plugin-visualizer';



export default defineConfig({
  plugins: [remarkHtml(), solidPlugin(),visualizer()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
