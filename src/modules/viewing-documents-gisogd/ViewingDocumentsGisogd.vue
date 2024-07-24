<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="emit('moduleStartView')"
    @module-end-view="emit('moduleEndView')"
  >
    <div class="viewing-documents-gisogd">
      <div class="viewing-documents-gisogd-content">
        <div class="viewing-documents-gisogd-toolbar">
          <q-btn
            v-if="props.selectedGroupAlias"
            :disable="props.loading"
            color="primary"
            icon="arrow_back_ios_new"
            flat
            dense
            @click="goBack"
          >
            <q-tooltip :delay="400"> Вернуться к списку групп </q-tooltip>
          </q-btn>

          <FilterSelect
            v-model="_district"
            :options="props.districts"
            :disable="props.loading"
            :label="_district?.label || 'Район \\ Городской округ'"
            tooltip="Фильтр по району"
            no-option-text="Пусто"
          />

          <FilterSelect
            v-model="_year"
            :options="props.years"
            :disable="props.loading"
            :label="_year?.label || 'Год'"
            tooltip="Фильтр по году"
            no-option-text="Пусто"
          />

          <q-input v-model="_searchText" :disable="props.loading" placeholder="Поиск" filled dense>
            <template v-slot:append>
              <q-icon name="search" />
            </template>

            <template v-slot:default>
              <q-tooltip :delay="400"> Фильтр по всем полям документа </q-tooltip>
            </template>
          </q-input>

          <q-btn
            :disable="props.loading"
            color="primary"
            icon="refresh"
            flat
            dense
            @click="refresh"
          >
            <q-tooltip :delay="400"> Обновить всё </q-tooltip>
          </q-btn>
        </div>

        <q-scroll-area v-scroll-area-show style="height: 100%">
          <GroupsList
            v-if="props.selectedGroupAlias === null"
            :items="props.groups"
            :loading="props.loading"
            @select-item="emit('update:selectedGroupAlias', $event)"
          />

          <DocumentsList
            v-else
            :items="props.documentsInSelectedGroup"
            :loading="props.loading"
            :parent="props.groups.find((group) => group.alias == props.selectedGroupAlias)"
            @go-place="emit('goPlace', $event)"
            @load-files="emit('loadFiles', $event)"
          />
        </q-scroll-area>

        <div v-if="props.loading" class="viewing-documents-gisogd-loading">
          <q-spinner color="primary" size="5em" :thickness="2" />
        </div>
      </div>
    </div>
  </main-wrapper>
</template>

<script setup lang="ts">
import { QInput, QScrollArea, QBtn, QTooltip, QIcon, QSpinner } from 'quasar';
import { computed } from 'vue';
import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import GroupsList from './GroupsList.vue';
import DocumentsList from './DocumentsList.vue';
import FilterSelect from './FilterSelect.vue';

import type { IGroup, IOption, IDocument, IDoc } from './types';

const props = defineProps<{
  groups: IGroup[];
  documentsInSelectedGroup: null | IDocument[];
  selectedGroupAlias: null | string;
  loading: boolean;

  district: IOption | null;
  year: IOption | null;
  searchText: string;

  districts: IOption[];
  years: IOption[];
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'update:selectedGroupAlias', v: null | string): void;

  (e: 'update:district', v: IOption | null): void;
  (e: 'update:year', v: IOption | null): void;
  (e: 'update:searchText', v: string): void;

  (e: 'goPlace', doc: IDoc): void;
  (e: 'loadFiles', doc: IDoc): void;

  (e: 'targetHasAppeared', target: Element): void;

  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;
}>();

const vScrollAreaShow = {
  mounted: (el: Element) => {
    const target = el.querySelector(':first-child');
    if (!target) return;

    emit('targetHasAppeared', target);
  },
};

const _district = computed({
  get: () => props.district,
  set: (v) => emit('update:district', v),
});

const _year = computed({
  get: () => props.year,
  set: (v) => emit('update:year', v),
});

const _searchText = computed({
  get: () => props.searchText,
  set: (v) => emit('update:searchText', v),
});

const goBack = () => {
  emit('update:selectedGroupAlias', null);
};

const refresh = () => {
  emit('refresh');
};
</script>

<style>
.viewing-documents-gisogd {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.viewing-documents-gisogd-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 90%;
  min-width: 300px;
  max-width: 900px;
  max-height: 90%;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
  background: white;
  padding: 16px;
  gap: 8px;
}
.viewing-documents-gisogd-toolbar {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.viewing-documents-gisogd-toolbar > label {
  flex: 1;
}
.viewing-documents-gisogd-loading {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.03);
  cursor: progress;
}
</style>
