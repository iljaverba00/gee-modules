<template>
  <div class="loading-screen">
    <q-spinner-tail
      color="primary"
      size="120px"
    />
  </div>
</template>

<script setup lang="ts">
import { QSpinnerTail } from 'quasar'
</script>

<style>
.loading-screen {
  display: flex;
}
</style>
