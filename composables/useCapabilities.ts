import boardButtons from './board-buttons';
import { Trello } from '~~/typings/trello';

export default function useCapabilities(): Trello.PowerUp.CapabilityHandlers {
  return {
    'board-buttons': (t) => boardButtons(t),
    'show-settings'(t) {
      return t.modal({
        title: 'Maintenance PowerUp Settings',
        url: '/settings',
      });
    },
  };
}
