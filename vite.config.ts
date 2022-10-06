import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/trello-powerups/',
  root: './src/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html'),
        settings: resolve(__dirname, 'src', 'settings', 'settings.html'),
      },
    },
  },
  plugins: [vue()],
});
