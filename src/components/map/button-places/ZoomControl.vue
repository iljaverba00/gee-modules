<template>
  <div class="business-modules__map-zoom-control">
    <q-btn
      class="business-modules__map-zoom-in"
      icon="add"
      color="primary"
      size="sm"
      unelevated
      round
      @click="zoom(true)"
    />
    <q-btn
      class="business-modules__map-zoom-out"
      icon="remove"
      color="primary"
      size="sm"
      unelevated
      round
      @click="zoom(false)"
    />
  </div>
</template>

<script setup lang="ts">
import { QBtn } from 'quasar'
import { toRefs } from 'vue'

import type View from 'ol/View.js'

interface IView extends View {
  view: View
}

const props = defineProps<{
  view: IView | undefined
}>()

const { view } = toRefs(props)

const zoom = (zoom: boolean) => {
  if (!view.value) return
  const { view: _view } = view.value

  const delta = zoom ? 1 : -1
  const currentZoom = _view.getZoom()

  if (!currentZoom) return

  const newZoom = _view.getConstrainedZoom(currentZoom + delta)

  if (_view.getAnimating()) _view.cancelAnimations()

  _view.animate({
    zoom: newZoom,
    duration: 150,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  })
}
</script>

<style>
.business-modules__map-zoom-control {
  display: grid;
}
.business-modules__map-zoom-in,
.business-modules__map-zoom-out {
  margin: 4px;
  width: 32px;
  height: 32px;
}
</style>
