import useTrello from './useTrello';

export interface State {
  showMove: boolean;
  showReturn: boolean;
  labelMap: object;
}

const defaults: State = {
  showMove: true,
  showReturn: false,
  labelMap: {},
};

export const useSettings = async () => {
  const t = useTrello();
  const settings = (await t.get('board', 'shared', 'ushmm_maint', defaults)) as State;
  return ref(settings);
};

export const useSetting = async (setting: keyof State | undefined) => {
  const settings = await useSettings();
  if (!setting) {
    return settings;
  }
  return ref(settings[setting]);
};
