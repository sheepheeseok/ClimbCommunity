import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",  // 👈 global을 window로 대체
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src"),
    },
  },
})
