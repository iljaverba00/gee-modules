<template>
  <q-dialog
    class="dialog-loading-panel"
    v-model="dialog"
    position="bottom"
    no-backdrop-dismiss
    persistent
    seamless
  >
    <q-card class="panel">
      <div class="panel-header">
        <div class="panel-header-title">Загрузки</div>
        <q-space />
        <q-btn
          v-if="isAllLoaded"
          round
          icon="close"
          dense
          flat
          color="white"
          @click="closePanel"
        >
          <q-tooltip :delay="400">Закрыть</q-tooltip>
        </q-btn>
        <q-btn
          round
          :icon="expandIcon"
          dense
          flat
          color="white"
          @click="expandBody"
        >
          <q-tooltip :delay="400">{{ isExpandedBody ? 'Свернуть' : 'Развернуть' }}</q-tooltip>
        </q-btn>
      </div>

      <div class="panel-body custom-scroll">
        <file-item
          v-for="file of filesLoading"
          :key="file.name"
          :progress="file.progress"
          :name="file.name"
          :size="file.size"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialog, QCard, QBtn, QSpace, QTooltip } from 'quasar'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import FileItem from './FileItem.vue'

const dialog = ref(false)
const startView = ref(false)
const isExpandedBody = ref(true)

const expandIcon = computed(() => (isExpandedBody.value ? 'expand_more' : 'expand_less'))

const isAllLoaded = computed(() => !filesLoading.value.some(file => file.progress !== 1))

const expandBody = () => {
  const body = document.querySelector('.panel-body') as HTMLElement
  if (!body) return

  if (isExpandedBody.value) {
    isExpandedBody.value = false
    body.style.height = '0px'
  } else {
    isExpandedBody.value = true
    body.style.height = '250px'
  }
}

interface IFileLoading {
  type: string
  size: number
  progress: number
  name: string
}

interface ICustomMessageEvent extends MessageEvent {
  data: IFileLoading
}

const filesLoading = ref<IFileLoading[]>([])

onMounted(() => {
  window.addEventListener('message', messageListener)
})

onUnmounted(() => {
  window.removeEventListener('message', messageListener)
})

const messageListener = (msg: ICustomMessageEvent) => {
  const typeMsg = msg?.data?.type
  if (typeMsg == 'progressPercentage') {
    startView.value = true
    process(msg.data)
  }
}

const process = (msg: IFileLoading) => {
  const fileName = msg.name
  const fileIndex = filesLoading.value.findIndex(file => file.name == fileName)
  if (fileIndex === -1) {
    filesLoading.value.push(msg)
  } else {
    filesLoading.value[fileIndex].progress = msg.progress
  }
}

const closePanel = () => {
  if (!isExpandedBody.value) expandBody()
  startView.value = false
  filesLoading.value = []
  dialog.value = false
}

watch(startView, val => {
  if (val) dialog.value = true
})
</script>

<style scoped lang="sass">
.panel
  width: 350px
  border-radius: 20px
  overflow: hidden
.panel-header
  display: flex
  align-items: center
  height: 40px
  padding: 0 16px
  background: var(--q-primary)
  .panel-header-title
    font-size: 20px
    color: white
.panel-body
  height: 250px
  overflow: auto
  transition: height 160ms ease-in
</style>

<style lang="sass">
.dialog-loading-panel > .q-dialog__inner
  left: auto !important
</style>
