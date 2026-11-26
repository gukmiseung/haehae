import kisaSummary from './api/kisa-summary.js'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'local-kisa-summary',
    configureServer(server) {
      server.middlewares.use('/api/kisa-summary', kisaSummary)
    },
  }],
})
