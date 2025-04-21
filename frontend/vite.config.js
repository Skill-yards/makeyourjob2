import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: 'localhost', // Explicit localhost
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 5173, // Match server port
      protocol: 'ws', // Regular WebSocket for localhost
      overlay: false
    }
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Add these for better error handling
  define: {
    'process.env': {}
  }
});