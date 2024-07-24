<template>
  <q-menu :context-menu="props.context">
    <q-list>
      <q-item
        :dense="props.context"
        clickable
        v-close-popup
        @click="() => console.log(props.layer)"
      >
        <q-item-section>
          <q-item-label> Режим редактирования </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        :dense="props.context"
        clickable
        v-close-popup
        @click="() => console.log(props.layer)"
      >
        <q-item-section>
          <q-item-label> Раскраска по классификаторам </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { QMenu, QList, QItem, QItemSection, QItemLabel, ClosePopup } from 'quasar'
import type { ILayer } from '../types'

const vClosePopup = ClosePopup

const props = defineProps<{
  layer: ILayer
  context?: boolean
}>()
</script>
<style>
.d {
  color: #6fff6c
}
</style>
