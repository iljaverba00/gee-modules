<template>
  <q-list v-if="props.refData.length" class="business-modules__cards-list-and-layer" bordered separator>
    <q-expansion-item
      v-for="card of props.refData"
      :key="card.name"
      v-model="card.expanded"
      :label="card.name"
      :caption="card.layers ? `${card.classification?.value}. ${card.classification?.name}` : undefined"
      :dense="!card.layers"
      :content-inset-level="1"
      :group="card.layers ? 'open' : undefined"
      :hide-expand-icon="!card.layers"
      :expand-icon-toggle="!card.layers"
      @before-show="() => showLayerForShowedGroup({ card })"
      @after-hide="() => hideLayerForHidenGroup({ card })">
      <template #header>
        <q-item style="width: 100%; padding: 0" :active="card.layers && card.expanded" dense>
          <q-item-section avatar>
            <q-icon name="receipt_long" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label style="overflow-wrap: break-word">{{ card.name }}</q-item-label>
            <q-item-label v-if="card.layers" class="business-modules__card-list-item">{{
              card.classification?.value + '. ' + card.classification?.name
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template #default>
        <q-list v-if="card.layers && card.layers.length">
          <q-item v-for="layer of card.layers" :key="layer.alias" dense clickable @click="layer.isDefault && focusOnLayer({ card, layer })">
            <q-item-section side>
              <q-checkbox :disable="!layer.add" v-model="layer.show" @update:model-value="showLayer({ card, layer })" />
            </q-item-section>

            <q-item-section>
              <q-item-label style="overflow-wrap: break-word">{{ layer.text }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn v-if="!layer.isDefault" round flat icon="more_vert" size="sm" @click.stop>
                <q-menu>
                  <q-list separator>
                    <q-item v-if="!layer.isDefault" dense clickable>
                      <q-item-section> Импорт из ... </q-item-section>
                      <q-menu auto-close self="top right" anchor="top left">
                        <q-list separator>
                          <q-item
                            v-for="procedure of props.importProcedureList"
                            :key="procedure.id"
                            dense
                            clickable
                            v-close-popup
                            @click="runProcedure({ card, layer, procedure })">
                            <q-item-section>{{ procedure.name }}</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else-if="!card.layers" class="business-modules__cards-list-and-layer-second-no-data">
          {{ `${card.classification?.value}. ${card.classification?.name}` }}
        </div>

        <div v-else class="business-modules__cards-list-and-layer-second-no-data">Нет слоев</div>
      </template>
    </q-expansion-item>
  </q-list>

  <q-linear-progress v-else-if="loading" indeterminate color="secondary" size="4px" />

  <div v-else class="business-modules__cards-list-and-layer-no-data">Нет данных</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QList, QExpansionItem, QItem, QItemSection, QItemLabel, QIcon, QLinearProgress, QBtn, QMenu, QCheckbox, ClosePopup } from 'quasar';

import type Map from 'ol/Map';
import type BaseLayer from 'ol/layer/Base';

const vClosePopup = ClosePopup;

interface IMap extends Map {
  map: Map;
  focusOnLayer: (bl: ILayer | undefined) => void;
}

interface ILayer {
  alias: string;
  value: number;
  text: string;
  layerId: number;
  add: boolean;
  show: boolean;
  isDefault?: boolean;
  creator?: ICreator;
  uid?: string;
}

interface ICreator {
  data: IData;
  createLayer: (data: IData, map: Map) => BaseLayer;
}

interface IData {
  bankId: number;
  layerId: number;
  workset: string;
  filter: string;
  uid: string;
}

interface IClassification {
  name: string;
  value: string;
}

interface ICardList {
  name: string;
  expanded: boolean;
  key: number;
  classification?: IClassification;
  layers?: ILayer[];
}

interface IDataLayer {
  card: ICardList;
  layer?: ILayer;
  procedure?: IProcedure;
}

interface IProcedure {
  name: string;
  id: number;
}

const props = defineProps<{
  refData: ICardList[];
  importProcedureList?: IProcedure[];
  mapComponent?: IMap;
}>();

const emit = defineEmits(['getLayersByCard', 'showLayer', 'runProcedureImport']);

const addLayers = (data: IDataLayer) => {
  emit('getLayersByCard', data);
};

const showLayer = (data: IDataLayer) => {
  emit('showLayer', data);
};

const showLayerForShowedGroup = (data: IDataLayer) => {
  data.card.layers?.forEach((layer: ILayer) => {
    if (layer.isDefault) layer.show = true;
    addLayers({ card: data.card, layer });
  });
};

const hideLayerForHidenGroup = (data: IDataLayer) => {
  data.card.layers?.forEach((layer: ILayer) => {
    layer.show = false;
    showLayer({ card: data.card, layer });
  });
};

const focusOnLayer = (data: IDataLayer) => {
  props.mapComponent?.focusOnLayer(data.layer);
};

const runProcedure = (data: IDataLayer) => {
  emit('runProcedureImport', data);
};

const loading = ref(true);

const loadEnd = () => {
  loading.value = false;
};

onMounted(() => {
  if (!props.refData.length && loading.value) {
    setTimeout(loadEnd, 5000);
  }
});
</script>

<style>
.business-modules__cards-list-and-layer-item {
  display: flex;
  color: #5b5b5b;
  font-size: 0.8em;
}

.business-modules__cards-list-and-layer-item p {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0 4px 0 0;
}

.business-modules__cards-list-and-layer {
  margin: 8px;
  min-width: 300px;
}

.business-modules__cards-list-and-layer-second-no-data {
  padding: 8px 16px;
}

.business-modules__cards-list-and-layer-no-data {
  padding: 8px;
  min-width: 300px;
}
.business-modules__card-list-item {
  color: #5b5b5b;
  font-size: 0.8em;
}
</style>
