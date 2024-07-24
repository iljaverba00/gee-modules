<template>
  <MainWrapper :full-screen-mode="false" :stepper-mode="false">
    <q-card class="minagro-usercheck-main-card">
      <q-card class="minagro-usercheck-form-card">
        <q-list class="minagro-usercheck-form-requests">
          <div class="tabs-container">
            <q-tabs
              v-model="reqTab"
              class="minagro-usercheck-form-tabs"
              inline-label
              outside-arrows
              mobile-arrows
              @update:model-value="updateTabsInfo"
            >
              <q-tab name="usersTab" label="Пользователи" />
              <q-tab name="regionTab" label="Участки" />
              <q-tab name="agroFieldsTab" label="Сельхозполя" />
              <q-tab name="reportsTab" label="Отчеты" />
            </q-tabs>
            <q-item-section
              class="q-pl-sm q-mr-sm"
              style="margin-left: auto; width: auto; max-width: 350px"
            >
              <q-input
                label="Поиск"
                v-model="searchInList"
                dense
                filled
                @update:model-value="onInputAction($event, reqTab, 'none')"
              >
                <template #append>
                  <q-btn-dropdown dense flat no-icon-animation dropdown-icon="filter_alt">
                    <div class="column q-ma-sm">
                      <q-checkbox
                        v-model="filterConfirm"
                        label="Одобренные заявки"
                        @update:model-value="onInputAction(searchInList, reqTab, 'confirm')"
                      />
                      <q-checkbox
                        v-model="filterDenied"
                        label="Отклоненные заявки"
                        @update:model-value="onInputAction(searchInList, reqTab, 'denied')"
                      />
                      <q-checkbox
                        v-model="filterNotProcessed"
                        label="Необработанные заявки"
                        @update:model-value="onInputAction(searchInList, reqTab, 'notProcessed')"
                      />
                    </div>
                  </q-btn-dropdown>
                </template>
              </q-input>
            </q-item-section>
          </div>
          <q-separator />

          <q-scroll-area
            ref="userCheckScrollArea"
            class="minagro-usercheck-form-scroll"
            :content-style="{ width: '100%' }"
            :content-active-style="{ width: '100%' }"
          >
            <div v-if="noPermission" class="user-checking-no-data">
              Вы не являетесь сотрудником, просмотр закрыт
            </div>
            <div v-else-if="displayValues?.length">
              <q-expansion-item
                v-model="item.active"
                v-for="(item, indexItem) in displayValues"
                :key="indexItem"
                class="minagro-usercheck-expansion"
                group="group"
                expand-separator
                @show="onExpanseShowAction()"
              >
                <template #header>
                  <q-item-section class="minagro-usercheck-form-items__date-label">
                    <div>{{ item.date }}</div>
                    <q-badge
                      v-if="reqTab == 'regionTab' || reqTab == 'agroFieldsTab'"
                      style="margin-top: 0; color: white; width: fit-content; font-size: 9px"
                      :class="
                        item.messageType == 2 || item.messageType == 6 ? 'bg-green' : 'bg-red'
                      "
                      :label="
                        item.messageType == 2 || item.messageType == 6 ? 'Добавление' : 'Удаление'
                      "
                    >
                      <!-- <q-icon :name="item.messageType == 2 ? 'add_circle' : 'delete_sweep'" /> -->
                    </q-badge>
                  </q-item-section>
                  <q-item-section class="minagro-usercheck-form-label">
                    <span>
                      <q-item-label v-if="item.name" class="minagro-usercheck-form-label__name"
                        >{{ item.name }}
                      </q-item-label>
                      <q-item-label v-else class="minagro-usercheck-null-value"
                        >Автор не указан
                      </q-item-label>
                    </span>
                    <span>
                      <q-item-label v-if="item.company" class="minagro-usercheck-form-label__org">{{
                        item.company
                      }}</q-item-label>
                      <q-item-label
                        v-else
                        class="minagro-usercheck-null-value minagro-usercheck-form-label__org"
                        >Организация не указана</q-item-label
                      >
                    </span>
                    <q-item-label class="minagro-usercheck-form-label__org q-mr-md">
                      <span class="q-mr-xs">Статус:</span>
                      <span :class="changeStatus(item.data, 'class')">{{
                        changeStatus(item.data, 'data')
                      }}</span></q-item-label
                    >
                  </q-item-section>
                  <q-space />
                </template>
                <template #default>
                  <CheckingList
                    v-if="reqTab != 'reportsTab'"
                    :record="item.data"
                    :filter="filter"
                    :userRoles="userRoles"
                    @confirmOrDeniedDialog="
                      onShowConfirmOrDeniedDialog($event as unknown as boolean, indexItem)
                    "
                    @removeCadNums="removeCadNums($event, item.recordId!)"
                    @restoreCadNums="restoreCadNums($event, item.recordId!)"
                  />
                  <ReportsFiles
                    v-if="reqTab == 'reportsTab'"
                    :files="files"
                    :record="item.data"
                    :userRoles="userRoles"
                    @confirmOrDeniedDialog="
                      onShowConfirmOrDeniedDialog($event as unknown as boolean, indexItem)
                    "
                  />
                </template>
              </q-expansion-item>
            </div>

            <div v-else-if="data?.length != 0">
              <q-item>
                <q-item-section class="text-center justify-center text-grey-7"
                  >Ничего не найдено</q-item-section
                >
              </q-item>
            </div>
            <div v-else-if="isLoading">
              <q-expansion-item
                class="minagro-usercheck-expansion"
                disable
                v-for="(_, index) in 10"
                :key="index"
              >
                <template #header>
                  <div class="skeleton-value">
                    <q-item-section>
                      <q-skeleton type="QBadge" animation="blink" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>
                        <q-skeleton type="text" animation="blink" />
                      </q-item-label>
                      <q-item-label caption>
                        <q-skeleton type="text" animation="blink" />
                      </q-item-label>
                    </q-item-section>
                  </div>
                  <q-space />
                </template>
              </q-expansion-item>
            </div>
            <div v-else-if="!data?.length">
              <q-item>
                <q-item-section class="text-center justify-center text-grey-7"
                  >Записи отсутствуют</q-item-section
                >
              </q-item>
            </div>
          </q-scroll-area>
        </q-list>
      </q-card>
    </q-card>
  </MainWrapper>
  <q-dialog v-model="showSelectionDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <div class="column minagro-usercheck-form-review__item-col">
          <span class="q-ml-sm q-pb-sm"
            >Вы действительно хотите {{ isConfirmed ? 'подтвердить' : 'отклонить' }} заявку?</span
          >
          <q-item-section
            ><q-input
              v-model="itemValue"
              filled
              type="textarea"
              autogrow
              label="Комментарий к заявке"
          /></q-item-section>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" @click="closeDialog" />
        <q-btn
          flat
          :label="isConfirmed ? 'Подтвердить' : 'Отклонить'"
          color="primary"
          @click="onDialogAction(isConfirmed)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue';

