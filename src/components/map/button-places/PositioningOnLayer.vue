<template>
  <q-btn
    class="business-modules__map-positioning"
    icon="place"
    color="primary"
    size="sm"
    unelevated
    @click="emit('positioning')"
  />
</template>

<script setup lang="ts">
import { QBtn } from 'quasar'

const emit = defineEmits<{
  (e: 'positioning'): void
}>()
</script>

<style>
.business-modules__map-positioning {
  width: 32px;
  height: 32px;
  margin: 4px;
}
</style>
