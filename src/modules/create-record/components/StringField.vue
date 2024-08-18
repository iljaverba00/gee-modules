<template>
  <q-input
    dense
    outlined
    :label="label"
    :model-value="modelValue"
    @update:model-value="emit('update:model-value', $event as string)"
  />
</template>

<script setup lang="ts">
import { QInput } from 'quasar';

defineProps<{
  modelValue: string;
  label: string
}>();
const emit = defineEmits<{
  (e: 'update:model-value', value: string): void;
}>();
</script>

<style scoped></style>
