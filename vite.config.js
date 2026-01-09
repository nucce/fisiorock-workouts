import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/fisiorock-workouts/',
  plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'Fisio Rock',
          short_name: 'FisioRock',
          start_url: '/fisiorock-workouts/',
          scope: '/fisiorock-workouts',
          display: 'standalone',
          background_color: '#111111',
          theme_color: '#111111',
          icons: [
            {
              src: '/fisiorock-workouts/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            }, {
              src: '/fisiorock-workouts/icons/icon-maskable-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            }, {
              src: '/fisiorock-workouts/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            }, {
              src: '/fisiorock-workouts/icons/icon-maskable-192.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          navigateFallback: '/fisiorock-workouts/offline.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              //Network-first per CSS
              urlPattern: ({request}) => request.destination === 'style',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'css-cache',
                expiration: {maxEntries: 20, maxAgeSeconds: 7 * 24 * 3600},
              }
            }, {
              //Cache-first per l'Excel
              urlPattern: ({url}) => url.pathname.endsWith('fisiorock_block1.xlsx'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'xlsx-cache',
                expiration: {maxEntries: 5, maxAgeSeconds: 90 * 24 * 3600},
              }
            }
          ]
        }
      })
  ],
});
