import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // เปลี่ยนจาก './'
  build: {
    outDir: 'build',
    sourcemap: true
  }
})