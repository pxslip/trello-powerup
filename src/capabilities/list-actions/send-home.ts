import type { Trello } from 'typings/trello';

const handler = async (trello: Trello.PowerUp.IFrame) => {
  // get all cards in the current list, loop through and use the attached board to send them home
  const list = await trello.list('all');
  const rest = trello.getRestApi();
  for (const card of list.cards) {
    const originBoard = await trello.set(card.id, 'private', 'maint_origin_board');
  }
};

export default function sendHome(
  trello: Trello.PowerUp.IFrame
): Trello.PowerUp.ListAction {
  return {
    text: 'Send Home',
    callback: handler,
  };
}
