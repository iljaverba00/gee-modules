<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="moduleStartView"
    @module-end-view="emit('moduleEndView')"
  >
    <div class="state-support-fields">
      <div class="state-support-fields-card">
        <div class="card-tabs">
          <q-tabs
            class="tabs text-grey"
            active-color="primary"
            indicator-color="primary"
            v-model="activeTab"
            narrow-indicator
          >
            <q-tab name="state" label="Господдержка АПК" />
            <!--  <q-tab
              name="status"
              label="Статус данных"
            /> -->
          </q-tabs>

          <q-select
            style="width: 20%"
            class="q-mx-xs"
            label="Сельхозпроизводитель"
            @update:model-value="emit('update:SCompany', $event)"
            @filter="filterSCompany"
            :modelValue="SCompany"
            :options="optionsSCompany"
            dense
            clearable
            options-dense
            emit-value
            outlined
            map-options
            use-input
            hide-selected
            fill-input
            input-debounce="0"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Нет данных </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            style="width: 30%"
            class="q-mx-xs"
            label="Cубсидии"
            @update:model-value="$emit('update:subsidie', $event)"
            @filter="filterSubsidie"
            :modelValue="subsidie"
            :options="optionsSubsidie"
            dense
            options-dense
            clearable
            emit-value
            outlined
            map-options
            use-input
            hide-selected
            fill-input
            input-debounce="0"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Нет данных </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            style="width: 10%; margin-right: 16px"
            class="q-ml-xs"
            label="Год"
            @update:model-value="$emit('update:year', $event)"
            :modelValue="year"
            :options="optionsYear"
            dense
            options-dense
            outlined
            map-options
            fill-input
            input-debounce="0"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Нет данных </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <q-scroll-area class="tab-panels-scroll" style="height: calc(100% - 108px - 32px)">
          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="state">
              <div class="spinner" v-if="load">
                <q-spinner color="primary" size="100px" />
              </div>

              <q-list
                v-else-if="Object.keys(groupSubsidyInfoDto)?.length"
                class="rounded-borders"
                bordered
              >
                <q-card class="my-card">
                  <q-expansion-item
                    v-for="(groupValue, groupName) in groupSubsidyInfoDto"
                    :key="groupValue"
                    expand-separator
                    icon="insert_comment"
                  >
                    <q-separator />
                    <template v-slot:header>
                      <q-item-section>
                        <q-item-label>
                          {{ groupName }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        {{ `сумма ${getSumm(groupValue)}` }}
                      </q-item-section>
                    </template>
                    <q-card v-for="valueObj in groupValue" :key="valueObj.id">
                      <q-separator />
                      <div v-for="(value, name) in valueObj.data" :key="name">
                        <q-card-section class="no-padding">
                          <q-item clickable>
                            <q-item-section>
                              {{ value.label }}
                            </q-item-section>
                            <q-item-section>
                              {{ value.value }}
                            </q-item-section>
                          </q-item>
                        </q-card-section>
                      </div>
                    </q-card>
                  </q-expansion-item>
                  <q-separator />
                </q-card>
              </q-list>

              <div v-else class="no-data">Нет данных</div>
            </q-tab-panel>

            <q-tab-panel name="status"> titleTTT </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
      </div>
    </div>
  </main-wrapper>
</template>

<script setup lang="ts">
import {
  QTabs,
  QTab,
  QScrollArea,
  QTabPanels,
  QTabPanel,
  QList,
  QCard,
  QExpansionItem,
  QSeparator,
  QCardSection,
  QItem,
  QItemSection,
  QItemLabel,
  QSpinner,
  QSelect,
} from 'quasar';

import { ref, toRefs } from 'vue';
import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import { GroupingSubsidyInfoDto, ListSubsidyInfoDto } from './Type';

const props = defineProps<{
  groupSubsidyInfoDto: GroupingSubsidyInfoDto;
  load: boolean;

  subsidie: string;
  year: string;
  optionsYear: string[];
  SCompany: string;
}>();
const { subsidie, year } = toRefs(props);

const activeTab = ref('state');
// const searchText = ref('');

const optionsSubsidie = ref<string[]>([]);
const optionsSCompany = ref<string[]>([]);

const emit = defineEmits<{
  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;

  (e: 'update:subsidie', value: string): void;
  (e: 'update:year', value: string): void;
  (e: 'update:SCompany', value: string): void;
  (
    e: 'loadSubsidieOption',
    val: {
      text: string;
      callback: (value: string[]) => void;
    },
  ): void;
  (
    e: 'loadSCompanyOption',
    val: {
      text: string;
      callback: (value: string[]) => void;
    },
  ): void;
}>();

const moduleStartView = () => {
  emit('moduleStartView');
};

// const send = () => {
//   emit('onSend', searchText.value);
// };

const filterSubsidie = (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  emit('loadSubsidieOption', {
    text: val,
    callback: (val) => {
      update(() => {
        optionsSubsidie.value = val;
      });
    },
  });
};

const filterSCompany = (
  val: string,
  update: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  val;
  emit('loadSCompanyOption', {
    text: val,
    callback: (val) => {
      update(() => {
        optionsSCompany.value = val;
      });
    },
  });
};

const getSumm = (groupValue:ListSubsidyInfoDto[])=>{
  let sumOfNumbers = 0
  try {
    sumOfNumbers = groupValue.reduce((acc, value) => isNaN(value.data.Sum.value as number) ? acc :  acc + (value.data.Sum.value as number), 0);
    return sumOfNumbers
  } catch (error) {
    return sumOfNumbers
  }
  
}


// const caption = (item: IRecord) => {
//   const captionItem = item.data.find(el => el.alias === props.itemSettings.captionTemplate)
//   return !captionItem ? '' : `${captionItem.name} ${captionItem.value ?? 'Не задано'}`
// }
</script>

<style scoped>
.state-support-fields {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.state-support-fields-card {
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
.state-support-fields-card > .card-tabs {
  display: flex;
  align-items: center;
}
.state-support-fields-card > .card-tabs > .tabs {
  flex-grow: 1;
  width: 30%;
  padding: 0;
}
.state-support-fields-card > .card-tabs > .search-input {
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

.no-data {
  width: 100%;
  font-size: 1.3em;
  text-align: center;
  color: gray;
}
.spinner {
  text-align: center;
  height: 250px;
}
</style>
