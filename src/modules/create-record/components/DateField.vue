<template>
  <q-input
    :model-value="modelValue"
    dense
    :label="label"
    @update:model-value="emit('update:model-value', $event as string)"
    outlined
    type="date"
  />
</template>

<script setup lang="ts">
import { QInput } from 'quasar';

defineProps<{
  modelValue: string;
  label: string;
}>();
const emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();
</script>

<style scoped></style>
