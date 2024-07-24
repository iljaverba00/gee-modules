<template>
  <q-separator v-if="props.file" />
  <div
    v-if="props.file"
    class="business-modules__file-viewer"
  >
    <q-img
      v-if="props.file.url && isImage()"
      :src="props.file.url"
    />
    <iframe
      v-else-if="props.file.url && isDoc()"
      style="height: 550px; width: 100%"
      :src="props.file.url"
      frameborder="0"
    />
    <div
      v-else
      class="business-modules__file-viewer-no-data"
    >
      {{ 'На данный момент, формат '
      }}<b>.{{ format(props.file.docName) }}</b
      >{{ ' не поддерживается' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { QSeparator, QImg } from 'quasar'

interface IFile {
  docName: string
  docId: string
  folder: boolean
  fileDate: string
  url: string
}

const props = defineProps<{
  imgsFormat: string[]
  docsFormat: string[]
  file: IFile | null
}>()

const format = (name: string) => {
  return name.split('.')?.pop()?.toLowerCase() ?? ''
}

const isImage = () =>
  props.file && props.imgsFormat.includes(format(props.file.docName))
const isDoc = () =>
  props.file && props.docsFormat.includes(format(props.file.docName))
</script>
<style>
.business-modules__file-viewer {
  padding: 8px;
  width: 100%;
  min-width: 300px;
}

.business-modules__file-viewer-no-data {
  font-size: 2.125rem;
  font-weight: 400;
  line-height: 2.5rem;
  letter-spacing: 0.00735em;
  text-align: center;
  color: #9e9e9e;
}
</style>
