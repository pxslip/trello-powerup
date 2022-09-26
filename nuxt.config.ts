import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  head: {
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    script: [{ src: 'https://p.trellocdn.com/power-up.min.js' }],
    link: [{ rel: 'stylesheet', href: 'https://p.trellocdn.com/power-up.min.css' }],
  },
});
