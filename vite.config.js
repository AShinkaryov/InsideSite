import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Игнорируем служебную папку Visual Studio (.vs) и node_modules, чтобы Vite не выдавал ошибку EBUSY
      ignored: ['**/.vs/**', '**/node_modules/**']
    }
  }
})