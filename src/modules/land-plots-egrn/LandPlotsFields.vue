<template>
  <main-wrapper
      :full-screen-mode="false"
      :stepper-mode="false"
      @module-start-view="moduleStartView"
      @module-end-view="emit('moduleEndView')"
  >
    <div class="land-plots-fields">
      <div class="land-plots-fields-card">
        <div class="card-tabs">
          <q-tabs
              class="tabs text-grey"
              active-color="primary"
              indicator-color="primary"
              v-model="activeTab"
              narrow-indicator
              inline-label
              outside-arrows
              mobile-arrows
          >
            <q-tab
                name="actual"
                label="Земельные участки (ЕГРН)"
            />
            <q-tab
                name="noAccepted"
                label="Запросы на изменения ЗУ"
                v-if="!minsRole"
                @click="updateNoAcceptedPlots()"
            />
          </q-tabs>
          <q-input
              class="search-input"
              :style="
                activeTab == 'actual'
                ? 'display: flex;' : 'display: none;'
              "
              v-model="searchText"
              placeholder="Поиск по Кадастр. №"
              filled
              dense
              @update:model-value="emit('update:searchText', $event)"
              @keyup.enter="emit('updateFilter')"
          >
            <template v-slot:append>
              <q-icon
                  v-if="searchText === ''"
                  name="search"
                  color="primary"
              />
              <q-icon
                  v-else
                  class="cursor-pointer"
                  name="clear"
                  color="grey"
                  @click="
                    emit('update:searchText', '');
                    emit('updateFilter');
                    emit('refreshAll');
                  "
              />
            </template>
          </q-input>
          <q-input
              class="search-input"
              :style="
                activeTab == 'noAccepted'
                ? 'display: flex;' : 'display: none;'
              "
              v-model="searchTextNoAccepted"
              placeholder="Поиск по Кадастр. №"
              filled
              dense
              @update:model-value="emit('update:searchTextNoAccepted', $event)"
          >
            <template v-slot:append>
              <q-icon
                  v-if="searchTextNoAccepted === ''"
                  name="search"
                  color="primary"
              />
              <q-icon
                  v-else
                  class="cursor-pointer"
                  name="clear"
                  color="grey"
                  @click="
                    emit('update:searchTextNoAccepted', '');
                    emit('refreshAll');
                  "
              />
            </template>
          </q-input>
          <q-card-section class="button-in-tabs">
            <q-btn
                @click="emit('refreshAll');"
                icon="refresh"
                color="white"
                text-color="primary"
                flat
                round
            >
              <q-tooltip>
                Обновить
              </q-tooltip>
            </q-btn>
            <q-btn
                v-if="minsRole"
                color="primary"
                class="q-ml-sm"
                @click="emit('startImportEGRNXmlProcedure');"
            >
              <q-icon
                  name="download"
              />
              <q-tooltip>
                Импорт выписок ЕГРН (XML)
              </q-tooltip>
            </q-btn>
          </q-card-section>
        </div>
        <q-scroll-area
            v-show="activeTab == 'actual'"
            v-scroll-area-show
            class="tab-panels-scroll"
            :style="'height: calc(90% - 72px - 32px)'"
        >
          <q-tab-panels
              v-model="activeTab"
              animated
          >
            <q-tab-panel name="actual">
              <ExpansionFieldsList
                  :records="props.displayData"
                  :is-loading="props.isLoading"
                  :item-settings="{
                    labelTemplate: 'CadNum',
                    captionTemplate: 'Square',
                    icon: 'pin_drop',
                  }"
                  positioning-capability
                  @delete-record="deleteRecord($event)"
                  @delete-file="emit('deleteFile',$event)"
                  @save="emit('saveEditedRecord', $event)"
                  @attach-file="emit('attachFile', $event)"
                  @show-expansion="emit('showExpansion', $event)"
                  @position-on-object="positioning($event)"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>

        <q-scroll-area
            v-show="activeTab != 'actual'"
            class="tab-panels-scroll"
            :style="'height: calc(90% - 108px - 32px)'"
        >
          <q-tab-panels
              v-model="activeTab"
              animated
          >
            <q-tab-panel name="noAccepted">
              <NoAcceptedFieldsList
                readonly
                :records="test"
                :is-loading="props.isLoading"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>

        <q-card-section v-if="!minsRole" class="button-add-land-plots">
          <q-btn
              color="primary"
              label="Добавить земельные участки"
              @click="openDialog = true;"/>
        </q-card-section>

        <q-linear-progress
          v-show="props.isLoading"
          style="top: -6px"
          size="6px"
          indeterminate
          color="primary"
      />

      </div>
    </div>
  </main-wrapper>

  <q-dialog v-model="openDialog">
    <q-card class="dialog-add-land-plots">
      <q-card-section class="row items-center q-pb-none row">
        <div class="text-h6">Введите кадастровые номера</div>
        <q-btn icon="close" flat round dense v-close-popup @click="openDialog = false" />
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
            dense
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add-unique"
            @beforeinput="beforeInputNumbers($event, cadastralNumbers)"
            @blur="beforeInputNumbersBlur($event.target.value, cadastralNumbers)"
        >
          <template v-slot:selected-item="scope">
            <q-chip
                style="cursor: pointer"
                :color="validateCadastralNumber(scope.opt) ? 'white' : 'red-11'"
                :text-color="validateCadastralNumber(scope.opt) ? 'primary' : 'white'"
                icon-remove="clear"
                square
                removable
                dense
                :tabindex="scope.tabindex"
                @remove="scope.removeAtIndex(scope.index)"
            >
              <div
                  class="cadastral-numbers-chip"
                  @click="editChip(scope, cadastralNumbersRef)"
              >
                {{ scope.opt }}
              </div>
              <q-tooltip v-if="!validateCadastralNumber(scope.opt)">
                Некорректный формат кадастрового номера, этот номер не будет загружен
              </q-tooltip>
            </q-chip>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section class="button-add-land-plots">
        <q-btn
            color="primary"
            label="Добавить земельные участки"
            @click="addRecord(cadastralNumbers);"
            v-close-popup />
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  QTabs,
  QTab,
  QInput,
  QIcon,
  QScrollArea,
  QTabPanels,
  QTabPanel,
  QBtn,
  QDialog,
  QCardSection,
  QSelect,
  QChip,
  QTooltip,
  QCard,
  QLinearProgress,
  useQuasar
  } from 'quasar'
