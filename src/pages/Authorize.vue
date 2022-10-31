<template>
  <div class="text-center px-2">
    <h1>Authorize USHMM Maintenance Trello PowerUp</h1>
    <button class="w-full" type="button" @click="authorize">Authorize</button>
  </div>
</template>

<script setup lang="ts">
import {beginAuthFlow} from '@/state/trello';
import { inject } from 'vue';

const trello = inject('trello') as Trello.PowerUp.IFrame;
const authorize = async () => {
  const state = await beginAuthFlow(trello);
  if (state) {
    // check if a card was the originator, if so re-open it
    const cardId = trello.arg('cardId');
    if (cardId) {
      trello.showCard(cardId);
    } else {
      trello.closeModal();
    }
  }
}
</script>

<style></style>
