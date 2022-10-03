<template>
  <label class="block">
    {{ label }}
    <input type="checkbox" :value="modelValue" @input="toggle" />
  </label>
</template>

<script lang="ts" setup>
import { Events } from '../../typings/events';

const props = defineProps<{
  label: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

function toggle(payload: Events.InputEvent) {
  emit('update:modelValue', payload.target?.value);
}
</script>
