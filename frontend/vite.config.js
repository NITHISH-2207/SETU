import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        profile: 'setu-tata-csr-profile.html',
        payment: 'payment.html',
        contribute: 'contribute.html',
      },
    },
  },
})
