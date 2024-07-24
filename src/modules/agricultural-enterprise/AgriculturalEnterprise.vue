<template>
  <main-wrapper
      :full-screen-mode="false"
      :stepper-mode="false"
      @module-start-view="moduleStartView"
      @module-end-view="emit('moduleEndView')"
  >
    <div class="agricultural-enterprise">
      <div class="agricultural-enterprise-card">
        <div class="card-tabs">
          <q-tabs
              class="tabs text-grey"
              active-color="primary"
              indicator-color="primary"
              v-model="activeTab"
              narrow-indicator
          >
            <q-tab
                name="actual"
                label="Предприятия"
            />

          </q-tabs>
          <q-input
              class="search-input"
              filled
              dense
              :placeholder="props.searchField ?? 'Поиск'"
              :model-value="props.searchText"
              @update:model-value="emit('update:searchText', $event)"
              @keyup.enter="emit('updateFilter')"
          >
            <template v-slot:append>
              <q-icon v-if="props.searchText == ''" name="search" color="primary"/>
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
        </div>
        <q-scroll-area
            v-scroll-area-show
            class="tab-panels-scroll"
            :style="
              activeTab == 'actual'
                ? 'height: calc(100% - 72px - 32px)'
                : 'height: calc(100% - 108px - 32px)'
            "
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
                  labelTemplate: 'Name',
                  icon: 'business',
                  }"
                  @save-edited-record="emit('saveEditedRecord', $event)"
                  @attach-file="emit('attachFile', $event)"
                  @show-expansion="emit('showExpansion', $event)"
                  @delete-file="emit('deleteFile',$event)"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
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
</template>

<script setup lang="ts">
import {QInput, QIcon, QScrollArea, QTab, QTabs, QTabPanels, QTabPanel, QLinearProgress} from 'quasar'
import { ref } from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import ExpansionFieldsList from './ExpansionFieldList.vue'
import {Table, Data, IRecord, IFile} from './Types'

const props = defineProps<{
  actualTable: Table
  searchField?: string
  isLoading: boolean;
  displayData: IRecord[];
  searchText: string;


}>()


const emit = defineEmits<{
  (e: 'moduleStartView'): void,
  (e: 'moduleEndView'): void,
  (
      e: 'saveEditedRecord',
      val: {
        recordId: number
        data: Data[]
      },
  ): void,
  (
      e: 'attachFile',
      val: {
        record: IRecord
        file: File
      },
  ): void,
  (
      e: 'showExpansion',
      val: IRecord,
  ): void,
  (e: 'targetHasAppeared', el: Element): void,
  (e: 'update:searchText', val: string | number | null): void,
  (e: 'updateFilter'): void,
  (
      e:'deleteFile',
      val: {
        record: IRecord
        file: IFile
      },
  ): void

}>()

const vScrollAreaShow = {
  mounted: (el: Element) => {
    const target = el.querySelector(':first-child');
    if (!target) return;

    emit('targetHasAppeared', target);
  },
};

const moduleStartView = () => {
  emit('moduleStartView')
}

const activeTab = ref('actual')




</script>

<style scoped>
.agricultural-enterprise {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.agricultural-enterprise-card {
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
.agricultural-enterprise-card > .card-tabs {
  display: flex;
  align-items: center;
}
.agricultural-enterprise-card > .card-tabs > .tabs {
  flex-grow: 2;
}
.agricultural-enterprise-card > .card-tabs > .search-input {
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
.agricultural-enterprise-btn{
  margin: 16px;
}
</style>
