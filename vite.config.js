import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    // 🛡️ THE MAGIC FIX: Proxy API requests to Django
    proxy: {
      // Forward anything starting with /users to Django
      '/users': {
        target: 'https://farmflow-api-s521.onrender.com', // Django's default local address
        changeOrigin: true,
        secure: false,
      },
      // Forward anything starting with /api to Django (just in case!)
      '/api': {
        target: 'https://farmflow-api-s521.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  }
})