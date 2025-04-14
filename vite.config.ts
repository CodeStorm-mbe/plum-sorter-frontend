<<<<<<< HEAD
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
})

=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import process from "node:process"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  define: {
    "process.env": {}, // Polyfill pour process.env
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
      '@store': path.resolve(__dirname, './src/store'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: `${process.env.REACT_APP_API_URL}`,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
>>>>>>> 52b038ca4bba93cc54a40159cc8eb8c0fdc11314
