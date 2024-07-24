<template>
  <main-wrapper
      :full-screen-mode="false"
      :stepper-mode="false"
      @module-start-view="moduleStartView"
      @module-end-view="emit('moduleEndView')"
  >
    <div class="emploees-fields">
      <div class="emploees-fields-card">
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
                label="Сотрудники"
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
              ? 'height: calc(90% - 72px - 32px)'
              : 'height: calc(90% - 108px - 32px)'
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
                  captionTemplate: 'SCompany_FullName',
                  icon: 'people',
                }"
                  @save-edited-record="emit('saveEditedRecord', $event)"
                  @attach-file="emit('attachFile', $event)"
                  @deleteRecord="emit('deleteRecord', $event)"
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

        <!--        КАК БЫЛО ИЗНАЧАЛЬНО-->
        <!--        <q-card class="button-add-land-plots">-->
        <!--          <q-btn color="primary" label="Добавить сотрудника (6)" @click="openDialog"/>-->
        <!--            <q-dialog v-model="visibleDialog" class="dialog-info-emploees">-->
        <!--              <q-card class="dialog-add-land-plots" >-->

        <!--              <q-card-section>-->
        <!--                <div class="text-h6">Введите информацию о сотруднике</div>-->
        <!--              </q-card-section>-->

        <!--              <ExpansionFieldsList-->
        <!--                  :records="createRecord"-->
        <!--                  :item-settings="{-->
        <!--                  labelTemplate: 'Name',-->
        <!--                  //captionTemplate: '',-->
        <!--                  icon: 'people',-->
        <!--                }"-->
        <!--                  @save-edited-record="emit('saveEditedRecord', $event)"-->
        <!--                  @attach-file="emit('attachFile', $event)"-->
        <!--              />-->

        <!--              <q-card-section class="button-add-land-plots q-fab__label&#45;&#45;external-bottom">-->
        <!--                <q-btn color="primary" label="Добавить cотрудника" @click="openDialog" v-close-popup/>-->
        <!--              </q-card-section>-->

        <!--            </q-card>-->
        <!--          </q-dialog>-->
        <!--        </q-card>-->


        <!--        КАК БЫЛО ДО ПЕРЕНОСА ВСЕГО В ОТДЕЛЬНЫЙ ВЬЮ-->
        <!--        <AddEmploeesDialog/>-->
        <AddEmploeesDialog
            :fakeRecord="fakeRecord"
            @save-edited-record="emit('saveEditedRecord', $event)"
            @attach-file="emit('attachFile', $event)"
        />
        <!--        <q-card class="button-add-land-plots">-->
        <!--          <q-btn color="primary" label="Добавить сотрудника (13)" @click="openDialog"/>-->
        <!--          <q-dialog v-model="visibleDialog" class="dialog-info-emploees">-->
        <!--            <q-scroll-area-->
        <!--                class="tab-panels-scroll"-->
        <!--                :style="-->
        <!--            activeTab == 'actual'-->
        <!--              ? 'height: calc(90% - 72px - 32px)'-->
        <!--              : 'height: calc(90% - 108px - 32px)'-->
        <!--          "-->
        <!--            >-->

        <!--            <q-card class="dialog-add-land-plots" >-->

        <!--                        <AddEmploeesDialog-->
        <!--                            :createRecord="createRecord"-->
        <!--                        />-->
        <!--&lt;!&ndash;              <AddEmploeesDialog/>&ndash;&gt;-->
        <!--&lt;!&ndash;              <q-card-section>&ndash;&gt;-->
        <!--&lt;!&ndash;                <div class="text-h6">Введите информацию о сотруднике </div>&ndash;&gt;-->
        <!--&lt;!&ndash;              </q-card-section>&ndash;&gt;-->

        <!--&lt;!&ndash;              <ExpansionFieldsList&ndash;&gt;-->
        <!--&lt;!&ndash;                  :records="createRecord"&ndash;&gt;-->
        <!--&lt;!&ndash;                  :item-settings="{&ndash;&gt;-->
        <!--&lt;!&ndash;                  labelTemplate: 'Name',&ndash;&gt;-->
        <!--&lt;!&ndash;                  //captionTemplate: '',&ndash;&gt;-->
        <!--&lt;!&ndash;                  icon: 'people',&ndash;&gt;-->
        <!--&lt;!&ndash;                }"&ndash;&gt;-->
        <!--&lt;!&ndash;                  @save-edited-record="emit('saveEditedRecord', $event)"&ndash;&gt;-->
        <!--&lt;!&ndash;                  @attach-file="emit('attachFile', $event)"&ndash;&gt;-->
        <!--&lt;!&ndash;              />&ndash;&gt;-->

        <!--              <q-card-section class="button-add-land-plots q-fab__label&#45;&#45;external-bottom">-->
        <!--                <q-btn color="primary" label="Добавить cотрудника" @click="openDialog" v-close-popup/>-->
        <!--              </q-card-section>-->

        <!--            </q-card>-->
        <!--            </q-scroll-area>-->
        <!--          </q-dialog>-->
        <!--        </q-card>-->


      </div>
    </div>
  </main-wrapper>
