import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "hls.js",
        replacement: fileURLToPath(new URL("./node_modules/hls.js/dist/hls.js", import.meta.url))
      }
    ]
  },
  optimizeDeps: {
    include: ["hls.js"]
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  }
});
