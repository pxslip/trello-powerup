import { defineNuxtConfig } from 'nuxt/config';
console.log(process.env.NUXT_APP_BASE_URL);

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
  },
});
