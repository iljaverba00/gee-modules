<template>
  <q-splitter
    v-model="splitter"
    :limits="limits"
    :horizontal="$q.screen.width < 935"
  >
    <template #before>
      <this-header
        title="Карта"
        :parent="{ splitter, limits }"
        @update:splitter="splitter = $event"
      />
      <div class="business-modules__stage-four-map">
        <ThisMap
          ref="mapComponent"
          :layers-to-legend="layersToLegend"
        />
      </div>
    </template>
    <template #after>
      <q-splitter
        v-model="splitterHorizontal"
        :limits="limits"
        horizontal
      >
        <template #before>
          <this-header
            title="Размещенные документы"
            :parent="{ splitter: splitterHorizontal, limits }"
            @update:splitter="splitterHorizontal = $event"
          />
          <div class="business-modules__stage-four-card-list">
            <card-list
              :ref-data="cardList"
              :import-procedure-list="props.importProcedureList"
              :map-component="mapComponent"
              @get-layers-by-card="emit('getLayersByCard', $event)"
              @run-procedure-import="emit('runProcedureImport', $event)"
            />
          </div>
        </template>
        <template #after>
          <this-header
            :title="procedureImportName.length ? `Импорт из ${procedureImportName}` : 'Процедура'"
            :parent="{ splitter: splitterHorizontal, limits }"
            @update:splitter="splitterHorizontal = $event"
          />
          <div class="business-modules__stage-four-procedure">
            <slot></slot>
          </div>
        </template>
      </q-splitter>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { QSplitter } from 'quasar'
import { ref, toRefs, onMounted, onUnmounted, watch } from 'vue'
import ThisHeader from '../../../components/ThisHeader.vue'
import ThisMap from '../../../components/map/ThisMap.vue'
import CardList from '../../../components/CardList.vue'

import type { ICardList, IProcedure } from '../RegistrationDocumentsGisogdTypes'
import type { ILayer } from '../../../components/map/types'

const props = defineProps<{
  disableActivity: boolean
  cardList: ICardList[]
  importProcedureList: IProcedure[]
  procedureImportName: string
}>()

const { cardList } = toRefs(props)

const mapComponent = ref()

const layersToLegend = ref<ILayer[]>([])

watch(
  cardList,
  cards => {
    layersToLegend.value = []
    cards.forEach((card: ICardList) => {
      card.layers &&
        card.layers?.forEach((layer: ILayer) => {
          layer.add && layersToLegend.value.push(layer)
        })
    })
  },
  { deep: true },
)

const emit = defineEmits([
  'loadFourthStep',
  'clearFourthStep',
  'getLayersByCard',
  'nextStep',
  'runProcedureImport',
])

onMounted(() => emit('loadFourthStep'))
onUnmounted(() => emit('clearFourthStep'))

const splitter = ref(60)
const splitterHorizontal = ref(45)
const limits = [10, 90]
</script>

<style>
.business-modules__stage-four-card-list,
.business-modules__stage-four-procedure,
.business-modules__stage-four-map {
  height: calc(100% - 36px);
  overflow: auto;
}
</style>
