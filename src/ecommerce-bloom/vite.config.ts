import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/** Local backend — Admin ile aynı API (dotnet run WebServer) */
const DEV_API_TARGET = "https://localhost:5001";

export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: false,
    proxy: {
      // API endpoints
      "/api": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // Payments endpoint
      "/payments": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // Shipping endpoint
      "/shipping": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // Auth endpoints (without /api prefix)
      "/login": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[PROXY ERROR] login:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`[PROXY] ${req.method} ${req.url} -> ${_options.target}${req.url}`);
          });
        },
      },
      "/register": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/refresh": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/logout": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/forgotPassword": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/resetPassword": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/manage": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // Static assets
      "/uploads": {
        target: DEV_API_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));