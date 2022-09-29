import useTrello from './useTrello';

interface State {
  showMove: boolean;
  showReturn: boolean;
  labelMap: object;
}

const defaults: State = {
  showMove: true,
  showReturn: false,
  labelMap: {},
};

export const useSettings = () => {
  return useAsyncData(
    'settings',
    async () => {
      const t = useTrello();
      const settings = (await t.get('board', 'shared', 'ushmm_maint', defaults)) as State;
      useState('showMove');
      return settings;
    },
    { server: false }
  );
};

export const useShowMove = () => {
  return useAsyncData(
    'showMove',
    async () => {
      const { data, error } = await useSettings();
      if (!error.value) {
        const { showMove } = data.value;
        return ref(showMove);
      } else {
        const t = useTrello();
        t.alert({
          message: `Woah, that's a negative ghost rider. Something just broke`,
        });
        console.error(error);
      }
    },
    { server: false }
  );
};
