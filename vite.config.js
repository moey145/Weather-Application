import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  define: {
    __VITE_OPENWEATHER_API_KEY__: JSON.stringify(process.env.VITE_OPENWEATHER_API_KEY)
  }
})