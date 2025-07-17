import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

if (!globalThis.crypto) {
  const { webcrypto } = await import('crypto');
  globalThis.crypto = webcrypto;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
