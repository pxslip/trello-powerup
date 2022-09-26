import { Trello } from '~~/typings/trello';

export default function moveToMaintenance(_t: Trello.PowerUp.IFrame): Trello.PowerUp.BoardButtonCallback {
  return {
    text: 'Move to Maintenance',
    icon: {
      dark: '',
      light: '',
    },
    callback(t: Trello.PowerUp.IFrame) {
      return t.modal({
        title: 'Test',
        url: './second.vue',
      });
    },
  };
}
