import {loadState} from '@/state';
import type { Trello } from 'typings/trello';

const handler = (trello: Trello.PowerUp.IFrame) => {
  // find all cards in the list named Backlog
};

export default async function moveToMaintenance(
  trello: Trello.PowerUp.IFrame
): Promise<Trello.PowerUp.BoardButtonCallback> {
  return {
        text: 'Move to Maintenance',
        icon: {
          dark: '',
          light: '',
        },
        callback(t: Trello.PowerUp.IFrame) {
          return t.modal({
            title: 'Move Cards to Maintenance Board',
            url: './move-to-maintenance.html',
            height: 600,
          });
        },
    };
}