// prettier-ignore
import {QTabs,QTab,QSeparator,QList,QCard,QCardSection,QCardActions,QItemLabel,QItemSection,QInput,QBtn,QBtnDropdown,QDialog,QCheckbox,QScrollArea,QExpansionItem,QSpace,QSkeleton, QItem, QBadge} from 'quasar';
import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import { DataRecords, Record, DisplayValues, IFile } from './types';
import CheckingList from './components/CheckingList.vue';
import ReportsFiles from './components/ReportsFiles.vue';
const emit = defineEmits([
  'loadingUserConfirmation',
  'confirmOrDeniedOnProposal',
  'removeCadNums',
  'restoreCadNums',
  'loadFiles',
]);
const props = defineProps<{
  data: DataRecords[];
  facts: { id: string; name: string; alias: string }[];
  filter: string[];
  files: IFile[];
  noPermission?: boolean;
  isLoading: boolean;
  userRoles: string[];
}>();

//vars
const { data, filter, files /*facts, filter*/, noPermission } = toRefs(props);
const recordsData = ref<DataRecords[]>([]);

const itemValue = ref();
const searchInList = ref('');
const isConfirmed = ref(false);
const reqTab = ref('usersTab'); //usersTab, regionTab
const filterDenied = ref(false);
const filterConfirm = ref(false);
const itemIndex = ref<number>(0);
const userCheckScrollArea = ref();
const filterNotProcessed = ref(false);
const showSelectionDialog = ref(false);
const displayValues = ref<DisplayValues[]>([]);

