<template>
  <q-btn
    class="business-modules__map-fullscreen"
    :icon="isFullscrean ? 'close_fullscreen' : 'open_in_full'"
    color="primary"
    size="sm"
    unelevated
    @click="fullScreen"
  />
</template>

<script setup lang="ts">
import { QBtn } from 'quasar'
import { ref } from 'vue'

const isFullscrean = ref(false)

addEventListener('fullscreenchange', () => {
  isFullscrean.value = !isFullscrean.value
})

const fullScreen = () => {
  const map = document.querySelector('.business-modules__map')

  if (!map) return

  if (!isFullscrean.value) {
    map.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style>
.business-modules__map-fullscreen {
  width: 32px;
  height: 32px;
  margin: 4px;
}
</style>
