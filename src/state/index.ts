import { computed, reactive } from 'vue';
import type { Trello } from '../../typings/trello';
import capabilities from '../capabilities';

export interface IState {
  showMove: boolean;
  showReturn: boolean;
  labelMap: object;
}

export const state: IState = reactive({
  showMove: false,
  showReturn: false,
  labelMap: {},
});

const store = async (trello: Trello.PowerUp.IFrame) => {
  return await trello.set('board', 'shared', {...state});
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
    showMove: computed({
      get() {
        return state.showMove;
      },
      set(value: boolean) {
        state.showMove = value;
        store(trello);
      }
    }),
    showReturn: computed({
      get() {
        return state.showReturn
      },
      set(value: boolean) {
        state.showReturn = value;
        store(trello);
      }
    }),
    labelMap: computed({
      get() {
        return state.labelMap;
      },
      set(map: object) {
        state.labelMap = map;
        store(trello);
      }
    })
  }
}

export function moveCardToBoard(trello: Trello.PowerUp.IFrame) {
  
}

export const apiSettings = {
  appKey: 'f6a8a5dd11e067d43c9f2ba3355e8ef4',
  appName: 'USHMM PowerUps',
};

export function initializeTrello(global: Window) {
  return global.TrelloPowerUp.initialize(capabilities(), apiSettings);
}

export function trelloIframe(global: Window) {
  return global.TrelloPowerUp.iframe(apiSettings);
}
