import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@core": path.resolve(__dirname, "src/core"),
      "@ui": path.resolve(__dirname, "src/core/ui"),
      "@design": path.resolve(__dirname, "src/core/design"),
      "@features": path.resolve(__dirname, "src/features"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@types": path.resolve(__dirname, "src/types"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@pages": path.resolve(__dirname, "src/core/ui/pages"),
      "@layout": path.resolve(__dirname, "src/core/ui/layout"),
      "@auth": path.resolve(__dirname, "src/auth"),
      "@hooks": path.resolve(__dirname, "src/core/ui/hooks"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});