<template>
  <label class="block">
    {{ label }}
    <input type="checkbox" :value="modelValue" @input="toggle" />
  </label>
</template>

<script lang="ts" setup>
const props = defineProps<{
  label: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

function toggle(payload: Event) {
  emit('update:modelValue', (payload.target as HTMLInputElement)?.value);
}
</script>