import { ref, toRefs, computed } from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import ExpansionFieldsList from './ExpansionFieldsList.vue'
import NoAcceptedFieldsList from './NoAcceptedFieldsList.vue'
import { IRecord, IData, INoAcceptedRecord, IChipScope, IFile } from './types.ts'

const cadastralNumbersRef = ref()
const cadastralNumbers = ref<string[]>([]);

const props = defineProps<{
  noAcceptedPlots: INoAcceptedRecord[]
  minsRole?: boolean
  displayData: IRecord[]
  isLoading: boolean;
  searchText: string;
  searchTextNoAccepted: string;
}>()

const { searchText } = toRefs(props);

const beforeInputNumbers = (e: InputEvent, model: string[]) => {
  if (!e.data) return

  if (e.data == ',' || e.data == ' ') {
    e.preventDefault()

    const keydownEnter = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 13,
        });

    (e.target as HTMLInputElement).dispatchEvent(keydownEnter);
  } else if (/[\s.,;|/\\]/.test(e.data) && e.data.length > 1) {
    e.preventDefault()

    const newCadastralNumbers = e.data.split(/[\s.,;|/\\]/).filter(el => !!el)
    newCadastralNumbers.forEach(el => {
      if (!model.includes(el)) {
        model.push(el)
      }
    })
  }
}

const beforeInputNumbersBlur = (data: string, model: string[]) => {
  if (!data) return

  if (/[\s.,;|/\\]/.test(data) && data.length > 1) {
    const newCadastralNumbers = data.split(/[\s.,;|/\\]/).filter(el => !!el)
    newCadastralNumbers.forEach((el:string) => {
      if (!model.includes(el)) {
        model.push(el)
      }
    })
  } else {
    if (!model.includes(data)) {
      model.push(data)
    }
  }
}

const validateCadastralNumber = (cadNum: string) => {
  const regex = /^\d{2}:\d{2}:\d{6,7}:\d{1,5}$/
  return regex.test(cadNum)
}

const { noAcceptedPlots, searchTextNoAccepted } = toRefs(props)

