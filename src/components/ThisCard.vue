<template>
  <q-list
    v-if="data.length"
    class="business-modules__card-list"
    dense
    separator
  >
    <q-item
      v-for="row of data"
      :key="row.name"
      dense
      clickable
    >
      <q-item-section>
        <q-item-label
          class="business-modules__card-list-item-label"
          >{{ row.name }}</q-item-label
        >
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ value(row.value) }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <q-separator v-if="data.length" />
  <q-linear-progress
    v-else-if="loading"
    indeterminate
    color="secondary"
    size="4px"
  />
  <div
    v-else
    class="business-modules__card-list-no-data"
  >
    Нет данных
  </div>
</template>

<script setup lang="ts">
import {
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QLinearProgress,
  QSeparator,
} from 'quasar'
import { ref, toRefs, onMounted } from 'vue'

interface ICardRow {
  name: string
  value: Value
}

type Value = string | number | boolean | null

const props = defineProps<{
  data: ICardRow[]
}>()
const { data } = toRefs(props)

const value = (val: Value) => {
  if (typeof val === 'boolean') {
    if (val === false) {
      return 'Нет'
    } else {
      return 'Да'
    }
  } else if (val === null || val === undefined) {
    return ''
  } else {
    return val
  }
}

const loading = ref(true)

const loadEnd = () => {
  loading.value = false
}

onMounted(() => {
  if (!data.value.length && loading.value) {
    setTimeout(loadEnd, 5000)
  }
})
</script>

<style>
.business-modules__card-list {
  min-width: 300px;
}

.business-modules__card-list-item-label {
  color: #757575;
}

.business-modules__card-list-no-data {
  min-width: 300px;
  padding: 8px;
}
</style>
