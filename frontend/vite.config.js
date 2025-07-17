import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

if (!globalThis.crypto) {
  const crypto = require('crypto');
  globalThis.crypto = crypto.webcrypto;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
