import type { Trello } from '../../typings/trello';
import capabilities from '../capabilities';

class State implements IState {
  #showMove: boolean = false;
  #showReturn: boolean = false;
  #labelMap: object = {};
  #trello: Trello.PowerUp.IFrame;

  constructor(trello: Trello.PowerUp.IFrame) {
    this.#trello = trello;
  }

  async store() {
    const values = {
      showMove: this.#showMove,
      showReturn: this.#showReturn,
      labelMap: this.#labelMap,
    };
    return await this.#trello.set('board', 'shared', values);
  }

  get showMove(): boolean {
    return this.#showMove;
  }
  set showMove(value: boolean) {
    this.#showMove = value;
    this.store();
  }

  get showReturn(): boolean {
    return this.#showReturn;
  }

  set showReturn(value: boolean) {
    this.#showReturn = value;
    this.store();
  }

  get labelMap(): object {
    return this.#labelMap;
  }

  set labelMap(value: object) {
    this.#labelMap = value;
    this.store();
  }

  async initialize() {
    const settings: { board: { shared: IState } } = await this.#trello.getAll();
    if (settings?.board?.shared) {
      const {
        board: { shared },
      }: { board: { shared: IState } } = settings;
      this.#showMove = shared.showMove;
      this.#showReturn = shared.showReturn;
      this.#labelMap = shared.labelMap;
    }
  }
}

export interface IState {
  showMove: boolean;
  showReturn: boolean;
  labelMap: object;
}

export const apiSettings = {
  appKey: 'your-app-key',
  appName: 'My Great Power-Up',
};

let state: State;

export async function initState(trello: Trello.PowerUp.IFrame) {
  if (!state) {
    state = new State(trello);
    await state.initialize();
  }
  return state;
}

export function initializeTrello(global: Window) {
  return global.TrelloPowerUp.initialize(capabilities(), apiSettings);
}

export function trelloIframe(global: Window) {
  return global.TrelloPowerUp.iframe(apiSettings);
}
