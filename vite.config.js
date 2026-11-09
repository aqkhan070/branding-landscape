import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0 — LAN IP pe bhi open (e.g. 192.168.18.247:5180)
    port: 5180,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5180,
    strictPort: true,
  },
});
