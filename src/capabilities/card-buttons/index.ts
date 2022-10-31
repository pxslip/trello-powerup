import type { Trello } from '../../../typings/trello';
import sendHome from './send-home';

export default async function (
  t: Trello.PowerUp.IFrame
): Promise<
  (Trello.PowerUp.CardButton)[]
> {
  const buttons: Trello.PowerUp.CardButton[] = [
    await sendHome(t),
  ];
  return buttons;
}
