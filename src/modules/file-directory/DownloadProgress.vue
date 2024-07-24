<template>
  <q-linear-progress
    v-show="showProgress"
    indeterminate
    animation-speed="300"
  />
</template>

<script setup lang="ts">
import { QLinearProgress } from 'quasar'
import { ref, onMounted, onUnmounted } from 'vue'

interface ICustomMessageEvent extends MessageEvent {
  data: {
    type: string
    value: boolean
  }
}

onMounted(() => {
  window.addEventListener('message', messageListener)
})

onUnmounted(() => {
  window.removeEventListener('message', messageListener)
})

const showProgress = ref(false)

const messageListener = (msg: ICustomMessageEvent) => {
  const typeMsg = msg?.data?.type

  if (typeMsg == 'progress') {
    showProgress.value = msg.data.value ?? false
  }
}
</script>
