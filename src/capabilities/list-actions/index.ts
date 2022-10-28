import type { Trello } from '../../../typings/trello';
import sendHomeDone from './send-home-done';

export default async function (
  t: Trello.PowerUp.IFrame
): Promise<
  Trello.PowerUp.ListAction[]
> {
  const actions = [];
  actions.push(sendHomeDone(t));
  return new Promise((resolve, reject) => {
    resolve(actions);
  });
}
