import { createApp } from 'vue';
import App from './Authorize.vue';
import '@/assets/index.css';
import { trelloIframe } from '@/state';

const app = createApp(App);
app.provide('trello', trelloIframe(globalThis.window));
app.mount('#app');