//Functions
// const filesFilter = (item: Record[]) => {

// };
const changeStatus = (item: Record[], key: string) => {
  const isConfirm = item.find((e) => e.alias == 'IsConfirm')?.value;
  const isDenied = item.find((e) => e.alias == 'IsDenied')?.value;
  const isYesOrNo = item.find((e) => e.alias == 'YesNo_ID')?.value;
  const isYesOrNoRegion = item.find((e) => e.alias == 'YesNo2_ID')?.value;
  if (key == 'data') {
    if (isYesOrNo !== null && isYesOrNo !== undefined) {
      return isYesOrNo == '1' ? 'одобрено' : isYesOrNo == '2' ? 'отклонено' : 'необработанно ';
    } else if (isYesOrNoRegion !== undefined && isYesOrNo == null) {
      return isYesOrNoRegion == '1'
        ? 'одобрено районом'
        : isYesOrNoRegion == '2'
        ? 'отклонено районом'
        : 'необработанно';
    } else {
      return isConfirm ? 'одобрено' : isDenied ? 'отклонено' : 'необработанно ';
    }
  } else if (key == 'class') {
    if (isYesOrNo !== null && isYesOrNo !== undefined) {
      return isYesOrNo == '1'
        ? 'status-color-green'
        : isYesOrNo == '2'
        ? 'status-color-red'
        : 'status-color-blue ';
    } else if (isYesOrNoRegion !== undefined && isYesOrNo == null) {
      return isYesOrNoRegion == '1'
        ? 'status-color-region'
        : isYesOrNoRegion == '2'
        ? 'status-color-region'
        : 'status-color-blue';
    } else {
      return isConfirm ? 'status-color-green' : isDenied ? 'status-color-red' : 'status-color-blue';
    }
  }
};

// const isShowField = (item: Record[]) => {
//   const isYesOrNo = item.find((e) => e.alias == 'YesNo_ID')?.value;
//   const isConfirm = item.find((e) => e.alias == 'IsConfirm')?.value;
//   const isDenied = item.find((e) => e.alias == 'IsDenied')?.value;
//   if (isYesOrNo != undefined || isYesOrNo === null) {
//     return isYesOrNo == '1' ? false : isYesOrNo == '2' ? false : true;
//   } else {
//     return isConfirm == false && isDenied === false ? true : false;
//   }
// };
const onExpanseShowAction = () => {
  slideToView();
};
const slideToView = () => {
  setTimeout(() => {
    const parentPos = document
      .querySelector(
        '.minagro-usercheck-form-scroll > .q-scrollarea__container > .q-scrollarea__content',
      )
      ?.getBoundingClientRect();
    const childPos = document
      .querySelector(
        '.minagro-usercheck-form-scroll > .q-scrollarea__container > .q-scrollarea__content > .q-expansion-item--expanded > .q-expansion-item__container > .q-item',
      )
      ?.getBoundingClientRect();
    if (childPos && parentPos) {
      userCheckScrollArea.value.setScrollPosition('vertical', childPos.top - parentPos.top, 500);
    }
  }, 500);
};
const removeCadNums = (value: [{ index: number; value: string }, number], recordId: number) => {
  const [remove, index] = value;
  emit('removeCadNums', [remove, recordId, index]);
};

const restoreCadNums = (indexRecord: number, indexItem: number) => {
  emit('restoreCadNums', [indexItem, indexRecord]);
};

