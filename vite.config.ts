import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Serve dev site on the same hostname as backend so cookies are same-origin.
    host: 'app.zeroday.test',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs', 'app.zeroday.test-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'app.zeroday.test.pem')),
    },
    proxy: {
      '/api': {
        target: 'https://api.zeroday.test',
        changeOrigin: true,
        secure: false,
      },
      '/sanctum': {
        target: 'https://api.zeroday.test',
        changeOrigin: true,
        secure: false,
      },
    },
  },

})
