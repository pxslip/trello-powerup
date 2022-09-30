<template>
  <label class="block">
    {{ label }}
    <input
      type="checkbox"
      :value="settingValue"
      @input="toggle"
    />
  </label>
</template>

<script lang="ts" setup>
import { Ref } from 'vue';
import { useSetting, State } from '~~/composables/state';
import { Events } from '~~/typings/events';

const t = useTrello();
const props = defineProps<{
  label: string;
  setting: keyof State;
}>();

const settingValue = (await useSetting(props.setting)) as Ref<boolean>;

function toggle(event: Events.InputEvent) {
  t.set('board', 'shared', props.setting, event.target.value);
}
</script>
