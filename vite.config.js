import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'frontend/public',
  build: {
    rollupOptions: {
      input: {
        app: 'index.html',
        profile: 'setu-tata-csr-profile.html',
        payment: 'payment.html',
        paymentOptions: 'payment-options.html',
        contribute: 'contribute.html',
      },
    },
  },
})