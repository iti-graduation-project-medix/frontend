import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify("http://localhost:3000")
  },

  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    globals: true,
  },
  testEnvironment: "jsdom",
  setupFiles: ["./src/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["@babel/preset-env"] }]
  },
  testMatch: ["**/*.test.{js,jsx,ts,tsx}", "**/?(*.)+(spec|test).{js,jsx,ts,tsx}"],
  globals: true,
  watchPlugins: ["vitest-plugin-watch"]
});
