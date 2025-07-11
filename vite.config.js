import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt"],
      devOptions: {
        enabled: true,
        type: "classic"
      },
      workbox: {
        globPatterns: ["**/*.{js,jsx,css,ico,png,svg,webmanifest,html,webp}"],
        additionalManifestEntries: []
      },
      injectRegister: "auto",
      strategies: "generateSW",
      srcDir: "src",
      outDir: "dist"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
