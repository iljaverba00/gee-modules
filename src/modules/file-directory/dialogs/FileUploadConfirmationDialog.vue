<template>
  <q-dialog
    v-model="dialog"
    persistent
    seamless
  >
    <q-card class="ticket-list q-pa-md custom-scroll">
      <file-upload-ticket
        v-for="(file, index) of files"
        :key="index"
        class="ticket"
        :file-path="filePath(file)"
        :file-name="fileName(file)"
        @set-decision="setDecision(file, index, $event)"
        @remove-item="removeItem(index)"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialog, QCard } from 'quasar'
import { toRefs, computed, watch } from 'vue'
import FileUploadTicket from '../FileUploadTicket.vue'
import type { IFileUploadData, IDecisionData } from '../FileDirectoryTypes'

const props = defineProps<{
  model: boolean
  data: IFileUploadData[]
}>()

const { data: files } = toRefs(props)

const emits = defineEmits<{
  (e: 'update:model', v: boolean): void
  (e: 'decision', data: IDecisionData): void
}>()

const dialog = computed({
  get: () => props.model,
  set: v => emits('update:model', v),
})

const filePath = (file: IFileUploadData) =>
  '/' +
  file.parentPath
    .split('/')
    .concat(file.file.path.split('/'))
    .filter(item => !!item)
    .join('/')

const fileName = (file: IFileUploadData) => file.file.file.name

const removeItem = (index: number) => {
  files.value.splice(index, 1)
}

const setDecision = (file: IFileUploadData, index: number, decision: string) => {
  emits('decision', {
    decision,
    ...file,
  } as IDecisionData)

  removeItem(index)
}

watch(
  () => files.value.length,
  (n, o) => {
    if (n === 0 && o > 0) {
      dialog.value = false
    }
  },
)
</script>

<style scoped lang="sass">
.ticket-list
  min-width: 300px
  background: white
.ticket
  margin-bottom: 8px
  padding: 8px
  border-radius: 8px
  background: var(--b-b-color)
  &:last-child
    margin-bottom: 0
</style>
