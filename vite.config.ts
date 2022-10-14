import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { createMpaPlugin } from 'vite-plugin-virtual-mpa';
import vue from '@vitejs/plugin-vue';

const publicPath = resolve(__dirname, 'public');
// https://vitejs.dev/config/
export default defineConfig({
  base: '/trello-powerups/',
  build: {
    emptyOutDir: true,
  },
  plugins: [vue(), createMpaPlugin({
      pages: [
        { name: 'main', filename: 'index.html', entry: '/src/main.ts' },
        {
          name: 'settings',
          filename: 'settings.html',
          entry: '/src/settings.ts',
        },
      ],
    }),],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
