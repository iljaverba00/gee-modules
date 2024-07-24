<template>
  <q-list class="minagro-usercheck-form-review__list">
    <q-separator vertical />

    <div v-if="filterFiles?.length" class="file-item-container">
      <q-item v-for="(file, index) in filterFiles" :key="index" class="file-item" clickable>
        <q-item-section>{{ file.docName }}</q-item-section>
        <q-btn flat dense icon="download" color="primary" @click="downloadFile(file)" />
      </q-item>
      <div class="minagro-usercheck-form-review__label-buttons" v-if="isShowField">
        <q-btn
          class="label-button label-button-positive"
          label="Одобрить"
          flat
          @click="onShowConfirmOrDeniedDialog(true)"
        />
        <q-btn
          class="label-button label-button-negative"
          label="Отказать"
          flat
          @click="onShowConfirmOrDeniedDialog(false)"
        />
      </div>
    </div>

    <div v-else>
      <q-item>
        <q-item-section>Отчеты отсутствуют</q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { toRefs, inject, computed } from 'vue';
import { IFile, Record } from '../types';
import { QList, QSeparator, QItem, QItemSection, QBtn } from 'quasar';
const props = defineProps<{
  files: IFile[];
  record: Record[];
  userRoles: string[];
}>();
const emits = defineEmits(['confirmOrDeniedDialog']);

const { files, record, userRoles } = toRefs(props);

const injecting = inject('downloadFile') as { downloadFile: (file: IFile) => void };
const { downloadFile } = injecting;

const onShowConfirmOrDeniedDialog = (val: boolean) => {
  emits('confirmOrDeniedDialog', val);
};

const filterFiles = computed(() => {
  const request = record.value.find((el) => el.alias == 'FileIds');
  if (request != undefined && request.value) {
    const fileIds = (request?.value as string).split(',');
    if (request.value === null) return;
    if (!files.value) return;
    const filterFilesList = files.value.filter((file) => {
      for (const message of fileIds) {
        if (file.docId.includes(message.trim())) {
          return true;
        }
      }
    });
    return filterFilesList;
  } else return [];
});
const isShowField = computed(() => {
  const regionRole = userRoles.value.includes('Минсельхоз. Район');
  const isYesOrNo = record.value.find((e) => e.alias == 'YesNo_ID')?.value;
  const isYesOrNoRegion = record.value.find((e) => e.alias == 'YesNo2_ID')?.value;
  if (isYesOrNo !== undefined && regionRole == false) {
    return isYesOrNo == '1' ? false : isYesOrNo == '2' ? false : true;
  } else {
    return isYesOrNo == '1'
      ? false
      : isYesOrNo == '2'
      ? false
      : isYesOrNoRegion == '1'
      ? false
      : isYesOrNoRegion == '2'
      ? false
      : true;
  }
});
</script>
<style lang="scss">
.file-item {
  display: flex;
  justify-content: space-between;
}
.file-item-container {
  width: 100%;
}
</style>
