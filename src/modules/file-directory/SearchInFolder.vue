<template>
  <q-input
    class="this-path"
    v-model="searchText"
    :placeholder="placeholder"
    outlined
    square
    dense
    @keyup.enter="emits('search', searchText)"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template
      v-slot:append
      v-if="searchText != ''"
    >
      <q-icon
        class="cursor-pointer"
        name="close"
        @click="searchClear"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { QInput, QIcon } from 'quasar'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  folderName?: string
}>()

const emits = defineEmits<{
  (e: 'search', text: string): void
  (e: 'searchClear'): void
}>()

const searchText = ref('')

const placeholder = computed(() => `Искать в: ${props.folderName ?? '/'}`)

watch(placeholder, () => {
  searchText.value = ''
})

const searchClear = () => {
  searchText.value = ''
  emits('searchClear')
}
</script>

<style scoped lang="sass"></style>
