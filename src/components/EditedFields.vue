<template>
  <div v-if="data && Array.isArray(data)">
    <component
      v-for="(card, index) of data"
      :key="index"
      :is="card.component"
      :card="card"
    ></component>
  </div>

  <component
    v-else-if="data"
    :is="data.component"
    :card="data"
  ></component>
</template>

<script setup lang="ts">
import { toRefs, VueElementConstructor } from 'vue'

interface IData {
  component: VueElementConstructor
  card: object
}

const props = defineProps<{
  data: IData | IData[]
}>()

const { data } = toRefs(props)
</script>
