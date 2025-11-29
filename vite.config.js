import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // GitHub Pages için base URL
  // ÖNEMLİ: Repo adınızı buraya yazın!
  base: '/Merve-Selim-Wedding/',
  
  // Not: Netlify/Vercel kullanıyorsanız base: '/' yapın
  
  server: {
    port: 5173,
    host: true
  }
})