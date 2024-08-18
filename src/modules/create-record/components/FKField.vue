<template>
  <q-select
    outlined
    select
    dense
    emit-value
    options-dense
    map-options
    :model-value="modelValue"
    @update:model-value="emit('update:model-value', $event as string)"
    :options="options"
    :label="label"
  />
</template>

<script setup lang="ts">
import { QSelect } from 'quasar';

defineProps<{
  modelValue: string;
  options: { label: string; value: number }[];
  label: string
}>();
const emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();
</script>

<style scoped></style>
