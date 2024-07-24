<template>
  <MainWrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="emit('moduleStartView')"
    @module-end-view="emit('moduleEndView')"
  >
    <q-card class="minagro-info-form-card">
      <q-list class="minagro-info-form">
        <div :class="sidebarShow ? 'minagro-info-sidebar-show' : 'minagro-info-sidebar-hide'">
          <q-item
            style="height: 50px"
            clickable
            class="justify-center items-center grey-7"
            @click="sideBarAction"
            ><q-icon name="chevron_left" size="sm" class="grey-7" />
          </q-item>
          <q-separator />
          <q-item
            v-for="(item, index) in sidebarItems"
            :key="index"
            :active="item == tableTitle"
            :disable="agroProducer == null"
            active-class="bg-grey-4 text-blue-7"
            clickable
            class="minagro-info-sidebar-item"
            @click="sideItemSelection(index)"
          >
            {{ item }}
            <!-- <q-tooltip transition-show="slide-down" anchor="top middle">{{ item }}</q-tooltip> -->
          </q-item>
        </div>

        <q-list class="minagro-info-part">
          <div class="minagro-info-part__full">
            <q-btn
              :class="
                sidebarShow ? 'minagro-info-form__menu-btn-off' : 'minagro-info-form__menu-btn'
              "
              flat
              dense
              @click="sideBarAction"
            >
              <q-icon class="q-mt-sm q-mr-md q-mb-md q-ml-sm grey-7" name="menu" size="sm" />
            </q-btn>
            <div class="minagro-info-table">
              <div class="table-header">
                <div
                  :class="
                    tableTitle?.length > 50
                      ? 'minagro-info-table__label-long minagro-info-table__label'
                      : 'minagro-info-table__label'
                  "
                >
                  <div>
                    {{ tableTitle }}
                  </div>
                </div>
                <!-- <div
                  v-if="readOnly.message != '' && readOnly.value"
                  class="minagro-info-table__select q-mr-md"
                >
                  <span>{{ readOnly.message }}</span>
                </div> -->
                <div class="minagro-info-table__select">
                  <q-select
                    dense
                    :label="agroSelectLabel"
                    class="toolbar-select"
                    input-style="max-height: 40px"
                    standout="bg-grey-4 text-grey-7"
                    :model-value="agroProducer"
                    :options="agroProducersList"
                    :option-label="'value'"
                    input-class="text-grey-9"
                    popup-content-class="agro-producers-popup-content"
                    use-input
                    @filter="filterUsersFn"
                    @update:model-value="onApplicantChange"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey" style="font-size: 14px">
                          Ничего не найдено
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="minagro-info-table__select q-mr-md">
                  <q-btn-dropdown
                    :label="alternativity.currentYear.label"
                    flat
                    dense
                    style="min-width: 70px; max-width: 70px"
                  >
                    <q-scroll-area class="minagro-info-table__date-scroll">
                      <q-list class="minagro-info-table__date-list">
                        <q-btn
                          v-for="(yearObj, index) in alternativity.otherYears"
                          :key="index"
                          :label="yearObj.label"
                          flat
                          dense
                          v-close-popup
                          @click="onAlternativityChange(yearObj)"
                        />
                      </q-list>
                    </q-scroll-area>
                  </q-btn-dropdown>
                </div>
                <q-btn
                  v-if="!noPermission && !readOnly.value"
                  :disable="!dataToSave.length"
                  dense
                  flat
                  class="save-btn"
                  @click="onSaveAction"
                >
                  <q-icon name="save" />
                </q-btn>
              </div>

              <q-markup-table
                v-if="rows?.length && agroProducer != null"
                flat
                style="height: calc(100% - 50px)"
              >
                <thead>
                  <tr>
                    <th></th>

                    <th>Статус</th>
                    <th v-for="col in columns" :key="col.name" class="minagro-info-table__header">
                      {{ col.label }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="row in rows" :key="row.data.name">
                    <td class="text-right minagro-info-table__body-sticky">
                      <div class="minagro-info-table__td-container">
                        <div class="minagro-info-table__td-content-sticky">
                          <q-btn
                            class="pin-map-btn"
                            icon="pin_drop"
                            flat
                            dense
                            color="primary"
                            @click="onPinClick(row.recordId)"
                          />
                        </div>
                      </div>
                    </td>
                    <!---->
                    <td class="text-right minagro-info-table__body">
                      <div class="minagro-info-table__td-container">
                        <div class="minagro-info-table__td-content">
                          {{ !readOnly.value ? 'Ввод' : 'Подписан' }}
                        </div>
                      </div>
                    </td>
                    <!---->
                    <td
                      v-for="col in columns"
                      :key="col.name"
                      class="text-right minagro-info-table__body"
                    >
                      <div class="minagro-info-table__td-container">
                        <div class="minagro-info-table__td-content">
                          <div v-if="col.type != 'select'">
                            {{ row.data[col.name] }}
                          </div>
                          <template
                            v-if="!noPermission && !readOnly.value && col.type === 'select'"
                          >
                            <q-select
                              v-if="!col.readonly && col.type === 'select'"
                              class="q-select-table"
                              v-model="row.data[col.name]"
                              :options="options"
                              hide-bottom-space
                              dense
                              use-input
                              input-debounce="0"
                              input-class="q-select-table"
                              @input-value="filterFn($event, col.options!)"
                              @popup-show="onPopupShow(col.options!)"
                              @update:model-value="onUpdateModelValue($event, row, col)"
                            >
                              <template #option="scope">
                                <q-list class="options-list">
                                  <q-item v-bind="scope.itemProps" class="options-list__item">
                                    {{ scope.opt.label }}
                                  </q-item>
                                </q-list>
                              </template>
                            </q-select>
                          </template>
                          <template v-else-if="col.type === 'select'"
                            ><div>
                              {{ row.data[col.name] }}
                            </div></template
                          >

                          <q-popup-edit
                            ref="popupEditInputRef"
                            v-if="!col.readonly && col.type == 'input'"
                            :disable="noPermission || readOnly.value"
                            v-model="row.data[col.name]"
                            v-slot="scope"
                          >
                            <q-input
                              v-model="scope.value"
                              dense
                              autofocus
                              counter
                              @keyup.enter="
                                scope.initialValue == scope.value
                                  ? scope.cancel()
                                  : onPopupHideAction(row, col, scope)
                              "
                            >
                              <template #after>
                                <q-btn
                                  flat
                                  dense
                                  color="negative"
                                  icon="close"
                                  @click.stop.prevent="scope.cancel"
                                />
                                <q-btn
                                  flat
                                  dense
                                  color="positive"
                                  icon="done"
                                  @click.stop.prevent="onPopupHideAction(row, col, scope)"
                                  :disable="scope.initialValue == scope.value"
                                />
                              </template>
                            </q-input>
                          </q-popup-edit>
                          <q-popup-edit
                            ref="popupEditDateRef"
                            v-if="!col.readonly && col.type == 'date'"
                            :disable="noPermission || readOnly.value"
                            v-model="row.data[col.name]"
                            v-slot="scope"
                          >
                            <q-date
                              v-model="scope.value"
                              minimal
                              dense
                              flat
                              mask="DD.MM.YYYY"
                              :locale="locale"
                            >
                              <div class="row items-center justify-end q-gutter-sm">
                                <q-btn
                                  flat
                                  dense
                                  label="Отмена"
                                  @click.stop.prevent="scope.cancel"
                                />
                                <q-btn
                                  flat
                                  dense
                                  label="Сохранить"
                                  @click.stop.prevent="onPopupHideAction(row, col, scope)"
                                  :disable="scope.initialValue == scope.value"
                                />
                              </div>
                            </q-date>
                          </q-popup-edit>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
              <!-- <div
                v-else-if="!agroProducersList?.length && isTableLoaded"
                class="information-no-data"
              >
                В таблице нет производителей
              </div> -->
              <div v-else-if="agroProducer == null && isTableLoaded" class="information-no-data">
                Выберите производителя
              </div>
              <div v-else-if="!rows?.length && isTableLoaded" class="information-no-data">
                Нет записей
              </div>
              <q-inner-loading
                :showing="!isTableLoaded"
                label="Пожалуйста, подождите..."
                label-class="text-teal"
                label-style="font-size: 1.1em"
              />
            </div>
          </div>
        </q-list>
      </q-list>
    </q-card>
  </MainWrapper>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
// prettier-ignore
import { QCard, QList, QItem, QItemSection, QBtn, QSeparator, QIcon, QMarkupTable, QPopupEdit, QInput, QInnerLoading, QSelect, QDate, QBtnDropdown, ClosePopup} from 'quasar';
import MainWrapper from '../../components/the-basics/MainWrapper.vue';

import { IColumns, IRows, IOption, ISaveValue, IAlternativity } from './types';

const vClosePopup = ClosePopup;
const locale = {
  days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  daysShort: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
  months: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthsShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июнь',
    'Июль',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
};
const props = defineProps<{
  sidebarItems: string[];
  tableTitle: string;
  rows: IRows[];
  columns: IColumns[];
  isTableLoaded: boolean;
  readOnly: { value: boolean; message: string };
  noPermission: boolean;
  agroSelectLabel: string;
  agroProducer: string;
  agroProducersList: { key: number; value: string }[];
  alternativity: IAlternativity;
}>();

const {
  sidebarItems,
  tableTitle,
  rows,
  columns,
  isTableLoaded,
  readOnly,
  alternativity,
  noPermission,
  agroProducersList,
} = toRefs(props);
const emit = defineEmits<{
  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;
  (e: 'sideBarAction', index: number): void;
  (e: 'onSaveAction', v: ISaveValue[]): void;
  (e: 'changeApplicantUser', v: string): void;
  (e: 'changeAlternativity', v: { label: string; year: string }): void;
  (e: 'turnOnMap', v: number): void;
  (e: 'update:agroProducersList', v: string): void;
}>();

const sidebarShow = ref(false);
const options = ref<IOption[]>([{ id: 0, label: '0' }]);
const dataToSave = ref<ISaveValue[]>([]);
const popupEditInputRef = ref<QPopupEdit[]>();
const popupEditDateRef = ref<QPopupEdit[]>();
// const isElementLoaded = async (selector: string) => {
//   while (document.querySelector(selector) === null) {
//     await new Promise((resolve) => requestAnimationFrame(resolve));
//   }
//   return document.querySelector(selector);
// };

// const getFixedPlaceStyle = (rowIndex: number) => {
//   let height;
//   TBody.value = isElementLoaded('tbody').then((selector) => {
//     height = (selector?.children[rowIndex] as HTMLElement).offsetHeight;
//     return { height: '52px' };
//   });
// };
// const vTbodyShow = {
//   mounted: (el: Element) => {
//     const fixedButtons = document.getElementsByClassName('table-fixed-place');
//     for (let i = 0; i < el.children.length; i++) {
//       (fixedButtons[i] as HTMLElement).style.height = el.children[i].clientHeight - 1 + 'px';
//     }
//   },
// };
const onPinClick = (recordId: number) => {
  emit('turnOnMap', recordId);
};
const onAlternativityChange = (year: { label: string; year: string }) => {
  emit('changeAlternativity', year);
};
const onApplicantChange = (val: string) => {
  emit('changeApplicantUser', val);
};
const sideBarAction = () => {
  sidebarShow.value = !sidebarShow.value;
};
const sideItemSelection = (index: number) => {
  emit('sideBarAction', index);
  sideBarAction();
};

const filterFn = (val: string, opt: IOption[]) => {
  if (val === '') {
    options.value = opt;
  } else {
    const needle = val?.toLowerCase();
    options.value = opt.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  }
};

const onPopupShow = (opt: IOption[]) => {
  options.value = opt;
};

const onSaveAction = () => {
  emit('onSaveAction', dataToSave.value);
  dataToSave.value = [];
};
const onUpdateModelValue = (e: IOption, row: IRows, col: IColumns) => {
  let value = {
    fieldId: col.fieldKey ?? col.name,
    recordId: row.recordId,
  };
  switch (col.type) {
    case 'input':
      Object.assign(value, { value: e.label });
      break;

    case 'date':
      Object.assign(value, { value: e.label });
      break;

    case 'select':
      Object.assign(value, { value: e.id });
      break;

    default:
      Object.assign(value, { value: e.id });
      break;
  }
  let index = null;
  if (e != null) {
    if (dataToSave.value.length < 1) {
      dataToSave.value.push(value);
    } else {
      for (const item of dataToSave.value) {
        if (value.recordId == item.recordId && value.fieldId == item.fieldId) {
          index = dataToSave.value.indexOf(item);
        }
      }
      if (index != null) {
        dataToSave.value.splice(index, 1, value);
      } else {
        dataToSave.value.push(value);
      }
    }
  }
};
const onPopupHideAction = (
  row: IRows,
  col: IColumns,
  scope: { set: () => void; value: string; cancel: () => void },
) => {
  // let origValue;
  if (scope != undefined && scope.value != row.data[col.name]) {
    switch (col.type) {
      case 'input':
        scope.set();
        break;

      case 'date':
        if (col.serverType == 9) {
          scope.set();
          row.data[col.name] = scope.value;
          scope.value = (scope.value as string).split('.').reverse().join('-');
        }
        break;

      default:
        break;
    }
    const saveObject = {
      id: +col.name,
      label: scope.value as string,
    };
    onUpdateModelValue(saveObject, row, col);
    // console.log(dataToSave.value);
  } else {
    scope.cancel;
  }
};
const filterUsersFn = (val: string, update: (callbackFn: () => void) => void) => {
  if (val === '') {
    update(() => {
      emit('update:agroProducersList', val.toLowerCase());
    });
    return;
  }

  update(() => {
    emit('update:agroProducersList', val.toLowerCase());

    // const needle = val.toLowerCase();
    // prodList.value = agroProducersList.value.filter((v) => {
    //   if (v.value != null) {
    //     return v.value.toLowerCase().indexOf(needle) > -1;
    //   }
    // });
  });
};
defineExpose({
  sideBarAction,
});

//Watchers, Hooks
// watch(TBody, () => {
//   while (TBody.value == null) {
//     TBody.value = document.querySelector('tbody');
//   }
//   console.log(TBody.value);
// });
</script>

<style lang="scss">
// .minagro-info-main-card {
//   // width: 100vw;
//   height: calc(100vh - 52px);
//   border-radius: 0;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   background-color: transparent;
// }
.agro-producers-popup-content {
  max-height: 500px !important;
  max-width: 350px !important;
}
.minagro-info-form-card {
  width: 100%;
  height: calc(100vh - 52px);
  min-width: 450px;
  padding: 2em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.minagro-info-form {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  border-radius: 12px !important;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}
.minagro-info-sidebar-show {
  position: absolute;
  z-index: 9999;
  min-width: 30px;
  max-width: 25%;
  height: 100%;
  background-color: #f6f6f9;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: 1px 0px 6px 1px #5555;
  overflow: hidden;
  transition: 0.4s ease-in-out;
}
.minagro-info-sidebar-hide {
  position: absolute;
  z-index: 9999;
  max-width: 0px;
  height: 100%;
  background-color: #f6f6f9;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  overflow: hidden;
  opacity: 0;
  transition: 0.4s ease-in-out;
}
.minagro-info-sidebar-item {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.minagro-info-part {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.minagro-info-part__full {
  width: 100%;
  padding-left: 0px;
  transition: 0.4s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
// .minagro-info-part__opened {
//   padding-left: 30%;
//   transition: 0.4s ease-in-out;
// }
.minagro-info-table {
  width: 90%;
  height: calc(100% - 115px);
  margin-top: 60px;
  border: 1px solid #5555;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}
.minagro-info-table__label-long {
  font-size: 16px !important;
}
.minagro-info-table__label {
  display: flex;
  font-size: 20px;
  letter-spacing: 0.005em;
  font-weight: 400;
  padding-left: 1.5em;
  align-items: center;
  flex: auto;
}
.minagro-info-table__select {
  display: flex;
  // padding-left: 16px;
  align-items: center;
}
.minagro-info-table__date-list {
  width: 100px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}
.minagro-info-table__date-scroll {
  max-height: 290px;
  max-width: 100px;
  height: 290px;
  width: 100px;
}
.minagro-info-table__td-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  background-color: #fff;
}
.pin-map-btn {
  width: 100%;
  height: 100%;
}
.minagro-info-table__td-content {
  padding: 10px;
  width: 100%;
}
.minagro-info-table__td-content-sticky {
  border-right: 1px solid #5555 !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.minagro-info-table__header {
  white-space: break-spaces !important;
}

.minagro-info-table__body {
  border-right: 1px solid #5555 !important;
  padding: 0 !important;
}
.minagro-info-table__body-sticky {
  padding: 0 !important;
  position: sticky !important;
  left: 0 !important;
  background-color: #fff;
  z-index: 10;
}
.minagro-info-table__body:last-child {
  border-right: 0px !important;
}
.minagro-info-form__menu-btn {
  position: absolute;
  top: 0;
  left: 0;
  border-top-left-radius: 12px;
  border-bottom-right-radius: 100px;

  transition: 1.5s;
}
.minagro-info-form__menu-btn-off {
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
  position: absolute;
}
.options-list {
  min-width: 300px;
  max-width: 300px;
}
.table-sticky-place {
  width: 33px;
  min-width: 33px;
  height: 100%;
  max-height: 100%;
}
.table-fixed-place {
  display: flex;
  position: fixed;
  background-color: #fff;
  z-index: 1;
  // height: 100%;
  // max-height: 47px;
  border-right: 1px solid #5555;
}
.options-list__item {
  width: 300px;
  display: block;
  overflow-x: hidden;
  text-overflow: ellipsis;
}
.save-btn {
  margin: 8px 16px 8px 0px;
  color: var(--q-primary);
}
.toolbar-select {
  min-width: 250px;
  max-width: 250px;
  max-height: 40px;
  margin-right: 16px;
}
.table-header {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #5555;
}

.q-select-table
  > .q-field__inner
  > .q-field__control
  > .q-field__control-container
  > .q-field__native {
  min-width: 170px;
}
.q-select-table
  > .q-field__inner
  > .q-field__control
  > .q-field__control-container
  > .q-field__native
  > span {
  max-height: 40px;
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
}

table {
  border-collapse: collapse !important;
}

tbody tr:last-child {
  border-bottom: 1px solid rgb(0, 0, 0, 0.12);
}

.information-no-data {
  font-size: 1.3em;
  text-align: center;
  color: gray;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  user-select: none;
}
//Настройки Q-Select в тулбаре таблицы
.minagro-info-table__select
  > .q-field
  > .q-field__inner
  > .q-field__control
  > .q-field__control-container
  > .q-field__native
  > span {
  color: black !important; //Поменял цвет текста внутри Select
}

.minagro-info-table__select > .q-field > .q-field__inner > .q-field__control {
  box-shadow: none !important; //Убрал тень снаружи Select
  max-height: 40px;
}

.minagro-info-table__select > .q-field > .q-field__inner > .q-field__control > .q-field__append {
  color: black !important; //Поменял цвет dropdown icon
}

.minagro-info-table__select
  > .q-field
  > .q-field__inner
  > .q-field__control
  > .q-field__control-container
  > div
  > span {
  max-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 145px;
}
</style>
