import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_HOST,
    port: Number(process.env.VITE_PORT),
    strictPort: true,
    https:
      process.env.VITE_HTTPS === "true"
        ? {
            key: fs.readFileSync(
              path.resolve(__dirname, process.env.VITE_SSL_KEY || ""),
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, process.env.VITE_SSL_CERT || ""),
            ),
          }
        : undefined,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
  },
});
