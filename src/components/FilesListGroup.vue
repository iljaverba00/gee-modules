<template>
  <div
    v-if="props.data.length"
    class="business-modules__files-list-groups"
  >
    <div
      v-for="group of props.data"
      :key="group.uid"
      class="business-modules__files-list-group"
    >
      <div class="business-modules__files-list-group-label">
        {{ group.label }}
      </div>
      <FilesList
        :data="group.files"
        ecpMode
      />
    </div>
  </div>

  <q-linear-progress
    v-else-if="loading"
    indeterminate
    color="secondary"
    size="4px"
  />

  <div
    v-else
    class="business-modules__files-list-group-no-data"
  >
    Нет данных
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QLinearProgress } from 'quasar'
import FilesList from './FilesList.vue'

interface IFile {
  docName: string
  docId: string
  folder: boolean
  fileDate: string
  url: string
}

interface IFilesGroup {
  files: IFile[]
  fdId: number
  factId: number
  uid: string
  label: string
}

const props = defineProps<{
  data: IFilesGroup[]
}>()

const loading = ref(true)

const loadEnd = () => {
  loading.value = false
}

onMounted(() => {
  if (!props.data.length && loading.value) {
    setTimeout(loadEnd, 5000)
  }
})
</script>

<style>
.business-modules__files-list-group-no-data {
  padding: 8px;
  min-width: 300px;
}

.business-modules__files-list-group-label {
  padding: 8px 8px 0 8px;
}
</style>
