import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // GitHub Pages için base URL
  // Repo adınızı buraya yazın (örn: /dugun-fotograf-sitesi/)
  // Netlify/Vercel için '/' kullanın
  // base: '/Merve-Selim-Wedding/',  // GitHub Pages için açın
  
  server: {
    port: 5173,
    host: true
  }
})