import moveToMaintenance from './move-to-maintenance';
import type { Trello } from '../../../typings/trello';

export default function (
  t: Trello.PowerUp.IFrame
): PromiseLike<
  (Trello.PowerUp.BoardButtonCallback | Trello.PowerUp.BoardButtonUrl)[]
> {
  return new Promise((resolve) => {
    Promise.all([moveToMaintenance(t)]).then((buttons) =>
      resolve(buttons.filter((button) => button !== null))
    );
  });
}
