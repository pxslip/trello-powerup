import { computed, reactive } from 'vue';
import type { Trello } from '../../typings/trello';
import capabilities from '../capabilities';
import appKey from './key';
import Api from './trello';

export interface LabelMapItem {
  labelId: string;
  boardId: string;
}

export interface IState {
  sourceList: string;
  destinationBoard: string;
  destinationList: string;
  label: string;
  filterLabels: string[];
  labelMap: LabelMapItem[];
}

export const ORIGIN_BOARD_ATTACHMENT_NAME = 'origin_maint_board';

export const state: IState = reactive({
  showMove: true,
  sourceList: '',
  destinationBoard: '',
  destinationList: '',
  label: '',
  filterLabels: [],
  labelMap: [],
});

export const store = async (trello: Trello.PowerUp.IFrame) => {
  return await trello.set('board', 'shared', { ...state });
}

export const loadState = async (trello: Trello.PowerUp.IFrame) => {
  const settings: { board: { shared: IState } } = await trello.getAll();
  if (settings?.board?.shared) {
    const {
      board: { shared },
    }: { board: { shared: IState } } = settings;
    Object.assign(state, shared);
  }
  return state;
};

export const computeds = (trello: Trello.PowerUp.IFrame) => {
  void loadState(trello); //eventually consistent with the stored state
  return {
    labelMap: computed({
      get() {
        return state.labelMap;
      },
      set(value: LabelMapItem[]) {
        state.labelMap = value;
        store(trello);
      }
    }),
  }
}

export const apiSettings = {
  appKey,
  appName: 'USHMM PowerUps',
};
let api: Api;
export async function getApi(trello: Trello.PowerUp.IFrame) {
  const card = await trello.card('id');
  if (!api) {
    let authorized = await trello.getRestApi().isAuthorized();
    if (!authorized) {
      // assuming the modal only returns once the promise is resolved...
      return await trello.modal({
        url: './authorize.html',
        title: 'Authorize USHMM Maintenance PowerUp',
        args: {
          cardId: card.id
        }
      });
    } else {
      const token = await trello.getRestApi().getToken();
      if (token) {
        return new Api(appKey, token);
      } else {
        throw new Error('Token not set when authorizing the Rest API');
      }
    }
  }
  return api;
}

export function initializeTrello(global: Window) {
  return global.TrelloPowerUp.initialize(capabilities(), apiSettings);
}

export function trelloIframe(global: Window) {
  return global.TrelloPowerUp.iframe(apiSettings);
}
