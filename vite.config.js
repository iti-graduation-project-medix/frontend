import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";
import path from 'path';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "offline.html",
        "android/android-launchericon-144-144.png",
        "android/android-launchericon-192-192.png",
        "android/android-launchericon-48-48.png",
        "android/android-launchericon-512-512.png",
        "android/android-launchericon-72-72.png",
        "android/android-launchericon-96-96.png",
        "DawabackNewLogo.png",
        "apple-icon-180.png",
        "windows11/Square150x150Logo.scale-100.png",
        "windows11/Square150x150Logo.scale-150.png",
        "windows11/Square150x150Logo.scale-200.png",
        "windows11/Square150x150Logo.scale-400.png",
        "ios/100.png",
        "ios/1024.png",
        "ios/256.png",
        "ios/64.png",
        "fonts/*.ttf",
        "/imgs/steps.png",
        "/imgs/faqs.webp",
        "/imgs/newsletter.webp",
        "/imgs/whoWeAre.png",
        "/avatars/client1.webp",
        "/avatars/client2.webp",
        "/avatars/client3.webp",
        "/avatars/client4.webp",
      ],
      devOptions: {
        enabled: true,
        type: "classic",
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // Allow up to 6 MB for large font files
        disableDevLogs: true, // Disable Workbox console logs
        globPatterns: [
          "**/*.{js,jsx,css,ico,png,svg,webmanifest,html,webp,ttf}",
        ],
        // Fallback to index.html for navigation (SPA/PWA best practice)
        navigateFallback: "/",
        navigateFallbackDenylist: [
          // Exclude all requests for files with an extension (e.g. .js, .css, .png, .woff2, etc.)
          new RegExp("/[^/?]+\\.[^/]+$"),
          /^\/api\//,
        ],
        runtimeCaching: [
          {
            urlPattern: /\/fonts\/.*\.ttf$/,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
            },
          },

          {
            urlPattern: /\/offline\.html$/,
            handler: "CacheFirst",
            options: {
              cacheName: "offline-html",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/manifest\.json$/,
            handler: "CacheFirst",
            options: {
              cacheName: "manifest",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/favicon\.ico$/,
            handler: "CacheFirst",
            options: {
              cacheName: "favicon",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/index\.html$/,
            handler: "CacheFirst",
            options: {
              cacheName: "html",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/src\/main\.jsx$/,
            handler: "CacheFirst",
            options: {
              cacheName: "main-jsx",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/src\/index\.css$/,
            handler: "CacheFirst",
            options: {
              cacheName: "index-css",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/src\/pages\/Home\/Home\.jsx$/,
            handler: "CacheFirst",
            options: {
              cacheName: "home-jsx",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/src\/pages\/Home\/homeUtilities\.jsx$/,
            handler: "CacheFirst",
            options: {
              cacheName: "home-utils-jsx",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\/DawabackNewLogo\.png$/,
            handler: "CacheFirst",
            options: {
              cacheName: "logo",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      injectRegister: "auto",
      strategy: "generateSW",
      selfDestroying: true,
    }),
  ],
   optimizeDeps: {
    include: ['tw-merge']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      "services": fileURLToPath(new URL("../services", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/jest.setup.js',
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    historyApiFallback: true,
  },
  build: {
    chunkSizeWarningLimit: 3000, // 3MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("src/pages/")) {
            return "pages";
          }
        },
      },
    },
  },
});
