import type { Trello } from '../../../typings/trello';
import sendHome from './send-home';

export default async function (
  t: Trello.PowerUp.IFrame
): Promise<
  (Trello.PowerUp.BoardButtonCallback | Trello.PowerUp.BoardButtonUrl)[]
> {
  const actions = [];
  actions.push(sendHome(t));
  return actions;
}
