import { getApi, loadState } from '@/state';
import type { Trello } from 'typings/trello';

const handler = async (trello: Trello.PowerUp.IFrame) => {
  const card = await trello.card('all');
  const state = await loadState(trello);
  const map = state.labelMap.find((item) => card.labels.some((label) => item.labelId === label.id));
  if (map) {
    const api = await getApi(trello);
    if (api) {
      const lists = await api.board.lists(map.boardId);
      if (lists) {
        const list = lists.find((list) => list.name === 'Backlog');
        if (list) {
          const resp = await api.card.moveCard(card.id, map.boardId, list.id);
          if (resp) {
            trello.hideCard();
          }
        }
      }
    }
  }
}

export default async function(
  trello: Trello.PowerUp.IFrame
): Promise<Trello.PowerUp.CardButton> {
  const icon = new URL('home.svg', window.location.href);
  return {
    text: 'Send Home',
    icon: icon.href,
    callback: handler,
  };
}