import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // A production build without the API URL would silently talk to localhost
  if (mode === 'production') {
    const env = loadEnv(mode, process.cwd(), '')
    if (!env.VITE_API_URL && !process.env.VITE_API_URL) {
      throw new Error('VITE_API_URL is not set. Set it to your deployed API, e.g. https://api.example.com/api')
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  }
})
