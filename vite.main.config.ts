import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: ['src/main/main.ts'],
      formats: ['es'],
    },
    rollupOptions: {
      external: ['file-icon'],
    },
  },
  publicDir: path.join(__dirname, 'src', 'shared', 'static'),
  resolve: {
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
})
