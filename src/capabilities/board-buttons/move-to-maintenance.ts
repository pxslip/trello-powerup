import {loadState} from '@/state';
import type { Trello } from 'typings/trello';

const handler = (trello: Trello.PowerUp.IFrame) => {
  // find all cards in the list named Backlog
};

export default async function moveToMaintenance(
  trello: Trello.PowerUp.IFrame
): Promise<Trello.PowerUp.BoardButtonCallback | null> {
  const state = await loadState(trello);
  console.log(state);
  return state.showMove
    ? {
        text: 'Move to Maintenance',
        icon: {
          dark: '',
          light: '',
        },
        callback(t: Trello.PowerUp.IFrame) {
          return t.modal({
            title: 'Test',
            url: './move-to-maintenance.html',
          });
        },
      }
    : null;
}
