<template>
  <div class="text-center">
    <h1>USHMM Maintenance Settings</h1>
    <div v-if="authorized === undefined">{{ msg }}</div>
    <div v-else-if="authorized && hasState">
      <SettingsToggle
        label="Show Return"
        v-model="state.showReturn"
      ></SettingsToggle>
      <SettingsToggle
        label="Show Move"
        v-model="state.showMove"
      ></SettingsToggle>
    </div>
    <div v-else-if="!authorized">
      <button type="button" @click="beginAuthFlow">Authorize</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { initState } from '@/state';
import SettingsToggle from '@/components/SettingsToggle.vue';
import { inject, reactive, ref } from 'vue';
import type { Trello } from 'typings/trello';

const authorized = ref<boolean | undefined>(undefined);
const msg = ref('Loading...');

const trello = inject('trello') as Trello.PowerUp.IFrame;
let hasState = ref(false);
  let state;
const loadState = async () => {
  state = reactive(await initState(trello));
  hasState.value = true;
  console.log(state);
};
loadState(); //TODO: turn this into an iife (same thing below)
  
const loadAuthorized = async () => {
  try {
    authorized.value = await trello.getRestApi().isAuthorized();
  } catch {
    msg.value =
      "That's no settings page, that's an error! Looks like something went horribly wrong here...";
  }
};
loadAuthorized();

const beginAuthFlow = async () => {
  await trello.getRestApi().authorize({ scope: 'read' });
};
</script>

<style></style>
