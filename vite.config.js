import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
`    // VitePWA({
    //   registerType: "autoUpdate",
    //   includeAssets: ["favicon.svg", "favicon.ico", "robots.txt"],
    //   devOptions: {
    //     enabled: true,
    //     type: "classic"
    //   },
    //   workbox: {
    //     globPatterns: ["**/*.{js,jsx,css,ico,png,svg,webmanifest,html,webp}"],
    //     additionalManifestEntries: []
    //   },
    //   injectRegister: "auto",
    //   strategies: "generateSW"
    // })`
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  // server: {
  //   port: 3000,
  //   host: true
  // }
});
