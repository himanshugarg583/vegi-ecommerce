import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // For GitHub Pages: use repo name, for local dev: use '/'
    base: command === 'build' ? '/ecommerce-vegi-react/' : '/',
  }
})
