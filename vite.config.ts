import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '10.10.0.3',
    port: 3000,
    allowedHosts: ['10.10.0.3', 'localhost'],

  },

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 3000
  }
});
