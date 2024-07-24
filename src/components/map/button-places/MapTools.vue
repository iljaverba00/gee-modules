<template>
  <div class="business-modules__map-tools">
    <q-btn
      class="business-modules__map-tool"
      icon="save"
      color="primary"
      size="sm"
      unelevated
      @click="emit('save')"
    >
      <q-tooltip :delay="300"> Сохранить </q-tooltip>
    </q-btn>
    <q-btn
      class="business-modules__map-tool"
      icon="check_box_outline_blank"
      :color="props.activeTool == 'MultiPolygon' ? 'secondary' : 'primary'"
      size="sm"
      unelevated
      @click="setTool('MultiPolygon')"
    >
      <q-tooltip :delay="300"> Полигон </q-tooltip>
    </q-btn>
    <q-btn
      class="business-modules__map-tool"
      icon="show_chart"
      :color="props.activeTool == 'MultiLineString' ? 'secondary' : 'primary'"
      size="sm"
      unelevated
      @click="setTool('MultiLineString')"
    >
      <q-tooltip :delay="300"> Линия </q-tooltip>
    </q-btn>
    <q-btn
      class="business-modules__map-tool"
      icon="radio_button_checked"
      :color="props.activeTool == 'MultiPoint' ? 'secondary' : 'primary'"
      size="sm"
      unelevated
      @click="setTool('MultiPoint')"
    >
      <q-tooltip :delay="300"> Точка </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { QBtn, QTooltip } from 'quasar'

const props = defineProps<{
  activeTool: string | null
}>()

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'update:activeTool', tool: string | null): void
}>()

const setTool = (tool: string) => {
  if (props.activeTool == tool) {
    emit('update:activeTool', null)
  } else {
    switch (tool) {
      case 'MultiPoint':
        emit('update:activeTool', 'MultiPoint')
        break
      case 'MultiLineString':
        emit('update:activeTool', 'MultiLineString')
        break
      case 'MultiPolygon':
        emit('update:activeTool', 'MultiPolygon')
        break
    }
  }
}
</script>

<style>
.business-modules__map-tools {
  display: flex;
}
.business-modules__map-tool {
  width: 32px;
  height: 32px;
  margin: 4px;
}
</style>
