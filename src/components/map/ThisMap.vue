<template>
  <map-wrapper :show-legend="props.legend">
    <template v-slot:map>
      <ol-map
        v-map-is-shown
        ref="map"
        class="business-modules__map"
        load-tiles-while-animating
        load-tiles-while-interacting
        @singleclick="editingMode && clickOnMap($event)"
      >
        <ol-view
          ref="view"
          :center="center"
          :rotation="rotation"
          :zoom="zoom"
          :projection="projection"
        />
        <map-buttons-places
          :map="map"
          :view="view"
          :active-tool="tool"
          :editing-mode="editingMode"
          :active-layer-selected="activeLayerSelected"
          @positioning="positioningOnActiveLayer"
          @update:active-tool="tool = $event"
        />
        <q-resize-observer @resize="map?.updateSize()" />
      </ol-map>
    </template>

    <template v-slot:legend>
      <this-legend
        :layers="layersToLegend"
        :activeLayer="activeLayer"
        :editing-mode="editingMode"
        @update:active-layer="activeLayer = $event"
        @update:editing-mode="editingMode = $event"
      />
    </template>
  </map-wrapper>
</template>

<script setup lang="ts">
import { QResizeObserver } from 'quasar'
import { ref, toRefs, computed, watch } from 'vue'
import MapWrapper from '../supportive/MapWrapper.vue'
import MapButtonsPlaces from './button-places/MapButtonsPlaces.vue'
import ThisLegend from './map-legend/ThisLegend.vue'
import { addDrawLayer, setEditedModeStyle, setDefaultStyle, clickOnMap } from './mapController'

import type { FitOptions } from 'ol/View'
import type { IMap, IView, ILayer, TVectorLayer } from './types'

const props = defineProps<{
  layersToLegend: ILayer[]
  legend?: boolean
}>()
const { layersToLegend } = toRefs(props)

const vMapIsShown = {
  mounted: () => {
    if (!map.value?.map) return
    addDrawLayer(map.value.map)
  },
}
const map = ref<IMap>()
const view = ref<IView>()

const tool = ref<string | null>(null)

const activeLayer = ref<ILayer | null>(null)

const activeLayerSelected = computed(() => !!activeLayer.value)

const editingMode = ref(false)

const center = ref([9100334.744147573, 7325245.079436631])
const zoom = ref(13)
const rotation = ref(0)
const projection = ref('EPSG:3857')

const positioningOnActiveLayer = () => {
  if (!activeLayer.value) return

  activeLayer.value.show = true
  focusOnLayer(activeLayer.value)
}

watch(editingMode, val => {
  if (!activeLayer.value) return

  const layers = map.value?.map.getLayers().getArray() as TVectorLayer[]
  const layer = layers.find((lay: TVectorLayer) => lay.get('uidKey') == activeLayer.value?.uid)
  if (!layer) return

  if (val) {
    activeLayer.value.show = true
    setEditedModeStyle(layer)
  } else {
    setDefaultStyle(layer)
  }
})

watch(
  layersToLegend,
  layers => {
    layers.forEach((layer: ILayer) => {
      const mapLayers = map.value?.map.getLayers().getArray() as TVectorLayer[]
      const mapLayer = mapLayers.find((lay: TVectorLayer) => lay.get('uidKey') == layer.uid)

      if (mapLayer) {
        layer.show && updateLayer('show', layer, mapLayer)
        !layer.show && updateLayer('hide', layer, mapLayer)
      } else {
        updateLayer('add', layer)
      }
    })
  },
  { deep: true },
)

const updateLayer = async (
  action: 'show' | 'hide' | 'add',
  layer: ILayer,
  mapLayer?: TVectorLayer,
) => {
  switch (action) {
    case 'show': {
      if (mapLayer) mapLayer.setVisible(true)
      break
    }
    case 'hide': {
      if (mapLayer) mapLayer.setVisible(false)
      break
    }
    case 'add': {
      if (!map.value) return

      const featureLayer = layer.creator?.createLayer?.(layer.creator.data, map.value.map)
      if (!featureLayer) return

      if (layer.isDefault) featureLayer.setVisible(true)

      map.value.map.addLayer(featureLayer)
      break
    }
  }
}

const focusOnLayer = (layer: ILayer) => {
  const thisLayers = map.value?.map.getLayers().getArray() as TVectorLayer[]
  const thisLayer = thisLayers.find((lay: TVectorLayer) => lay.get('uidKey') == layer.uid)

  if (!thisLayer) return

  const extent = thisLayer.getSource()?.getExtent()
  const size = map.value?.map.getSize() as FitOptions

  if (extent?.some(el => el == Infinity)) return console.log(`${layer.text} - не имеет объектов`)

  if (!size || !extent) return

  map.value?.map.getView().fit(extent, size)
}

defineExpose({
  focusOnLayer,
})
</script>

<style>
.business-modules__map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
