import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue({
        template: {
          transformAssetUrls: {
            base: '/src'
          }
        },
      })
  ],
  build: {
    rollupOptions: {
      input: 'src/main.ts',
      preserveEntrySignatures: 'strict',
      output: {
        format: 'system',
        entryFileNames: 'fe-layout.js',
      },
    },
  },
  base: '/micro-fe/layout',
  server: {
    origin: 'http://localhost:8001',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/assets/scss/main.scss';`
      }
    }
  }
})
