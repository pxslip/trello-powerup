<template>
  <label class="block">
    {{ label }}
    <input
      type="checkbox"
      @input="toggle"
    />
  </label>
</template>

<script lang="ts" setup>
import { Events } from '~~/typings/events';

const t = useTrello();
const props = defineProps<{
  label: string;
  setting: string;
}>();

function toggle(event: Events.InputEvent) {
  t.set('board', 'shared', props.setting, event.target.value);
}
</script>
