<script setup lang="ts">
import { initState } from '../state';
import SettingsToggle from '../components/SettingsToggle.vue';
import { inject, reactive } from 'vue';
import type { Trello } from '../../typings/trello';

const trello = inject('trello') as Trello.PowerUp.IFrame;
const state = reactive(await initState(trello));
const authorized = await trello.getRestApi().isAuthorized();

const beginAuthFlow = async () => {
  await trello.getRestApi().authorize({ scope: 'read' });
};
</script>

<template>
  <div class="text-center selection:bg-green-100">
    <h1>USHMM Maintenance Settings</h1>
    <template v-if="authorized">
      <SettingsToggle
        label="Show Return"
        v-model="state.showReturn"
      ></SettingsToggle>
      <SettingsToggle
        label="Show Move"
        v-model="state.showMove"
      ></SettingsToggle>
    </template>
    <template v-else>
      <button type="button" @click="beginAuthFlow">Authorize</button>
    </template>
  </div>
</template>

<style></style>
