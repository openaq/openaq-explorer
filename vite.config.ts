import { defineConfig } from 'vite';
import { nitro } from 'nitro/vite';
import { solidStart } from '@solidjs/start/config';
import autoprefixer from 'autoprefixer';
import solidSvg from 'vite-plugin-solid-svg';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    solidStart({ middleware: './src/middleware/index.ts' }),
    nitro(),
    solidSvg(),
  ],
  nitro: {
    preset: 'aws-lambda',
    inlineDynamicImports: true,
  },
  assetsInclude: ['**/*.md'],
  ssr: {
    noExternal: ['maplibre-gl'],
  },
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  }
});
