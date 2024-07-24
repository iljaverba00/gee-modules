<template>
  <q-dialog v-model="model">
    <q-card style="width: 350px">
      <q-card-section>
        <div class="text-h6">Отправить заявку на удаление?</div>
      </q-card-section>

      <q-card-section>
        <div>Номер контура сельхозполя: {{ contNum }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Да" color="primary" @click="emit('remove')" />

        <q-btn v-close-popup label="Отмена" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QDialog, QCard, QCardSection, QCardActions, QBtn, ClosePopup } from 'quasar';
import { IRecord, IData } from './Types.ts';

const props = defineProps<{
  modelValue: boolean;
  record?: IRecord;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'remove'): void;
}>();

const vClosePopup = ClosePopup;

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const contNum = computed(
  () => props.record?.data.find((el: IData) => el.alias == 'SubjContNumb')?.value,
);
</script>
