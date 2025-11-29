import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Merve-Selim-Wedding/',  // GitHub Pages için açın
  server: {
    port: 5173,
    host: true
  }
})