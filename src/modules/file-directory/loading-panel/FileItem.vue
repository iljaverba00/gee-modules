<template>
  <div class="file-item">
    <div style="width: calc(100% - 40px)">
      <div class="file-item-info">
        <q-icon
          name="file_upload"
          size="21px"
          color="primary"
        />
        <span class="file-name">{{ props.name }}</span>
        <q-space />
        <span class="file-size">{{ fileSize }}</span>
      </div>
      <q-linear-progress
        :value="props.progress"
        animation-speed="300"
        color="secondary"
      />
    </div>
    <div
      v-if="props.progress < 1"
      class="spinner"
    >
      <q-spinner
        size="25px"
        color="secondary"
      />
    </div>
    <q-icon
      v-else
      name="done"
      size="40px"
      color="positive"
    />
  </div>
  <q-separator />
</template>

<script setup lang="ts">
import { QIcon, QSpace, QLinearProgress, QSpinner, QSeparator } from 'quasar'
import { computed } from 'vue'

const props = defineProps<{
  progress: number
  size: number
  name: string
}>()

const fileSize = computed(() => {
  if (props.size < 1024) {
    return `${props.size} байт`
  }

  if (props.size < 1024 * 1024) {
    return `${(props.size / 1024).toFixed(2)} КБ`
  }

  if (props.size < 1024 * 1024 * 1024) {
    return `${(props.size / (1024 * 1024)).toFixed(2)} МБ`
  }

  return `${(props.size / (1024 * 1024 * 1024)).toFixed(2)} ГБ`
})
</script>

<style scoped lang="sass">
.file-item
  width: 100%
  padding: 4px 8px
  display: flex
.file-item-info
  display: flex
  align-items: center
  height: 40px
  padding: 0 4px
.file-name, .file-size
  text-wrap: nowrap
.file-name
  padding-left: 4px
  white-space: nowrap
  overflow-x: hidden
  text-overflow: ellipsis
.spinner
  width: 40px
  height: 40px
  display: flex
  align-items: center
  svg
    left: 0
    right: 0
    top: 0
    bottom: 0
    margin: auto
</style>
