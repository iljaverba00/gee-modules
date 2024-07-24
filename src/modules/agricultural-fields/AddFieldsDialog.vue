<template>
  <q-dialog v-model="model">
    <q-card style="width: 350px">
      <q-card-section style="display: flex; justify-content: space-between">
        <div class="text-h6">Добавление сельхозполя</div>
        <q-btn icon="close" color="primary" round dense flat @click="model = false" />
      </q-card-section>

      <q-card-section>
        <q-select
          ref="cadastralNumbersRef"
          v-model="cadastralNumbers"
          use-chips
          use-input
          multiple
          filled
          counter
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
          :placeholder="!cadastralNumbers.length ? 'Введите номер(а) контура(ов)' : ''"
          @beforeinput="beforeInputNumbers($event, cadastralNumbers)"
          @blur="beforeInputNumbersBlur($event.target.value, cadastralNumbers)"
        >
          <template v-slot:selected-item="scope">
            <q-chip
              style="cursor: pointer"
              color="white"
              text-color="primary"
              icon-remove="clear"
              square
              removable
              dense
              :tabindex="scope.tabindex"
              @remove="scope.removeAtIndex(scope.index)"
            >
              <div class="cadastral-numbers-chip" @click="editChip(scope, cadastralNumbersRef)">
                {{ scope.opt }}
              </div>
            </q-chip>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          label="Добавить"
          color="primary"
          :disable="!cadastralNumbers.length"
          @click="addField"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QSelect,
  QChip,
  QBtn,
  ClosePopup,
} from 'quasar';

interface IChipScope {
  index: number;
  opt: string;
  html: boolean;
  selected: boolean;
  tabindex: number;
  removeAtIndex: (index: number) => void;
}

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'addField', val: string[]): void;
}>();

const vClosePopup = ClosePopup;

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const cadastralNumbers = ref<string[]>([]);
const cadastralNumbersRef = ref<QSelect>();

const addField = () => {
  emit('addField', cadastralNumbers.value);
  cadastralNumbers.value = [];
  model.value = false;
};

const beforeInputNumbers = (e: InputEvent, model: string[]) => {
  if (!e.data) return;

  if (e.data == ',' || e.data == ' ') {
    e.preventDefault();

    const keydownEnter = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });

    (e.target as HTMLInputElement).dispatchEvent(keydownEnter);
  } else if (/[\s.,;|/\\]/.test(e.data) && e.data.length > 1) {
    e.preventDefault();

    const newCadastralNumbers = e.data.split(/[\s.,;|/\\]/).filter((el) => !!el);
    newCadastralNumbers.forEach((el) => {
      if (!model.includes(el)) {
        model.push(el);
      }
    });
  }
};

const beforeInputNumbersBlur = (data: string, model: string[]) => {
  if (!data) return;

  if (!model.includes(data)) {
    model.push(data);
  }
};

const editChip = (scope: IChipScope, target?: QSelect) => {
  if (!target) return;

  scope.removeAtIndex(scope.index);
  target.updateInputValue(scope.opt);
};
</script>
