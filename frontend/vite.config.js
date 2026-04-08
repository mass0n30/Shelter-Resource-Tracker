import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
  // allows shadUI components to be imported using absolute paths, e.g. "@/components/ui/button" instead of relative paths like "../../components/ui/button"
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

import path from "path";
