<template>
  <q-dialog v-model="visibility">
    <q-card>
      <q-card-section>
        <q-item-section class="text-h6">Введите текст нового сообщения</q-item-section>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="text" filled autogrow />
      </q-card-section>

      <q-card-section class="button-add">
        <q-item-label style="flex-grow: 1">
          <q-btn
            flat
            round
            :disable="checkText"
            type="file"
            color="primary"
            icon="attach_file"
            @click.stop="openFileInputDialog()"
          >
            <q-tooltip>
              {{ checkText ? 'Необходимо ввести текст сообщения' : 'Прикрепить файл' }}
            </q-tooltip>
            <q-badge color="primary" floating transparent>
              {{ file ? '1' : '0' }}
            </q-badge>
          </q-btn>

          <input
            id="inputFile-Create-message"
            style="flex-grow: 2"
            type="file"
            @click.stop
            hidden
            @change="changeFile($event)"
          />
        </q-item-label>

        <q-btn
          :disable="checkText"
          color="primary"
          label="Отправить сообщение"
          @click="addMessage"
          v-close-popup
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  QCard,
  QInput,
  QBtn,
  QCardSection,
  QDialog,
  ClosePopup,
  QItemSection,
  QItemLabel,
  QTooltip,
  QBadge
} from 'quasar';
import { ref, computed } from 'vue';

const vClosePopup = ClosePopup;

const props = defineProps<{
  visibility: boolean;
}>();
const emit = defineEmits<{
  (e: 'createMessage', val: {
    message: string,
    file?: File
  }): void;
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

const text = ref('');
const file = ref<File>();

const addMessage = () => {
  emit('createMessage', { message: text.value, file: file.value });
};

const openFileInputDialog = () => {
  const el = document.getElementById(`inputFile-Create-message`);
  el && el.click();
};

const changeFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const targetFiles = target.files?.[0];
  if (!targetFiles) return;
  file.value = targetFiles;
};

const checkText = computed(() => {
  return !text.value.trim().length;
});
</script>

<style scoped>
.button-add {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
