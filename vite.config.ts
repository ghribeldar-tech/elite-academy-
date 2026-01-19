import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // هذا السطر هو "السحر" الذي يربط علامة @ بالمجلد الرئيسي للمشروع
      "@": path.resolve(__dirname, "./"),
    },
  },
  build: {
    // لضمان استقرار الرفع على Vercel
    outDir: 'dist',
    sourcemap: false
  }
})