</template>

<script setup lang="ts">
import {
  QInput,
  QIcon,
  QScrollArea,
  QTab,
  QTabs,
  QTabPanels,
  QTabPanel, QLinearProgress,
  // QDialog,
  // QBtn,
  // QCard,
  // QCardSection
} from 'quasar'
import { ref, toRefs } from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import ExpansionFieldsList from './ExpansionFieldLists.vue'
import { ITable, IRecord, IData, IFile } from './types.ts'
import AddEmploeesDialog from './AddEmploeesDialog.vue'



const props = defineProps<{
  actualTable: ITable
  searchField?: string
  fakeRecord: IRecord
  displayData: IRecord[];
  searchText: string;
  isLoading: boolean;
}>()

const {fakeRecord} = toRefs(props)
// const {actualTable} = toRefs(props)

const emit = defineEmits<{
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
  (
      e: 'saveEditedRecord',
      val: {
        recordId: number
        data: IData[]
      },
  ): void,
  (
      e: 'attachFile',
      val: {
        record: IRecord
        file: File
      },
  ): void
  (
    e: 'deleteRecord',
    val: number
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
}
>()

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


/*const searchText = ref('')
const filteredRecords = ref<IRecord[]>([])*/
const activeTab = ref('actual')
//const visibleDialog = ref(false)
//const createRecord = ref<IRecord[]>([])
// const validateCadastralNumber = (cadNum: string) => {
//   const regex = /^\d{2}:\d{2}:\d{6,7}:\d{1,5}$/
//   return regex.test(cadNum)
// }

/*watch(actualTable, (n) => {
  if (n) {
    filteredRecords.value = n.records
  }
})

watch(searchText, val => {
  if (val && val.length) {
    filteredRecords.value = actualTable.value.records.filter(el => {
      return (el.data.find(el => el.name == props.searchField)?.value + '').includes(val)
    })
  } else {
    filteredRecords.value = actualTable.value.records
  }
})*/
</script>

<style scoped>
.emploees-fields {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.emploees-fields-card {
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
.emploees-fields-card > .card-tabs {
  display: flex;
  align-items: center;
}
.emploees-fields-card > .card-tabs > .tabs {
  flex-grow: 2;
}
.emploees-fields-card > .card-tabs > .search-input {
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
  margin-bottom: 5%;
}
.emploees-fields-card > .button-add-land-plots {
  height: 10%;
}
.dialog-add-land-plots {
  width: 100%;
  height: 50%;
  min-width: 300px;
  max-height: 100%;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
  background: white;
}
.dialog-info-emploees {
  height: 60%;
}
</style>
