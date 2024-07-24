<template>
  <div style="height: 100%; z-index: 2">
    <div class="legend-header">Слои</div>
    <div :style="!activeLayerId ? 'height: calc(100% - 56px)' : 'height: calc(100% - 56px - 57px)'">
      <q-scroll-area class="legend-scroll">
        <q-linear-progress
          v-if="!props.layers.length"
          v-progress
          indeterminate
          color="secondary"
          size="4px"
        />

        <q-list
          v-if="props.layers.length"
          class="legend-list"
        >
          <q-item
            v-for="(layer, index) of props.layers"
            :key="index"
            :class="layer.layerId == activeLayerId ? 'item-active' : ''"
            :disable="editingMode"
            clickable
            @click="updateActiveLayer(layer)"
          >
            <q-item-section side>
              <q-checkbox
                v-model="layer.show"
                :disable="editingMode"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                {{ layer.text }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                :disable="editingMode"
                icon="more_vert"
                flat
                round
                dense
              >
                <layer-menu :layer="layer" />
              </q-btn>
            </q-item-section>

            <layer-menu
              :layer="layer"
              context
            />
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <div v-if="activeLayerId">
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label> Режим редактирования </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-toggle
            :model-value="editingMode"
            @update:model-value="emit('update:editingMode', $event)"
          />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QLinearProgress,
  QScrollArea,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QCheckbox,
  QBtn,
  QSeparator,
  QToggle,
} from 'quasar'
import { computed } from 'vue'
import LayerMenu from './LayerMenu.vue'
import type { ILayer } from '../types'

const props = defineProps<{
  layers: ILayer[]
  activeLayer: ILayer | null
  editingMode: boolean
}>()

const emit = defineEmits<{
  (e: 'update:activeLayer', layer: ILayer | null): void
  (e: 'update:editingMode', v: boolean): void
}>()

const vProgress = {
  mounted: (el: HTMLElement) => {
    setTimeout(() => {
      el.hidden = true
    }, 7 * 1000)
  },
}

const activeLayerId = computed(() => props.activeLayer?.layerId)

const updateActiveLayer = (layer: ILayer) => {
  if (props.activeLayer == layer) {
    emit('update:activeLayer', null)
  } else {
    layer.show = true
    emit('update:activeLayer', layer)
  }
}
</script>

<style>
.legend-scroll {
  height: 100%;
}
.legend-list {
  min-width: 350px;
}
.legend-list .item-active {
  color: var(--q-primary);
}
.drawer .q-item {
  height: 56px;
}
.legend-header {
  padding: 8px 16px;
  line-height: 40px;
  background: var(--q-primary);
  color: white;
  font-size: 1.3em;
}
</style>
