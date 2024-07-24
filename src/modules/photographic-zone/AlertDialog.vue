<template>
  <q-dialog
    :model-value="show"
    @update:model-value="emit('update:show', $event)"
  >
    <q-card  style="width: 30vw;">
      <q-card-section class="q-pb-none">
        <div class="text-h6">
          {{ title }}
        </div>
      </q-card-section>
      <q-card-section class="q-py-none" style="justify-content: center; align-items: center">
        <q-input  class="text-subtitle1" autogrow :model-value="text" borderless/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" :label="yesBtnLabel ?? 'Ок'" @click="emit('update:show', false)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {QDialog, QCard, QCardActions, QCardSection, QBtn, QInput } from 'quasar';


defineProps<{
  show?: boolean;
  title?: string;
  text?: string;
  yesBtnLabel?: string;
}>();
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>();
</script>

<style scoped></style>
