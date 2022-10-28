<template>
  <div>
    <div class="mx-3" :class="[{overlay: isLoading}]" v-if="authorized">
        <label class="w-full">Source List
        <select class="w-full" v-model="selectedSource">
          <option v-for="list in sourceLists" :value="list.id">{{list.name}}</option>
        </select>
      </label>
      <label class="w-full">Labels to Move
        <select class="w-full" multiple v-model="selectedFilterLabels">
          <option v-for="label in labels" :value="label.id">{{label.name}} ({{label.color}})</option>
        </select>
      </label>
      <label class="w-full">Destination Board
        <select class="w-full" v-model="selectedDestinationBoard" @change="updateDestinationLists">
          <option v-for="board in boards" :value="board.id">{{board.name}}</option>
        </select>
      </label>
      <label class="w-full">Destination List
        <select class="w-full" v-model="selectedDestinationList" :disabled="destinationLists.length < 1">
          <option v-for="list in destinationLists" :value="list.id">{{list.name}}</option>
        </select>
      </label>
      <label class="w-full">Label to attach
        <select class="w-full" v-model="selectedLabel">
          <option v-for="label in labels" :value="label.id">{{label.name}} ({{label.color}})</option>
        </select>
      </label>
      <label><input type="checkbox" v-model="saveSettings" class="mt-0 mr-2 align-text-top"> Save for next time?</label>
      <button type="button" class="mod-primary" @click="moveCards">Move Cards</button>
      <button type="button" @click="trello.closeModal()">Cancel</button>
    </div>
    <div class="mx-auto text-center" v-else>
      <button class="w-60 my-5" type="button" @click="beginAuthFlow(trello)">Authorize</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Api, {beginAuthFlow} from '@/state/trello';
import key from '@/state/key';
import {loadState, state, store, ORIGIN_BOARD_ATTACHMENT_NAME} from '@/state';
import { inject, ref } from 'vue';
  
const trello = inject('trello') as Trello.PowerUp.IFrame;
const authorized = ref<boolean | undefined>(undefined);
const sourceLists = ref<{id: string, name: string}[]>([]);
const selectedSource = ref<string>('');
const selectedFilterLabels = ref<string[]>([]);
const boards = ref<{id: string, name: string}[]>([]);
const selectedDestinationBoard = ref<string>('');
const labels = ref<{id: string, name: string, color: string}[]>([]);
const selectedLabel = ref<string>('');
const destinationLists = ref<{id: string, name: string}[]>([]);
const selectedDestinationList = ref<string>('');
const saveSettings = ref<boolean>(true);
const isLoading = ref<boolean>(false);
let currentBoardUrl;
let api;

(async () => {
  await loadState(trello);
  authorized.value = await trello.getRestApi().isAuthorized();
  if (authorized.value) {
    const member = await trello.member('id');
    const token = await trello.getRestApi().getToken();
    // get the boards this user is a member of
    api = new Api(key, token);
    selectedSource.value = state.sourceList;
    selectedDestinationBoard.value = state.destinationBoard;
    if (state.destinationBoard) {
      await updateDestinationLists(state.destinationBoard);
    }
    selectedLabel.value = state.label;
    selectedFilterLabels.value = state.filterLabels;
    const memberData = await api.member.get(member.id);
    boards.value = memberData.boards;
    const {labels: bdLabels, url} = await trello.board('labels', 'url');
    labels.value = bdLabels;
    currentBoardUrl = url;
    sourceLists.value = await trello.lists('id', 'name');
  }
})();

const updateDestinationLists = async (event) => {
  const boardId = event?.target?.value || event;
  if (boardId && api) {
    const destLists = await api.board.lists(boardId);
    if (destLists.length > 0) {
      destinationLists.value = destLists;
      selectedDestinationList.value = state.destinationList;
    }
  }
}

const moveCards = async (event) => {
  try {
    isLoading.value = true;
      // if save settings is selected fire off a save request, ignore the return
  if (saveSettings.value) {
    state.sourceList = selectedSource.value;
    state.destinationBoard = selectedDestinationBoard.value;
    state.destinationList = selectedDestinationList.value;
    state.label = selectedLabel.value;
    state.filterLabels = selectedFilterLabels.value;
    void store(trello); //explicitly indicate we don't care about the result of that action
  }
  if (api && selectedSource.value) {
    const cards = await api.list.cards(state.sourceList);
    const cardsToMove = [];
    for (const card of cards) {
      const shouldMove = card.idLabels.some((label) => {
        for (const fLabel of selectedFilterLabels.value) {
          if (label?.id === fLabel || label === fLabel) {
            return true;
          }
        }
        return false;
      });
      if (shouldMove) {
        // attach the label to the card
        cardsToMove.push(card);
      }
    }
    const cancelToken = globalThis.setInterval(async () => {
      if (cardsToMove.length === 0) {
        globalThis.clearInterval(cancelToken);
        isLoading.value = false;
      } else {
        const card = cardsToMove.pop();
        if (card) {
          card.idLabels.push(state.label);
          card.idBoard = state.destinationBoard;
          card.idList = state.destinationList;
          api.card.update(card.id, card);
        }
      }
      
    }, 500);
  }
  } catch (exc) {
    console.error(exc);
  }
  
}
</script>

<style>
  .overlay {
    @apply pointer-events-none before:bg-N500/50 before:absolute before:w-full before:inset-0 before:content-['Running...'] before:text-N10 before:text-center before:text-8xl before:pt-72;
  }
</style>
