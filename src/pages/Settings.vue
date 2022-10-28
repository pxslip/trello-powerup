<template>
  <div class="text-center px-2">
    <h1>USHMM Maintenance Settings</h1>
    <div v-if="authorized === undefined">{{ msg }}</div>
    <div v-else-if="authorized">
      <h2>Label Map (Used by Maintenance Board to send cards home)</h2>
      <div class="grid grid-cols-2 gap-2">
        <h3>Label</h3>
        <h3>Destination Board</h3>
        <template v-for="item in labelMap">
          <select v-model="item.labelId" aria-label="Label">
            <option v-for="label in labels" :value="label.id">
              {{ label.name }}
              <template v-if="label.color">({{ label.color }})</template>
            </option>
          </select>
          <select v-model="item.boardId" aria-label="Destination Board">
            <option v-for="board in boards" :value="board.id">
              {{ board.name }}
            </option>
          </select>
        </template>
      </div>
      <button class="block w-10/12 mx-auto" @click="addLabelRow">Add Mapping</button>
      <button class="absolute bottom-2 left-2 w-5/12 mod-primary" @click="store(trello)">Save</button>
      <button class="absolute bottom-2 right-2 w-5/12" @click="trello.closeModal()">Cancel</button>
    </div>
    <div v-else-if="!authorized">
      <button class="w-full" type="button" @click="beginAuthFlow">Authorize</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadState, store } from '@/state';
import type {LabelMapItem} from '@/state';
import Api, {beginAuthFlow} from '@/state/trello';
import key from '@/state/key';
import SettingsToggle from '@/components/SettingsToggle.vue';
import { inject, ref } from 'vue';
import type { Trello } from 'typings/trello';

const authorized = ref<boolean | undefined>(undefined);
const msg = ref('Loading...');

const trello = inject('trello') as Trello.PowerUp.IFrame;
let labelMap = ref<LabelMapItem[]>([]);
const labels = ref<{id: string, name: string, color: string}[]>([]);
const boards = ref<{id: string, name: string}[]>([]);

  
(async () => {
  try {
    const state = await loadState(trello);
    authorized.value = await trello.getRestApi().isAuthorized();
    if (authorized.value) {
      const token = await trello.getRestApi().getToken();
      const api = new Api(key, token);
      // load the list of boards this member has access to
      if (state.labelMap) {
        labelMap.value = state.labelMap;
      }
      
      const member = await trello.member('id');
      const memberData = await api.member.get(member.id);
      boards.value = memberData.boards;
      const {labels: bdLabels} = await trello.board('labels');
      labels.value = bdLabels;
    }
  } catch (exc) {
    console.error(exc);
    msg.value =
      "That's no settings page, that's an error! Looks like something went horribly wrong here...";
  }
})();

const addLabelRow = () => {
  labelMap.value.push({labelId: '', boardId: ''});
}
</script>

<style></style>
