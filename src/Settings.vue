<script setup lang="ts">
import { initState } from './state';
import SettingsToggle from './components/SettingsToggle.vue';

const state = await initState(window.TrelloPowerUp.iframe());
</script>

<template>
  <div class="text-center selection:bg-green-100">
    <h1>USHMM Maintenance Settings</h1>
    <SettingsToggle
      label="Show Return"
      v-model="state.showReturn"
    ></SettingsToggle>
  </div>
</template>

<style></style>
