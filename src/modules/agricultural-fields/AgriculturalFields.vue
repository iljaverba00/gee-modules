<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="moduleStartView"
    @module-end-view="emit('moduleEndView')"
  >
    <div class="agricultural-fields">
      <div class="agricultural-fields-card">
        <div class="card-tabs">
          <q-tabs
            class="tabs text-grey"
            active-color="primary"
            indicator-color="primary"
            v-model="activeTab"
            narrow-indicator
          >
            <q-tab :name="props.currentYear" label="Сельхозполя" />
            <q-tab v-if="props.showAddBtn" name="requests" label="Запросы" />
            <q-tab name="archive" icon="archive">
              <q-tooltip :delay="400">Архивные данные (за прошлые года)</q-tooltip>
            </q-tab>
          </q-tabs>

          <q-input
            class="search-input"
            filled
            dense
            :placeholder="props.searchField ?? 'Поиск'"
            :disable="activeTab != props.currentYear"
            :model-value="props.searchText"
            @update:model-value="emit('update:searchText', $event)"
            @keyup.enter="emit('updateFilter')"
          >
            <template v-slot:append>
              <q-icon v-if="props.searchText == ''" name="search" color="primary" />
              <q-icon
                v-else
                class="cursor-pointer"
                name="clear"
                color="grey"
                @click="
                  emit('update:searchText', '');
                  emit('updateFilter');
                "
              />
            </template>
          </q-input>

          <q-btn
            style="margin: 16px"
            dense
            round
            flat
            icon="refresh"
            color="primary"
            :disable="props.isLoading"
            @click="emit('refresh')"
          >
            <q-tooltip :delay="600"> Обновить данные </q-tooltip>
          </q-btn>
        </div>

        <div v-if="activeTab == 'archive'">
          <q-tabs
            class="tabs text-grey"
            active-color="primary"
            indicator-color="primary"
            v-model="archiveTab"
            dense
            narrow-indicator
            outside-arrows
            shrink
            align="justify"
          >
            <q-tab v-for="year of archiveYears" :key="year" :name="year" :label="year" />
          </q-tabs>
        </div>

        <q-scroll-area
          v-scroll-area-show
          class="tab-panels-scroll"
          :style="
            (activeTab == props.currentYear && !props.showAddBtn) || activeTab == 'requests'
              ? 'height: calc(100% - 72px - 32px)'
              : activeTab == props.currentYear && props.showAddBtn
              ? 'height: calc(100% - 128px - 32px)'
              : 'height: calc(100% - 122px - 32px)'
          "
        >
          <q-tab-panels v-model="activeTab">
            <q-tab-panel :name="props.currentYear">
              <ExpansionFieldsList
                :records="props.displayData"
                :is-loading="props.isLoading"
                :item-settings="{
                  labelTemplate: 'Terr_CadNum',
                  captionTemplate: 'SubjContNumb',
                  icon: 'grass',
                }"
                positioning-capability
                :show-delete-btn="props.showAddBtn"
                @save="emit('saveEditedRecord', $event)"
                @position-on-object="positioning($event, props.currentYear)"
                @deletion-request="emit('deletionRequest', $event)"
              />
            </q-tab-panel>

            <q-tab-panel name="requests">
              <RequestsFieldsList :records="props.displayData" :is-loading="props.isLoading" />
            </q-tab-panel>

            <q-tab-panel name="archive">
              <q-tab-panels v-model="archiveTab" outside-arrows>
                <q-tab-panel v-for="year of archiveYears" :key="year" :name="year">
                  <ExpansionFieldsList
                    readonly
                    :records="props.displayData"
                    :is-loading="props.isLoading"
                    :item-settings="{
                      labelTemplate: 'Terr_CadNum',
                      captionTemplate: 'SubjContNumb',
                      icon: 'grass',
                    }"
                  />
                </q-tab-panel>
              </q-tab-panels>
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>

        <div v-if="props.showAddBtn && activeTab == props.currentYear" class="add-btn-container">
          <q-btn
            style="width: 100%; height: 40px"
            no-caps
            unelevated
            :disable="props.isLoading"
            color="primary"
            label="Добавить сельхозполе"
            @click="showDialogAdd = true"
          />
        </div>

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

  <AddFieldsDialog v-model="showDialogAdd" @add-field="emit('addField', $event)" />
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
  QLinearProgress,
  QTooltip,
  QBtn,
} from 'quasar';
import { ref, watch } from 'vue';
import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import ExpansionFieldsList from './ExpansionFieldsList.vue';
import AddFieldsDialog from './AddFieldsDialog.vue';
import RequestsFieldsList from './RequestsFieldsList.vue';
import { IRecord, IData } from './Types.ts';

const props = defineProps<{
  currentYear: number;
  archiveYears: number[];
  displayData: IRecord[];
  isLoading: boolean;
  searchField?: string;
  searchText: string;
  showAddBtn: boolean;
}>();

const emit = defineEmits<{
  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;
  (
    e: 'positionOnObject',
    v: {
      recordId: number;
      key: number;
    },
  ): void;
  (
    e: 'saveEditedRecord',
    v: {
      recordId: number;
      data: IData[];
    },
  ): void;
  (e: 'targetHasAppeared', el: Element): void;
  (e: 'update:searchText', val: string | number | null): void;
  (e: 'update:activeYear', val: string | number): void;
  (e: 'updateFilter'): void;
  (e: 'refresh'): void;
  (e: 'deletionRequest', record: IRecord | undefined): void;
  (e: 'addField', val: string[]): void;
}>();

const vScrollAreaShow = {
  mounted: (el: Element) => {
    const target = el.querySelector(':first-child');
    if (!target) return;

    emit('targetHasAppeared', target);
  },
};

const moduleStartView = () => {
  emit('moduleStartView');
};

const activeTab = ref<string | number>(props.currentYear);
const archiveTab = ref(props.archiveYears.at(-1) as number);

const showDialogAdd = ref(false);

watch(activeTab, (year) => {
  if (year == 'archive') {
    archiveTab.value = props.archiveYears.at(-1) as number;
    emit('update:activeYear', archiveTab.value);
  } else if (year == 'requests') {
    emit('update:activeYear', 0);
  } else if (year == props.currentYear) {
    emit('update:activeYear', year);
  }
});

watch(archiveTab, (year) => {
  emit('update:activeYear', year);
});

const positioning = (recordId: number, key: number) => {
  emit('positionOnObject', { recordId, key });
};
</script>

<style>
.agricultural-fields {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.agricultural-fields-card {
  width: 90%;
  height: 90%;
  min-width: 300px;
  max-width: 800px;
  max-height: 90%;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
  background: white;
}
.agricultural-fields-card > .card-tabs {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.agricultural-fields-card > .card-tabs > .tabs {
  flex-grow: 2;
}
.agricultural-fields-card > .card-tabs > .search-input {
  padding: 16px 0 16px 16px;
  flex-grow: 1;
}
.tab-panels-scroll {
  margin: 16px;
  flex: auto;
}
.add-btn-container {
  padding: 0 16px 16px;
}
.tab-panels-scroll .q-tab-panel {
  padding: 0 !important;
}
</style>
