import moveToMaintenance from './move-to-maintenance';
import type { Trello } from '../../../typings/trello';

export default async function (
  t: Trello.PowerUp.IFrame
): Promise<
  (Trello.PowerUp.BoardButtonCallback | Trello.PowerUp.BoardButtonUrl)[]
> {
  const buttons = [];
  const mtmBtn = await moveToMaintenance(t);
  if (mtmBtn !== null) {
    buttons.push(mtmBtn);
  }
  return buttons;
}