// const recordFilter = (record: Record[]) => {
//   console.log(record);
//   record = record.sort((a, b) => filter.value.indexOf(a.alias) - filter.value.indexOf(b.alias));
//   const res = record.filter(
//     (el) => el.alias != 'IsConfirm' && el.alias != 'IsDenied' && el.alias != 'YesNo_ID',
//   );
//   return res;
// };

const updateTabsInfo = (v: string) => {
  switch (v) {
    case 'usersTab':
      emit('loadingUserConfirmation', 'usersTab');
      break;
    case 'regionTab':
      emit('loadingUserConfirmation', 'regionTab');
      break;
    case 'agroFieldsTab':
      emit('loadingUserConfirmation', 'agroFieldsTab');
      break;
    case 'reportsTab':
      emit('loadFiles');
      emit('loadingUserConfirmation', 'reportsTab');

      break;
  }
};
const createDisplayValues = (records: DataRecords[]) => {
  displayValues.value = [];
  switch (
    reqTab.value //сортировка значений, сначала необработанные заявки
  ) {
    case 'usersTab':
      records = records.sort((a, b) => {
        let isConfirmA = a.data.find((el) => el.alias == 'IsConfirm')?.value as boolean;
        let isDeniedA = a.data.find((el) => el.alias == 'IsDenied')?.value as boolean;

        let isConfirmB = b.data.find((el) => el.alias == 'IsConfirm')?.value as boolean;
        let isDeniedB = b.data.find((el) => el.alias == 'IsDenied')?.value as boolean;

        if ((isConfirmA! || isDeniedA!) < (isConfirmB! || isDeniedB!)) {
          return -1;
        }
        if (isConfirmA! > isConfirmB!) {
          return 1;
        }
        if (isConfirmA == isConfirmB!) {
          return 0;
        } else return 0;
      });
      break;
    default:
      records = records.sort((a, b) => {
        let isYesOrNoA = a.data.find((el) => el.alias == 'YesNo_ID')?.value;
        let isYesOrNoB = b.data.find((el) => el.alias == 'YesNo_ID')?.value;
        isYesOrNoA === null ? (isYesOrNoA = 0) : isYesOrNoA;
        isYesOrNoB === null ? (isYesOrNoB = 0) : isYesOrNoB;
        if (isYesOrNoA! < isYesOrNoB!) {
          return -1;
        }
        if (isYesOrNoA! > isYesOrNoB!) {
          return 1;
        }
        if (isYesOrNoA == isYesOrNoB) {
          return 0;
        } else return 0;
      });

      break;
  }
  for (let i in records) {
    displayValues.value.push({
      active: records[i].active,
      name: records[i].data.find((el) => el.alias == 'Name' || el.alias == 'RequestEmployee_Name')
        ?.value as string,
      company: records[i].data.find(
        (el) => el.alias == 'CompanyName' || el.alias == 'RequestPublish_ClsName',
      )?.value as string,
      messageType: records[i].data.find((el) => el.alias == 'MsMessageType_ID')?.value as number,
      date: records[i].data.find((el) => el.alias == 'zipDATE')?.value as string,
      data: records[i].data,
      recordId: records[i].recordId,
    });
  }
  // console.log(displayValues.value);
};
const onShowConfirmOrDeniedDialog = (val: boolean, indexItem: number) => {
  itemValue.value = recordsData.value[indexItem].data.find(
    (el) => el.alias == 'Notes' || el.alias == 'Response',
  )?.value as string;
  itemIndex.value = indexItem;
  showSelectionDialog.value = true;
  isConfirmed.value = val;
};
const closeDialog = () => {
  showSelectionDialog.value = false;
};
const onDialogAction = (val: boolean) => {
  // const fieldsToSave = ['CadNums', 'Notes', 'IsConfirm', 'IsDenied'];
  // const itemsToSave = recordsData.value[itemIndex.value].data.filter((el) => {
  //   {
  //     for (let item of fieldsToSave) {
  //       if (el.alias == item) {
  //         return el;
  //       }
  //     }
  //   }
  // });
  if (reqTab.value == 'usersTab') {
    emit('confirmOrDeniedOnProposal', [
      recordsData.value[itemIndex.value],
      val ? 'confirm' : 'denied',
      itemValue.value,
      itemIndex.value,
    ]);
  } else if (reqTab.value == 'regionTab') {
    emit('confirmOrDeniedOnProposal', [
      recordsData.value[itemIndex.value],
      val ? 1 : 2,
      itemValue.value,
      itemIndex.value,
    ]);
  } else if (reqTab.value == 'agroFieldsTab') {
    emit('confirmOrDeniedOnProposal', [
      recordsData.value[itemIndex.value],
      val ? 1 : 2,
      itemValue.value,
      itemIndex.value,
    ]);
  } else if (reqTab.value == 'reportsTab') {
    emit('confirmOrDeniedOnProposal', [
      recordsData.value[itemIndex.value],
      val ? 1 : 2,
      itemValue.value,
      itemIndex.value,
    ]);
  }
  closeDialog();
};

