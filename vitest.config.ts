import path from 'path'
import solid from "vite-plugin-solid"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [solid()],

  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    conditions: ["development", "browser"],
    alias: {
      '~': path.resolve(__dirname, './src')
    },
  },
});