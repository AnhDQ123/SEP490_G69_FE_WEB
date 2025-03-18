import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    plugins: [react()],
    port: 5174, // hoặc cổng tùy chọn
  },
})
