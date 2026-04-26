import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        focusflow: resolve(__dirname, 'focusflow.html'),
        colorcraft: resolve(__dirname, 'colorcraft.html'),
        contextme: resolve(__dirname, 'contextme.html'),
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