const onInputAction = (e: string | number | null, tab: string, mode: string) => {
  if (tab == 'usersTab' || tab == 'regionTab' || tab == 'reportsTab' || tab == 'agroFieldsTab') {
    let nameAlias: string, organizationAlias: string;
    switch (mode) {
      case 'confirm':
        filterDenied.value = false;
        filterNotProcessed.value = false;
        break;
      case 'denied':
        filterConfirm.value = false;
        filterNotProcessed.value = false;
        break;
      case 'notProcessed':
        filterDenied.value = false;
        filterConfirm.value = false;
        break;
      default:
        break;
    }
    switch (tab) {
      case 'usersTab':
        nameAlias = 'Name';
        organizationAlias = 'CompanyName';
        break;
      case 'regionTab':
        nameAlias = 'RequestEmployee_Name';
        organizationAlias = 'RequestPublish_ClsName';
        break;
      case 'reportsTab':
        nameAlias = 'RequestEmployee_Name';
        organizationAlias = 'RequestPublish_ClsName';
        break;
      case 'agroFieldsTab':
        nameAlias = 'RequestEmployee_Name';
        organizationAlias = 'RequestPublish_ClsName';
        break;
      default:
        break;
    }
    recordsData.value = data.value.filter((el) => {
      const isYesOrNo = el.data.find((e) => e.alias == 'YesNo_ID')?.value;
      const isConfirm = el.data.find((e) => e.alias == 'IsConfirm')?.value;
      const isDenied = el.data.find((e) => e.alias == 'IsDenied')?.value;

      return el.data.find((item) => {
        if (item.alias == nameAlias || item.alias == organizationAlias) {
          if (isYesOrNo) {
            if (
              (filterConfirm.value ? isYesOrNo == '1' : true) &&
              (filterDenied.value ? isYesOrNo == '2' : true) &&
              (filterNotProcessed.value ? isYesOrNo === null : true)
            ) {
              item.value == null ? (item.value = '') : item.value;
              return (item.value as string).toLowerCase().includes((e as string).toLowerCase());
            }
          } else {
            if (
              (filterConfirm.value ? isConfirm === filterConfirm.value : true) &&
              (filterDenied.value ? isDenied === filterDenied.value : true) &&
              (filterNotProcessed.value ? !isConfirm && !isDenied : true)
            ) {
              item.value == null ? (item.value = '') : item.value;
              return (item.value as string).toLowerCase().includes((e as string).toLowerCase());
            }
          }
        }
      });
    });
    createDisplayValues(recordsData.value);
  }
};

// const onWindowResize = () => {
//   // console.log(window.innerWidth);
// };

watch(data, (n) => {
  if (n) {
    recordsData.value = data.value;
    createDisplayValues(recordsData.value);
  }
});

onMounted(() => {
  updateTabsInfo(reqTab.value);
  // window.addEventListener('resize', onWindowResize);
});

// onUnmounted(() => {
//   window.removeEventListener('resize', onWindowResize);
// });
defineExpose({ updateTabsInfo });
</script>

