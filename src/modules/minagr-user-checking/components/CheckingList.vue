<template>
  <q-list class="minagro-usercheck-form-review__list">
    <q-separator vertical />
    <q-item-section class="overflow-hidden">
      <q-item
        v-for="(record, indexRecord) in filterRecord"
        :key="indexRecord"
        class="row minagro-usercheck-form-review__item"
      >
        <q-item-label class="minagro-usercheck-form-review__item-label"
          ><span v-if="record.alias == 'zipDATE'">Дата проверки</span>
          <span v-else>{{ record.name }}</span>
        </q-item-label>

        <q-item-section class="minagro-usercheck-form-review__item-value">
          <template
            v-if="
              record.alias === 'CadNums' ||
              record.alias === 'FieldNums' ||
              record.alias === 'Request'
            "
          >
            <div v-if="record.value != null && (record.value as string[])?.length ">
              <q-select
                v-if="isShowField"
                :model-value="record.value"
                borderless
                multiple
                use-chips
                hide-dropdown-icon
                dense
                @remove="removeCadNums($event, indexRecord)"
              >
                <template #append v-if="record.restoreCadNums.show">
                  <q-btn icon="history" flat dense rounded @click="restoreCadNums(indexRecord)" />
                </template>
              </q-select>
              <span class="minagro-usercheck-form-review__item-value" v-else>{{
                transformRecord(record.value as string | string[])
              }}</span>
            </div>
            <div v-else-if="record.alias === 'CadNums'" class="minagro-usercheck-null-value">
              Нет кадастровых номеров
              <q-btn
                v-if="record.restoreCadNums.show"
                icon="history"
                flat
                dense
                rounded
                @click="restoreCadNums(indexRecord)"
              />
            </div>
            <div v-else-if="record.alias === 'FieldNums'" class="minagro-usercheck-null-value">
              Нет номеров полей
              <q-btn
                v-if="record.restoreCadNums.show"
                icon="history"
                flat
                dense
                rounded
                @click="restoreCadNums(indexRecord)"
              />
            </div>
            <div v-else-if="record.alias === 'Request'" class="minagro-usercheck-null-value">
              Нет сообщений
              <q-btn
                v-if="record.restoreCadNums.show"
                icon="history"
                flat
                dense
                rounded
                @click="restoreCadNums(indexRecord)"
              />
            </div>
          </template>
          <template v-else-if="record.alias === 'Notes'">
            <div class="minagro-usercheck-notes" v-if="record.value != null">
              {{ record.value }}
            </div>
            <div v-else class="minagro-usercheck-null-value">Нет комментариев</div>
          </template>
          <template v-else-if="record.alias === 'IsStore'">
            <div class="minagro-usercheck-notes" v-if="record.value != null">
              <FilesList borderless :data="record.value" />
            </div>
            <div v-else class="minagro-usercheck-null-value">Файлы отсутствуют</div>
          </template>
          <template v-else>
            <span v-if="record.value != null">
              {{ record.value }}
            </span>
            <span v-else class="minagro-usercheck-null-value">Пустое поле</span>
          </template>
        </q-item-section>
      </q-item>
      <!-- <q-separator v-if="isShowField(item.data)" /> -->
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
    </q-item-section>
  </q-list>
</template>

<script setup lang="ts">
import { QItem, QItemLabel, QItemSection, QBtn, QSelect, QSeparator } from 'quasar';

import { onMounted, toRefs, computed } from 'vue';
import { Record } from '../types';
import FilesList from '../../../components/FilesList.vue';
const emits = defineEmits(['confirmOrDeniedDialog', 'removeCadNums', 'restoreCadNums']);
const props = defineProps<{
  record: Record[];
  filter: string[];
  userRoles: string[];
}>();
const { record, filter, userRoles } = toRefs(props);
const filterRecord = computed(() => {
  let copyRecord = record.value;
  const rec = copyRecord.sort(
    (a, b) => filter.value.indexOf(a.alias) - filter.value.indexOf(b.alias),
  );
  const res = rec.filter(
    (el) =>
      el.alias != 'IsConfirm' &&
      el.alias != 'IsDenied' &&
      el.alias != 'YesNo_ID' &&
      el.alias != 'YesNo2_ID' &&
      el.alias != 'MsMessageType_ID',
  );
  return res;
});
const isShowField = computed(() => {
  const regionRole = userRoles.value.includes('Минсельхоз. Район');
  const isYesOrNo = record.value.find((e) => e.alias == 'YesNo_ID')?.value;
  const isYesOrNoRegion = record.value.find((e) => e.alias == 'YesNo2_ID')?.value;
  const isConfirm = record.value.find((e) => e.alias == 'IsConfirm')?.value;
  const isDenied = record.value.find((e) => e.alias == 'IsDenied')?.value;
  if (isYesOrNo !== undefined && regionRole == false) {
    return isYesOrNo == '1' ? false : isYesOrNo == '2' ? false : true;
  } else if (isYesOrNoRegion !== undefined && regionRole == true) {
    return isYesOrNo == '1'
      ? false
      : isYesOrNo == '2'
      ? false
      : isYesOrNoRegion == '1'
      ? false
      : isYesOrNoRegion == '2'
      ? false
      : true;
  } else {
    return isConfirm == false && isDenied === false ? true : false;
  }
});
const onShowConfirmOrDeniedDialog = (val: boolean) => {
  emits('confirmOrDeniedDialog', val);
};
const removeCadNums = (val: { index: number; value: string }, indexRecord: number) => {
  emits('removeCadNums', [val, indexRecord]);
};

const restoreCadNums = (indexRecord: number) => {
  emits('restoreCadNums', indexRecord);
};
const transformRecord = (recordText: string | string[]) => {
  const isArray = Array.isArray(recordText);
  return isArray ? (recordText as string[]).join(', ') : recordText;
};
//Hooks
onMounted(() => {
  // emits('loadRecords');
});
</script>
