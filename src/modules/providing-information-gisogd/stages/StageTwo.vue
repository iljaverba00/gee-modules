<template>
  <q-splitter
    v-model="splitter"
    horizontal
    reverse
    unit="px"
    :limits="[52, 52]"
    separator-style="cursor: auto"
  >
    <template #before>
      <this-header title="Реестр предоставленных сведений" />
      <div class="providing-information__stage-two-edited-card">
        <edited-fields :data="props.card" />
      </div>
    </template>
    <template #after>
      <div class="providing-information__stage-two-actions">
        <q-btn
          class="providing-information__stage-two-actions-btn"
          push
          color="primary"
          label="Да"
          :disable="disableActivity"
          @click="emit('saveCardSecondStep', props.card)"
        />
        <q-btn
          class="providing-information__stage-two-actions-btn"
          push
          color="negative"
          label="Нет"
          :disable="disableActivity"
        />
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, VueElementConstructor } from 'vue'
import { QSplitter, QBtn } from 'quasar'

import EditedFields from '../../../components/EditedFields.vue'
import ThisHeader from '../../../components/ThisHeader.vue'

interface ICard {
  component: VueElementConstructor
  card: object
}

const props = defineProps<{
  disableActivity: boolean
  card: ICard | ICard[]
}>()

const emit = defineEmits(['loadSecondStep', 'clearSecondStep', 'saveCardSecondStep', 'nextStep'])

onMounted(() => emit('loadSecondStep'))
onUnmounted(() => emit('clearSecondStep'))

const splitter = ref(52)
</script>

<style>
.providing-information__stage-two-edited-card {
  height: calc(100% - 36px);
  overflow-y: auto;
}
.providing-information__stage-two-actions {
  padding: 8px;
  display: flex;
  justify-content: space-between;
}
.providing-information__stage-two-actions-btn {
  width: calc(50% - 4px);
}
.providing-information__stage-two-actions-btn span {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>
