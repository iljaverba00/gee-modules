<template>
  <div class="map-buttom-places">
    <div class="top left map-buttom-place">
      <map-underlays :map="map" />
      <positioning-on-layer
        v-if="props.activeLayerSelected"
        @positioning="emit('positioning')"
      />
    </div>

    <div class="bottom right map-buttom-place">
      <map-tools
        v-if="props.editingMode"
        :active-tool="props.activeTool"
        @update:active-tool="emit('update:activeTool', $event)"
      />
    </div>

    <div class="top right map-buttom-place">
      <fullscreen-control />
    </div>

    <div class="right map-buttom-place">
      <zoom-control :view="view" />
    </div>

    <div class="bottom left map-buttom-place"></div>

    <div class="bottom right map-buttom-place"></div>
  </div>
  <scaleline-control />
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

import ZoomControl from './ZoomControl.vue'
import FullscreenControl from './FullscreenControl.vue'
import ScalelineControl from './ScalelineControl.vue'
import MapUnderlays from './MapUnderlays.vue'
import PositioningOnLayer from './PositioningOnLayer.vue'
import MapTools from './MapTools.vue'

import type { IMap, IView } from '../types'

const props = defineProps<{
  map?: IMap
  view?: IView
  activeLayerSelected: boolean
  activeTool: string | null
  editingMode: boolean
}>()

const { map, view } = toRefs(props)

const emit = defineEmits<{
  (e: 'positioning'): void
  (e: 'update:activeTool', tool: string | null): void
}>()
</script>

<style>
.map-buttom-places {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.map-buttom-places .map-buttom-place {
  position: absolute;
  display: flex;
  pointer-events: all;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  margin: auto;
  width: -moz-max-content;
  width: max-content;
  align-items: center;
  height: -moz-max-content;
  height: max-content;
}
.map-buttom-places .left {
  right: auto;
}
.map-buttom-places .right {
  left: auto;
}
.map-buttom-places .bottom {
  top: auto;
}
.map-buttom-places .top {
  bottom: auto;
}
</style>
