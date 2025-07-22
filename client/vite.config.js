import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default {
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
      '/jobs': 'http://localhost:3001',
    },
  },
}

