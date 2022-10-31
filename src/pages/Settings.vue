<template>
  <div class="text-center px-2">
    <h1>USHMM Maintenance Settings</h1>
    <div v-if="authorized === undefined">{{ msg }}</div>
    <div v-else-if="authorized">
      <h2>Label Map (Used by Maintenance Board to send cards home)</h2>
      <div class="flex flex-row gap-2">
        <h3 class="grow">Label</h3>
        <h3 class="grow">Destination Board</h3>
        
      </div>
        <div class="flex flex-row gap-2 mb-2" v-for="(item,index) in labelMap">
          <select class="grow mb-0" v-model="item.labelId" aria-label="Label">
            <option v-for="label in labels" :value="label.id">
              {{ label.name }}
              <template v-if="label.color">({{ label.color }})</template>
            </option>
          </select>
          <select class="grow mb-0" v-model="item.boardId" aria-label="Destination Board">
            <option v-for="board in boards" :value="board.id">
              {{ board.name }}
            </option>
          </select>
          <button class="shrink m-0" aria-label="Remove" @click="removeRow(index)">X</button>
        </div>
      <button class="block w-10/12 mx-auto" @click="addLabelRow">Add Mapping</button>
      <button class="absolute bottom-2 left-2 w-5/12 mod-primary" @click="save">Save</button>
      <button class="absolute bottom-2 right-2 w-5/12" @click="trello.closeModal()">Cancel</button>
    </div>
    <div v-else-if="!authorized">
      <button class="w-full" type="button" @click="beginAuthFlow(trello)">Authorize</button>
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
      if (state.labelMap && Array.isArray(state.labelMap)) {
        labelMap.value = state.labelMap;
      } else {
        state.labelMap = labelMap.value;
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

const removeRow = (index: number) => {
  labelMap.value.splice(index, 1);
}

const save = async () => {
  await store(trello);
  trello.closeModal();
}
</script>

<style></style>
