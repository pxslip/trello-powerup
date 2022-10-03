import { Trello } from '../typings/trello';

class State implements IState {
  #showMove: boolean = false;
  #showReturn: boolean = false;
  #labelMap: object = {};

  get showMove(): boolean {
    return this.#showMove;
  }
  set showMove(value: boolean) {
    this.#showMove = value;
  }

  get showReturn(): boolean {
    return this.#showReturn;
  }

  set showReturn(value: boolean) {
    this.#showReturn = value;
  }

  get labelMap(): object {
    return this.#labelMap;
  }

  set labelMap(value: object) {
    this.#labelMap = value;
  }

  async initialize(trello: Trello.PowerUp.IFrame) {
    const {
      board: { shared },
    }: { board: { shared: IState } } = await trello.getAll();
    this.#showMove = shared.showMove;
    this.#showReturn = shared.showReturn;
    this.#labelMap = shared.labelMap;
  }
}

export interface IState {
  showMove: boolean;
  showReturn: boolean;
  labelMap: object;
}

export async function initState(trello: Trello.PowerUp.IFrame) {
  const state = new State();
  await state.initialize(trello);
  return state;
}