const emit = defineEmits<{
  (e: 'moduleStartView'): void,
  (e: 'moduleEndView'): void,
  (e: 'startImportEGRNXmlProcedure'): void,
  (
      e: 'saveEditedRecord',
      val: {
        recordId: number
        data: IData[]
      },
  ): void,
  (
      e: 'addNewRecord',
      val: string[],
  ): void,
  (
      e: 'deleteRecordByCadNum',
      val: string | number | null | undefined,
  ): void,
  (
      e: 'attachFile',
      val: {
        record: IRecord,
        file: File
      },
  ): void,
  (
      e: 'positionOnObject',
      val: {
        recordId: number
      },
  ): void,
  (
      e: 'showExpansion',
      val: IRecord,
  ): void,
  (e: 'targetHasAppeared', el: Element): void;
  (e: 'updateFilter'): void;
  (e: 'refreshAll'): void;
  (e: 'update:searchText', val: string | number | null): void;
  (e: 'update:searchTextNoAccepted', val: string | number | null): void;
  (e: 'updateNoAcceptedPlots'): void;
  (e: 'deleteFile',
   val: {
    file: IFile,
    item: IRecord
  }): void;
}>()

const moduleStartView = () => {
  emit('moduleStartView')
}

const openDialog = ref(false)
const activeTab = ref('actual')

const vScrollAreaShow = {
  mounted: (el: Element) => {
    const target = el.querySelector(':first-child');
    if (!target) return;

    emit('targetHasAppeared', target);
  },
};

const updateNoAcceptedPlots = () => {
    emit('updateNoAcceptedPlots');
}

const addRecord = (cadNumbers: string[]) => {
  if (isValidCadNums.value) {
    emit('addNewRecord', cadNumbers);
    cadastralNumbers.value = [];
    openDialog.value = false;
    notifyMessage().triggerPositive();
  } else {
    notifyMessage().triggerNegative();
  }
}

const deleteRecord = (e: string | number | null | undefined) => {
  emit('deleteRecordByCadNum', e)
}

const positioning = (recordId: number) => {
  emit('positionOnObject', { recordId })
}

const editChip = (scope: IChipScope, target: QSelect) => {
  scope.removeAtIndex(scope.index)
  target.updateInputValue(scope.opt)
}

const test = computed(()=>{
  if(searchTextNoAccepted.value?.length) {
    return noAcceptedPlots.value.filter(el => {
      return el.value.includes(searchTextNoAccepted.value);
    })
  }else{
    return noAcceptedPlots.value ?? []
  }
})

const isValidCadNums = computed(
    () => {
      let isValid = true;
      cadastralNumbers.value.forEach(
          el => {
            if (!validateCadastralNumber(el))
              isValid = false;
          }
      );
      return isValid;
    }
);

const $q = useQuasar()

const notifyMessage = () => {
  return {
    triggerNegative() {
      $q.notify({
        type: 'negative',
        timeout: 5000,
        message: 'Один или несколько введенных кадастровых номеров некоректны'
      })
    },

    triggerPositive() {
      $q.notify({
        type: 'positive',
        timeout: 5000,
        message: 'Сообщение на добавление отправлено'
      })
    },
  }
}


</script>

<style>
.land-plots-fields {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.land-plots-fields-card {
  width: 90%;
  height: 90%;
  min-width: 300px;
  max-width: 800px;
  max-height: 90%;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
}
.land-plots-fields-card > .card-tabs {
  display: flex;
  align-items: center;
}
.land-plots-fields-card > .card-tabs > .tabs {
  flex-grow: 2;
}
.land-plots-fields-card > .card-tabs > .search-input {
  padding: 16px;
  flex-grow: 1;
}
.tab-panels-scroll {
  margin: 16px;
  flex: auto;
}
.tab-panels-scroll .q-tab-panel {
  padding: 0 !important;
}
.button-add-land-plots {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-add-land-plots > .button-add-land-plots {
  margin-bottom: 5%;
}
.dialog-add-land-plots > div:first-child {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.land-plots-fields-card > .button-add-land-plots {
  height: 10%;
}
div > .dialog-add-land-plots {
  width: 100%;
  height: 50%;
  min-width: 300px;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
  background: white;
}
.land-plots-fields-card > .card-tabs > .q-tabs  {
  width: 70%;
}
.red-text-for-employee {
  color: red;
  text-align: center;
}
.button-in-tabs {
  display: flex;
  justify-content: space-around;
}
.button-in-tabs,
.button-in-tabs > q-btn {
  height: 100%;
}
@media screen and (max-width: 468px) {
  .land-plots-fields-card > .card-tabs > .search-input,
  .land-plots-fields-card > .card-tabs > .q-tabs {
    width: 100%;
  }
  .button-in-tabs {
    padding-top: 0;
    padding-bottom: 0;
  }
  .land-plots-fields-card > .card-tabs {
    flex-direction: column;
  }
  .card-import-button {
    width: 100%;
  }
  .card-import-button > .q-btn {
    width: 100%;
  }
  .button-add-land-plots > .q-btn {
    width: 100%;
  }
}
</style>
