<template>
  <q-splitter
    v-model="splitter"
    :limits="limits"
    :horizontal="$q.screen.width < 935"
  >
    <template #before>
      <this-header
        title="Заявка"
        :parent="{ splitter, limits }"
        @update:splitter="splitter = $event"
      />
      <div class="business-modules__stage-one-card">
        <this-card :data="props.card" />
      </div>
    </template>
    <template #after>
      <q-splitter
        v-model="splitterHorizontal"
        horizontal
        reverse
        unit="px"
        :limits="[52, 52]"
        separator-style="cursor: auto"
      >
        <template #before>
          <this-header
            title="Документы"
            :parent="{ splitter, limits }"
            @update:splitter="splitter = $event"
          />
          <div class="business-modules__stage-one-files">
            <FilesList :data="props.files" />
          </div>
        </template>
        <template #after>
          <div class="business-modules__stage-one-actions">
            <q-btn
              class="business-modules__stage-one-btn"
              push
              color="primary"
              label="Взять в работу"
              :disable="props.disableActivity"
              @click="dialogApprove = true"
            />
            <q-btn
              class="business-modules__stage-one-btn"
              push
              color="negative"
              label="Отказать"
              :disable="props.disableActivity"
              @click="dialogDeny = true"
            />
          </div>
        </template>
      </q-splitter>
    </template>
  </q-splitter>

  <this-dialog
    :show="dialogApprove"
    title="Одобрить"
    body="Вы уверены что хотите взять в работу данную заявку? Перейти к следующему этапу?"
    @yes="goNextStep"
    @cancel="dialogApprove = false"
  />

  <this-dialog
    :show="dialogDeny"
    title="Отказ"
    body="Укажите причину отказа и нажмите ОК"
    yesBtnLabel="Ок"
    :yesBtnDisable="!reasonRefusalSelect"
    @yes="rejection"
    @cancel="dialogDeny = false"
  >
    <q-option-group
      type="radio"
      v-model="reasonRefusalSelect"
      :options="reasonRefusal"
    />
  </this-dialog>
</template>

<script setup lang="ts">
import { QBtn, QOptionGroup, QSplitter } from 'quasar'
import { ref, onMounted, onUnmounted } from 'vue'
import ThisHeader from '../../../components/ThisHeader.vue'
import ThisCard from '../../../components/ThisCard.vue'
import FilesList from '../../../components/FilesList.vue'
import ThisDialog from '../../../components/ThisDialog.vue'

import type { IFile, ICardRow, IReasonRefusal } from '../RegistrationDocumentsGisogdTypes'

const props = defineProps<{
  disableActivity: boolean
  files: IFile[]
  card: ICardRow[]
  reasonRefusal: IReasonRefusal[]
}>()
const emit = defineEmits(['loadFirstStep', 'clearFirstStep', 'rejection', 'nextStep'])
onMounted(() => emit('loadFirstStep'))
onUnmounted(() => emit('clearFirstStep'))

const splitter = ref(50)
const limits = [10, 90]

const splitterHorizontal = ref(52)

const reasonRefusalSelect = ref(null)
const dialogApprove = ref(false)
const dialogDeny = ref(false)

const goNextStep = () => {
  dialogApprove.value = false
  emit('nextStep')
}

const rejection = () => {
  dialogDeny.value = false
  emit('rejection', reasonRefusalSelect.value)
}
</script>

<style>
.business-modules__stage-one-card {
  height: calc(100% - 36px);
  overflow-y: auto;
}

.business-modules__stage-one-files {
  height: calc(100% - 36px);
  overflow-y: auto;
}

.business-modules__stage-one-actions {
  padding: 8px;
  display: flex;
  justify-content: space-between;
}

.business-modules__stage-one-btn {
  width: calc(50% - 4px);
}

.business-modules__stage-one-btn span {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>
