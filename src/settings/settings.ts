import { createApp } from 'vue';
import Settings from './Settings.vue';
import '../index.css';
import { trelloIframe } from '../state';

const app = createApp(Settings);
app.provide('trello', trelloIframe(window));
app.mount('#app');
