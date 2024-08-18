<template>
  <q-expansion-item
    expand-separator
    dense
    :label="`${geometryInfo.label} ${createFeature ? 'Объект добавлен' : ''}`"
  >
    <q-card>
      <q-card-section class="no-padding">
        <div ref="mapContainer" class="map-container"></div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup lang="ts">
import 'ol/ol.css';
import { ref, onMounted, toRefs } from 'vue';
import { Map, View, MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point, Geometry } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Style, Icon } from 'ol/style';
import { Control } from 'ol/control';
import { defaults as defaultControls } from 'ol/control';
import { GeoJSON } from 'ol/format'

import { ObjGeometry } from '.././Type';
import { QExpansionItem, QCard, QCardSection } from 'quasar';

const props = defineProps<{
  geometryInfo: ObjGeometry;
}>();

const { geometryInfo } = toRefs(props);

// Определение переменных с типами
const mapContainer = ref<HTMLDivElement | null>(null);
const map = ref<Map | null>(null);
const vectorSource = ref<VectorSource | null>(null);
const createFeature = ref<Feature<Geometry> | null>(null);

// Функция для инициализации карты
const initMap = (): void => {
  vectorSource.value = new VectorSource();

  const vectorLayer = new VectorLayer({
    source: vectorSource.value as VectorSource,
  });

  map.value = new Map({
    target: mapContainer.value as HTMLDivElement,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
      }),
      vectorLayer,
    ],
    view: new View({
      center: fromLonLat(geometryInfo.value.centerWgs), // Центр на Москве
      zoom: geometryInfo.value.zoom,
    }),
    controls: defaultControls({ zoom: false, rotate: false, attribution: false }),
  });
  /** по хорошему можно сделать сразу на несколько геометрий, но пока не понятно кому это еще нужно будет */
  map.value.on('click', addPoint);

  const resetButton = document.createElement('button');
  resetButton.innerHTML = 'Сбросить объект';
  resetButton.setAttribute('style',`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: white;
  border: 1px solid #cccccc;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
`);
  resetButton.addEventListener('click', resetPoint);

  const resetButtonControl = new Control({
    element: resetButton,
    target: mapContainer.value as HTMLElement,
  });

  (map.value as Map).addControl(resetButtonControl);
};

// Функция для добавления точки
const addPoint = (event: MapBrowserEvent<MouseEvent>): void => {
  const coordinates = (map.value as Map).getCoordinateFromPixel(event.pixel);

  // Удаление предыдущей точки, если она есть
  if (createFeature.value) {
    (vectorSource.value as VectorSource).removeFeature(createFeature.value as Feature);
  }

  // Создание новой точки
  createFeature.value = new Feature({
    geometry: new Point(coordinates),
  });

  //сохраняем в исходный объект
  geometryInfo.value.value = new GeoJSON().writeFeature(createFeature.value as Feature)

  // Устанавливаем стиль точки
  createFeature.value.setStyle(
    new Style({
      image: new Icon({
        src: 'https://openlayers.org/en/latest/examples/data/dot.png',
        anchor: [0.5, 0.5],
      }),
    }),
  );

  // Добавляем точку на карту
  (vectorSource.value as VectorSource).addFeature(createFeature.value as Feature);
};

// Функция для сброса точки
const resetPoint = (): void => {
  if (createFeature.value) {
    (vectorSource.value as VectorSource).removeFeature(createFeature.value as Feature);
    createFeature.value = null;
    geometryInfo.value.value = '';
  }
};

onMounted(() => {
  initMap();
});
</script>
<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  position: relative;
}
</style>
