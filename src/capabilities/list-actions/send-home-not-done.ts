import type { Trello } from 'typings/trello';
import sendHome from './send-home';

const handler = async (trello: Trello.PowerUp.IFrame) => {
  const destinationListName = `Backlog`;
  await sendHome(trello, destinationListName);
  return trello.closePopup();
};

export default function(
  trello: Trello.PowerUp.IFrame
): Trello.PowerUp.ListAction {
  return {
    text: 'Send Home (Backlog)',
    callback: handler,
  };
}
