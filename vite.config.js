import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["favicon.ico", "offline.html", "apple-icon-180.png", "masked-icon.svg"],
      manifest: {
        name: "Dawaback - Medical Exchange App",
        short_name: "Dawaback",
        description: "Medical Exchange App",
        start_url: "/",
        display: "standalone",
        background_color: "#feb73f",
        theme_color: "#636ae8",

        icons: [
          {
            src: "/ios/64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/ios/100.png",
            sizes: "100x100",
            type: "image/png",
            purpose: "any"
          },

          {
            src: "/ios/256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any"
          },

          {
            src: "/ios/1024.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android/android-launchericon-144-144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android/android-launchericon-96-96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android/android-launchericon-72-72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/android/android-launchericon-48-48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any"
          },

          {
            src: "/icons/windows11/Square150x150Logo.scale-100.png",
            sizes: "150x150",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/windows11/Square150x150Logo.scale-150.png",
            sizes: "225x225",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/windows11/Square150x150Logo.scale-200.png",
            sizes: "300x300",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/windows11/Square150x150Logo.scale-400.png",
            sizes: "600x600",
            type: "image/png",
            purpose: "any"
          },

          {
            purpose: "maskable",
            sizes: "512x512",
            src: "icon512_maskable.png",
            type: "image/png"
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "icon512_rounded.png",
            type: "image/png"
          }
        ]
      },
      devOptions: {
        enabled: true
      },

      workbox: {
        navigateFallback: "/offline.html",
        globPatterns: ["**/*.{js,css,html,ico,png,webp,svg}"],
        globIgnores: ["**/node_modules/**/*"],

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              expiration: {
                maxEntries: 50
              }
            }
          },
          {
            urlPattern: ({ request }) =>
              ["style", "script", "worker"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets",
              expiration: {
                maxEntries: 50
              }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 50
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html")
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  server: {
    historyApiFallback: true
  }
});
