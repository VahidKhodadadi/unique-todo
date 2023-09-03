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
      includeAssets: ['favicons/favicon-16.png', 'favicons/favicon-32.png', 'favicons/favicon-96.png', 'favicons/favicon-128.png', 'favicons/favicon-256.png', 'favicons/favicon-512.png'],
      manifest: {
        name: 'Unique Todo app',
        short_name: 'Unique Todo',
        description: 'A simple todo app for managing daily works',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicons/favicon-16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: 'favicons/favicon-32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'favicons/favicon-64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'favicons/favicon-96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'favicons/favicon-128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'favicons/favicon-256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'favicons/favicon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
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
