import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: '.', // Set the root directory to the public folder
  base: './', // Use relative paths for Electron compatibility
  publicDir: '/public', // Explicitly set the public directory
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias for the src directory
    },
  },
  build: {
    outDir: './build', // Output directory relative to the public folder
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
