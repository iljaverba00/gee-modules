<template>
  <q-btn
    class="business-modules__map-underlays"
    icon="layers"
    color="primary"
    size="sm"
    unelevated
  >
    <q-menu
      anchor="top right"
      auto-close
    >
      <q-list>
        <q-item
          v-for="underlay of underlaysList"
          :key="underlay.id"
          clickable
          v-close-popup
          @click="activeUnderlay = underlay"
        >
          <q-item-section> {{ underlay.text }} </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { QBtn, QMenu, QList, QItem, QItemSection, ClosePopup } from 'quasar'
import { ref, watch, toRefs } from 'vue'

import { getUnderlay } from './MapUnderlays'

import type Map from 'ol/Map'
import type BaseLayer from 'ol/layer/Base'

const vClosePopup = ClosePopup

interface IMap extends Map {
  map: Map
}

const props = defineProps<{
  map: IMap | undefined
}>()

const { map } = toRefs(props)

interface IUnderlay {
  text: string
  id: string
  show: boolean
  add: boolean
}

const underlaysList = ref<IUnderlay[]>([
  {
    text: 'Open Street Map',
    id: 'osm',
    show: false,
    add: false,
  },
  {
    text: 'Google Карта',
    id: 'google_road',
    show: false,
    add: false,
  },
  {
    text: 'Google Рельеф',
    id: 'google_terr',
    show: false,
    add: false,
  },
  {
    text: 'Google Спутник',
    id: 'google_sat',
    show: false,
    add: false,
  },
  {
    text: 'Google Гибрид',
    id: 'google_hyb',
    show: false,
    add: false,
  },
  {
    text: 'Яндекс Карта',
    id: 'ya_map',
    show: false,
    add: false,
  },
  {
    text: 'Яндекс Спутник',
    id: 'ya_sat',
    show: false,
    add: false,
  },
  {
    text: '2 ГИС',
    id: 'map_2gis',
    show: false,
    add: false,
  },
  {
    text: 'Bing Roads',
    id: 'bing_road',
    show: false,
    add: false,
  },
  {
    text: 'Bing Aerial',
    id: 'bing_aerial',
    show: false,
    add: false,
  },
  {
    text: 'Без подложки',
    id: 'none',
    show: false,
    add: false,
  },
])

const activeUnderlay = ref<IUnderlay | null>(null)

const setStartedUnderlay = () => {
  const defaultId = sessionStorage.getItem('module__underlay') ?? 'osm'
  const defaultUnderlay = underlaysList.value.find(underlay => underlay.id === defaultId)
  if (defaultUnderlay) activeUnderlay.value = defaultUnderlay
}

watch(map, (_n, o) => {
  if (!o) setStartedUnderlay()
})

const updateUnderlay = (underlay: IUnderlay, action: 'hide' | 'show' | 'add') => {
  switch (action) {
    case 'hide': {
      underlay.show = false

      const hidenLayer = map.value?.map
        .getLayers()
        .getArray()
        .find((layer: BaseLayer) => layer.get('name') == underlay.text)

      if (hidenLayer) hidenLayer.setVisible(false)
      break
    }
    case 'add': {
      underlay.add = true

      const layer = getUnderlay[underlay.id as keyof typeof getUnderlay]()
      map.value?.map.addLayer(layer)
      break
    }
    case 'show': {
      underlay.show = true

      const showedLayer = map.value?.map
        .getLayers()
        .getArray()
        .find((layer: BaseLayer) => layer.get('name') == underlay.text)

      if (showedLayer) showedLayer.setVisible(true)
      break
    }
  }
}

watch(activeUnderlay, (n, o) => {
  if (o) {
    updateUnderlay(o, 'hide')
  }

  if (n && n.id != 'none') {
    sessionStorage.setItem('module__underlay', n.id)
    if (n.add) {
      updateUnderlay(n, 'show')
    } else {
      updateUnderlay(n, 'add')
    }
  }
})
</script>

<style>
.business-modules__map-underlays {
  margin: 4px;
  width: 32px;
  height: 32px;
}
</style>
