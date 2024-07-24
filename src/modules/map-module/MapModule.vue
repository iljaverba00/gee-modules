<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="emit('moduleStartView')"
    @module-end-view="emit('moduleEndView')"
  >
    <ThisMap
      ref="mapComponent"
      :layers-to-legend="props.layersToLegend"
      legend
    />
  </main-wrapper>
</template>

<script setup lang="ts">
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import ThisMap from '../../components/map/ThisMap.vue'
import type { ILayer } from '../../components/map/types'

const props = defineProps<{
  layersToLegend: ILayer[]
}>()

const emit = defineEmits<{
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
}>()
</script>
