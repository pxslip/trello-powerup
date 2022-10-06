import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const publicPath = resolve(__dirname, 'public');
// https://vitejs.dev/config/
export default defineConfig({
  base: '/trello-powerups/',
  root: 'public/',
  build: {
    emptyOutDir: true,
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(publicPath, 'index.html'),
        settings: resolve(publicPath, 'settings.html'),
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
