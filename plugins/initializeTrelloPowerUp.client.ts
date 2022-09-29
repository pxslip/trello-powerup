import { Trello } from '~~/typings/trello';

let trello: Trello.PowerUp.IFrame;

export default defineNuxtPlugin(() => {
  const initTrello = () => {
    const caps = useCapabilities();
    if (!trello) {
      trello = globalThis.window.TrelloPowerUp.initialize(caps) as Trello.PowerUp.IFrame;
    }
    return {
      provide: {
        trello,
        initTrello,
      },
    };
  };
  return initTrello();
});
