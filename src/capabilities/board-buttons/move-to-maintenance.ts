import { initState } from '@/state';
import type { Trello } from 'typings/trello';

export default async function moveToMaintenance(
  trello: Trello.PowerUp.IFrame
): Promise<Trello.PowerUp.BoardButtonCallback | null> {
  const state = await initState(trello);
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
            url: './settings.html',
          });
        },
      }
    : null;
}
