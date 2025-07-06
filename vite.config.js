import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'static',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}) 