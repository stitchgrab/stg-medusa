import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['flamingo-tough-blindly.ngrok-free.app/app', 'storefront-flamingo-tough-blindly.ngrok-free.app'],
  },
})  