import boardButtons from './board-buttons';
import listActions from './list-actions';

import type { Trello } from '../../typings/trello';

export default function capabilities(): Trello.PowerUp.CapabilityHandlers {
  const capabilities = {
    'board-buttons': (t: Trello.PowerUp.IFrame) => boardButtons(t),
    'show-settings'(t: Trello.PowerUp.IFrame) {
      return t.modal({
        title: 'Maintenance PowerUp Settings',
        url: './settings.html',
      });
    },
    'list-actions'(t: Trello.PowerUp.IFrame){ return listActions(t)},
  };
  return capabilities;
}
