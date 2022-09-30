import { NitroApp } from 'nitropack';

export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.push('<script src="https://p.trellocdn.com/power-up.min.js"></script>');
    html.head.push('<link rel="stylesheet" href="https://p.trellocdn.com/power-up.min.css">');
  });
});
