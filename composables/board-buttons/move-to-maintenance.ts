import { useShowMove } from '../state';

import { Trello } from '~~/typings/trello';

export default async function moveToMaintenance(
  _t: Trello.PowerUp.IFrame
): Promise<Trello.PowerUp.BoardButtonCallback> | null {
  const show = await useShowMove();
  return show
    ? {
        text: 'Move to Maintenance',
        icon: {
          dark: '',
          light: '',
        },
        callback(t: Trello.PowerUp.IFrame) {
          return t.modal({
            title: 'Test',
            url: './second',
          });
        },
      }
    : null;
}
