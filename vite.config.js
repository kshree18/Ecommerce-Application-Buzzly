import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteAliases } from 'vite-aliases'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),  ViteAliases()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
