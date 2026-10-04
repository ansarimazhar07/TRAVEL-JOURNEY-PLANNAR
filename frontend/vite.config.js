import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple Vite config for React project
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  }
})
