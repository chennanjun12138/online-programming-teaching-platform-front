import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  test:{
      environment:"jsdom"
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    port:7100,
    host: true,
    open:true,
    proxy: {
      '/api': {
          //  target: 'http://192.168.3.18:8080/',
        target:'http://192.168.56.1:8080/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      }
    }
  },

})
