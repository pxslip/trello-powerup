import type { Trello } from 'typings/trello';

import key from '@/state/key';
import Api from '@/state/trello';
import {ORIGIN_BOARD_ATTACHMENT_NAME, loadState} from '@/state';

const handler = async (trello: Trello.PowerUp.IFrame) => {
  // get all cards in the current list, loop through and use the attached board to send them home
  const authorized = await trello.getRestApi().isAuthorized();
  if (authorized) {
    const date = (new Date()).toISOString().split('T')[0];
    const destinationListName = `Done (${date})`
    const token = await trello.getRestApi().getToken();
    const api = new Api(key, token);  
    const list = await trello.list('cards');
    const actions: {card: object, board: string} = [];
    const listCache: {[boardId: string]: object[]} = {};
    let attachment;
    let label;
    for (const card of list.cards) {
      let board;
      for (const attach of card.attachments) {
        if (attach.name === ORIGIN_BOARD_ATTACHMENT_NAME) {
          board = attach.url.match(/trello\.com\/b\/([\w\d]+)\//i)[1];
          // remove the attachment
          attachment = attach;
          break;
        }
      }
      if (!board) {
        // try to use the label map to find a destination
        const state = await loadState(trello);
        const boardMap = state.labelMap.find((map) => {
          return card.labels.some((label) => {
            return label.id === map.labelId;
          });
        });
        board = boardMap.boardId;
        label = boardMap.labelId;
      }
  
      if (board) {
        actions.push({card, board, label, attachment});
      }
    }
    const cancel = globalThis.setInterval(async () => {
      if (actions.length === 0) {
        globalThis.clearInterval(cancel);
      } else {
        const action = actions.pop();
        if (action) {
          // find or create an appropriate done column
          let lists = [];
          if (listCache[action.board]) {
            lists = listCache[action.board];
          } else {
            lists = await api.board.lists(action.board);
            listCache[action.board] = lists;
          }
          
          let destination = lists.find((list) => list.name === destinationListName);
          if (!destination) {
            let resp = await api.list.create(destinationListName, action.board);
            if (resp.ok) {
              // get the list data because the api is dumb and won't return the id of the newly created list
              listCache[action.board] = lists = await api.board.lists(action.board);
              destination = lists.find((list) => list.name === destinationListName);
              if (!destination) {
                console.error(`No destination was found, skipping ${action.card.name}`);
              }
            }
          }
          if (action.attachment) {
            await api.card.deleteAttachment(action.card.id, action.attachment.id);
          }
          const resp = await api.card.moveCard(action.card.id, action.board, destination.id);
        }
      }
      
    }, 500);
  }
};

export default function sendHomeDone(
  trello: Trello.PowerUp.IFrame
): Trello.PowerUp.ListAction {
  return {
    text: 'Send Home',
    callback: handler,
  };
}
