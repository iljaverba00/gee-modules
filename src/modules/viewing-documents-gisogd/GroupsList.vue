<template>
  <q-list v-if="props.items.length" bordered separator>
    <q-item
      v-for="(item, index) of props.items"
      :key="index"
      :disable="props.loading"
      clickable
      @click="emit('selectItem', item.alias)"
    >
      <q-item-section>
        <q-item-label>{{ item.name }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label>{{ item.count }}</q-item-label>
        <q-tooltip :delay="400"> Колличество документов в разделе </q-tooltip>
      </q-item-section>

      <q-tooltip :delay="1000"> Перейти к документам </q-tooltip>
    </q-item>
  </q-list>

  <span v-if="!props.items?.length && !props.loading" class="text-grey">
    Нет разделов с документами
  </span>
</template>

<script setup lang="ts">
import { QList, QItem, QItemSection, QItemLabel, QTooltip } from 'quasar';
import type { IGroup } from './types';

const props = defineProps<{
  items: IGroup[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'selectItem', value: string): void;
}>();
</script>
