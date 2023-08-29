import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon-16.png', 'favicon-32.png', 'favicon-96.png'],
      manifest: {
        name: 'Unique Todo app',
        short_name: 'Unique Todo',
        description: 'A simple todo app for managing daily works',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon-144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'favicon-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'favicon-32.png',
            sizes: '32x32',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
