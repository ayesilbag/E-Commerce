import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'https://localhost:5001', changeOrigin: true, secure: false },
      '/login': { target: 'https://localhost:5001', changeOrigin: true, secure: false },
      '/refresh': { target: 'https://localhost:5001', changeOrigin: true, secure: false },
      '/uploads': { target: 'https://localhost:5001', changeOrigin: true, secure: false },
    },
  },
  build: {
    outDir: '../WebServer/wwwroot/admin',
    emptyOutDir: true,
  },
});
