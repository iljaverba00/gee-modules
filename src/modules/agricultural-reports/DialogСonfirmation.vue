<template>
  <q-dialog v-model="visibility">
    <q-card>
      <q-card-section>
        <q-item-section class="text-h6">Отправить отчет на проверку?</q-item-section>
      </q-card-section>

      <q-card-section class="q-pt-xs">
        <q-item-label style="flex-grow: 1">
          После отправки редактирование отчета будет недоступно
        </q-item-label>
      </q-card-section>

      <q-card-actions
          align="right"
      >
        <q-btn
            flat
            label="Отправить"
            color="primary"
            @click="addMessage()"
            v-close-popup
        />
        <q-btn
            label="Отменить"
            color="primary"
            v-close-popup
        />

      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  QCard,
  QBtn,
  QCardSection,
  QDialog,
  ClosePopup,
  QItemSection,
  QItemLabel,
  QCardActions,
} from 'quasar';
import {computed } from 'vue';

const vClosePopup = ClosePopup;

const props = defineProps<{
  visibility: boolean;
}>();
const emit = defineEmits<{
  (e: 'sendReport'): void
  (e: 'update:visibility', val: boolean): void;
}>();

const visibility = computed({
  get(): boolean {
    return props.visibility;
  },
  set(v: boolean) {
    emit('update:visibility', v);
  },
});


const addMessage = () => {
  emit('sendReport');
};


</script>

<style scoped>
.button-add {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
