import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    open: true, // Automatically opens in the browser
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
