import boardButtons from './board-buttons';

import type { Trello } from '../../typings/trello';

export default function capabilities() {
  const capabilities = {
    'board-buttons': (t: Trello.PowerUp.IFrame) => boardButtons(t),
    'show-settings'(t: Trello.PowerUp.IFrame) {
      return t.modal({
        title: 'Maintenance PowerUp Settings',
        url: './settings',
      });
    },
  };
  return capabilities;
}