<style lang="scss">
.status-color-green {
  color: rgb(34, 192, 34);
}
.status-color-red {
  color: rgb(204, 26, 26);
}
.status-color-blue {
  color: rgb(36, 36, 201);
}
.status-color-region {
  color: rgb(228, 152, 12);
}
.minagro-usercheck-main-card {
  // width: 100vw;
  height: calc(100vh - 52px);
  border-radius: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgb(220, 220, 220);
}
.minagro-usercheck-form-card {
  width: 90%;
  min-width: 350px;
  max-width: 800px;
  height: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: row;
  background-color: transparent;
}
.minagro-usercheck-form-requests {
  // max-width: 70%;
  // min-width: 300px;
  width: 100%;
  border-radius: 0 !important;
  padding: 0;
  // margin-right: 16px;
  border-radius: 12px !important;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

.minagro-usercheck-form-label {
  // max-width: 160px;
  flex: none !important;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
}
.minagro-usercheck-form-review__item {
  // height: 60px;
  border-radius: 5px;
  // background-color: #f5f7fa;
  // margin-bottom: 9px;
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.minagro-usercheck-form-review__label {
  font-size: 18px;
  text-align: center;
  height: 50px;
  border-bottom: 1px solid #5555 !important;
  padding: 0px 16px;
}
.minagro-usercheck-form-review__list {
  display: flex;
  // scrollbar-gutter: stable;
  padding: 16px 16px 16px 3em;
  // background-color: #5555;
  border-radius: 15px;
}
.tabs-container > .q-tabs {
  height: 50px !important;
}
.minagro-usercheck-form-label__name {
  font-size: 15px;
  text-align: end;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}
.minagro-usercheck-form-label__org {
  display: flex;
  font-size: 12px;
  text-align: end;
  color: black;
  max-width: 209px;
  max-height: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}
.minagro-usercheck-form-review__item-col {
  padding-left: 0;
  padding-right: 0;
  text-align: center;
}

.minagro-usercheck-form-review__item-label {
  font-size: 12px;
  color: #555555;
  max-width: 350px;
  max-height: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding-bottom: 5px;
}

.minagro-usercheck-form-review__item-value {
  font-size: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  display: block;
}

.minagro-usercheck-form-review__label-buttons {
  display: flex;
  justify-content: end;
  margin: 8px;
}
.label-button {
  background-color: #f5f7fa;
  margin-left: 10px;
  border-radius: 10px;
}
.label-button-positive:hover {
  background-color: var(--q-positive);
  color: white;
  transition: 0.4s;
}
.label-button-negative:hover {
  background-color: var(--q-negative);
  color: white;
  transition: 0.4s;
}
.minagro-usercheck-form-items__date-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px;
  color: black !important;
  user-select: none;
  max-width: fit-content;
  min-width: 80px;
}
.minagro-usercheck-form-scroll {
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: auto;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tabs-container {
  display: flex;
  flex-direction: row;
  border-radius: 12px 12px 0px 0px;
  align-items: center;
}
.minagro-usercheck-form-tabs {
  display: flex;
  flex-direction: row;
  width: auto;
  max-width: 470px;
}
.minagro-usercheck-null-value {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  color: rgb(134, 134, 134);
  // min-height: 18px;
  max-height: 25px;
}
.minagro-usercheck-expansion {
  width: 100%;
}

// .minagro-usercheck-form-review__list--active {
//   height: calc(100% - 50px);
//   margin: 10px 0px;
//   // box-shadow: 0 0 5px 0 #5555;
//   transition: 1.4s;
// }
// .minagro-usercheck-form-review__list--inActive {
//   height: 0;
//   margin: 0px 20px;
//   transition: 0.4s;
//   visibility: hidden;
// }
.q-expansion-item__content {
  transition: 0.4s;
}
.minagro-usercheck-notes {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.skeleton-value {
  display: flex;
  min-height: 45px;
  width: 100%;
}
.user-checking-no-data {
  font-size: 1.3em;
  text-align: center;
  color: gray;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
}
</style>
