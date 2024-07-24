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
      <this-header title="Размещение файлов" />
      <div class="business-modules__stage-three">
        <FilesListGroup :data="props.files" />
      </div>
    </template>
    <template #after>
      <div class="business-modules__stage-three-actions">
        <q-btn
          class="business-modules__stage-three-btn"
          push
          color="primary"
          label="Разместить"
          :disable="props.disableActivity || !checkSystem || !props.files.length"
          @click="openDialog"
        />
        <q-btn
          class="business-modules__stage-three-btn"
          push
          color="negative"
          label="Перейти к четвертому этапу"
          :disable="props.disableActivity"
          @click="dialogConfirmation = true"
        />
      </div>
    </template>
  </q-splitter>
  <this-dialog
    :show="dialogPlacement"
    title="Подписание файлов"
    body="Выберите сертификат для подписи"
    @yes="startSigningDocuments"
    @cancel="dialogPlacement = false"
  >
    <q-select
      v-model="certificat"
      :options="certificates"
      label="Сертификат"
      option-label="name"
    >
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>
              {{ scope.opt.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div style="margin: 16px 0">Выберите какой статус назначить этой заявке</div>
    <q-select
      v-model="status"
      :options="statuses"
      label="Статус"
      option-label="name"
    >
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label>
              {{ scope.opt.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-linear-progress
      v-if="loading"
      class="business-modules__stage-three-loading"
      indeterminate
      color="secondary"
      size="4px"
    />
  </this-dialog>

  <this-dialog
    :show="dialogConfirmation"
    title="Перейти к четвертому этапу"
    body="Вы уверены что хотите перейти к следующему этапу? Разместить документы больше не получится!"
    @yes="emit('nextStep')"
    @cancel="dialogConfirmation = false"
  >
  </this-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { QSplitter, QBtn, QSelect, QItem, QItemSection, QItemLabel, QLinearProgress } from 'quasar'

import ThisHeader from '../../../components/ThisHeader.vue'
import ThisDialog from '../../../components/ThisDialog.vue'
import FilesListGroup from '../../../components/FilesListGroup.vue'

import { getCertificates, isValidSystem, getSigningFiles } from '../../../services/cryptoPro'

import type { Certificate } from 'crypto-pro-js/lib/api/certificate'
import type { IFilesGroup, ICardRow } from '../RegistrationDocumentsGisogdTypes'

const props = defineProps<{
  files: IFilesGroup[]
  disableActivity: boolean
  statuses: ICardRow[]
}>()

const emit = defineEmits([
  'nextStep',
  'getFilesToSigning',
  'clearThirdStep',
  'setSigningFiles',
  'loadThirdStep',
])
onMounted(() => emit('loadThirdStep'))
onUnmounted(() => emit('clearThirdStep'))

const splitter = ref(52)
const dialogPlacement = ref(false)
const dialogConfirmation = ref(false)
const loading = ref(false)

const startSigningDocuments = async () => {
  if (!certificat.value || !status.value) return

  loading.value = true

  const signingFiles = await getSigningFiles(props.files, certificat.value)

  emit('setSigningFiles', { signingFiles, status: status.value })

  loading.value = false
  dialogPlacement.value = false
}

const certificat = ref<Certificate | null>(null)
const certificates = ref<Certificate[]>([])
const checkSystem = ref(true)

const status = ref<ICardRow | null>(null)

const openDialog = async () => {
  dialogPlacement.value = true
  certificates.value = await getCertificates()
}

onMounted(async () => {
  checkSystem.value = await isValidSystem()
})
</script>

<style>
.business-modules__stage-three {
  height: calc(100% - 36px);
  overflow-y: auto;
}

.business-modules__stage-three-actions {
  padding: 8px;
  display: flex;
  justify-content: space-between;
}

.business-modules__stage-three-btn {
  width: calc(50% - 4px);
}

.business-modules__stage-three-btn span {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.business-modules__stage-three-loading {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
