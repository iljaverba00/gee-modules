<template>
  <q-input
    class="this-path"
    v-model="localePath"
    outlined
    square
    dense
    @keyup.enter="emits('getFolderByPath', getFixedPath())"
  >
    <template v-slot:prepend>
      <q-icon name="folder" />
    </template>
    <template v-slot:append>
      <q-spinner
        v-if="props.loading"
        color="rgba(0, 0, 0, 0.54)"
        size="1em"
      />
      <q-icon
        v-else
        class="cursor-pointer"
        name="refresh"
        @click="emits('update', getFixedPath())"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { QInput, QIcon, QSpinner } from 'quasar'

const props = defineProps<{
  path: string | undefined
  loading: boolean
}>()

const emits = defineEmits<{
  (e: 'update', path: string): void
  (e: 'getFolderByPath', path: string): void
}>()

const { path } = toRefs(props)

const localePath = ref('')

watch(path, v => {
  if (v) localePath.value = v
})

const getFixedPath = () => {
  const folders = localePath.value.split('/').filter(item => !!item)

  if (folders.length > 0) {
    localePath.value = '/' + folders.join('/') + '/'
  } else {
    localePath.value = '/'
  }

  return localePath.value
}
</script>

<style scoped lang="sass"></style>
