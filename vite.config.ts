import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'] }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
})