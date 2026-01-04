import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // WICHTIG FÜR GITHUB PAGES: Macht alle Pfade relativ
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'FairShare Party Splitter',
        short_name: 'FairShare',
        description: 'Teile Rechnungen fair und einfach',
        theme_color: '#18181b',
        background_color: '#18181b',
        display: 'standalone',
        // WICHTIG: Hier auch relative Pfade nutzen!
        scope: './',
        start_url: './',
        orientation: 'portrait',
        icons: [
          {
            // Slash am Anfang entfernt, damit er im aktuellen Ordner sucht
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})