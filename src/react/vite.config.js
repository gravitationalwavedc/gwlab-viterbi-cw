import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import relayPlugin from 'vite-plugin-relay';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), relayPlugin
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,  // Suppress warnings from dependencies
        warnOnUnusedVariables: false,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,  // Increase chunk size limit to reduce warnings
  },
  server: {
    port: 3000,
    strictPort: true,
  }
})
