import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rolldownOptions: {
      input: {
        popup: path.resolve(__dirname, "popup.html"),
        bookmark: path.resolve(__dirname, "index.html"),
      },
    },
  },
  publicDir: "public",
});
