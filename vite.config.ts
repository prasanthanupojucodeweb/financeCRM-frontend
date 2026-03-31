import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Forward /api to Express so the browser never hits Vite for API routes (avoids 404 "Not Found"). */
const backendTarget = process.env.VITE_BACKEND_URL || 'https://financecrm-backend.onrender.com'

const apiProxy = {
  '/api': {
    target: backendTarget,
    changeOrigin: true,
  },
} as const

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
})

