import { Trello } from './trello';

export {};

declare global {
  interface Window {
    TrelloPowerUp: Trello.PowerUp;
  }
}
