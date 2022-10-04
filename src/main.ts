import capabilities from './capabilities';

const trello = globalThis.window.TrelloPowerUp.initialize(capabilities(), {
  appKey: 'f6a8a5dd11e067d43c9f2ba3355e8ef4',
  appName: 'USHMM PowerUps',
});
