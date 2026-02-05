import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/WEBSITE/frontend/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/WEBSITE/public',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost/WEBSITE/public',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
