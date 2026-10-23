import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    // Components read `import.meta.env` through src/config/env.ts.
    env: { VITE_API_URL: 'http://localhost:3000/api' },
    css: false,
  },
})
