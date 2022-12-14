import type { Trello } from 'typings/trello';
import sendHome from './send-home';

const handler = async (trello: Trello.PowerUp.IFrame) => {
  const date = (new Date()).toISOString().split('T')[0];
  const destinationListName = `Done (${date})`
  await sendHome(trello, destinationListName);
  return trello.closePopup();
};

export default function(
  trello: Trello.PowerUp.IFrame
): Trello.PowerUp.ListAction {
  return {
    text: 'Send Home (Done)',
    callback: handler,
  };
}
