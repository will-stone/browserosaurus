import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config
export default defineConfig({
  optimizeDeps: {
    force: true,
  },
  root: path.join(__dirname, 'src', 'renderers', 'picker'),
})
