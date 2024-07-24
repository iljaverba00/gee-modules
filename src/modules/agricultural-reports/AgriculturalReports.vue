<template>
  <main-wrapper
      :full-screen-mode="false"
      :stepper-mode="false"
      @module-start-view="moduleStartView"
      @module-end-view="emit('moduleEndView')"
  >
    <div class="agricultural-reports">
      <div  class="agricultural-reports-card">
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
                  label="Отчеты"
              />
              <q-tab
                  name="archive"
                  label="Архив"
              />

            </q-tabs>
            <q-btn
                class = "update-button"
                round
                flat
                color="primary"
                icon="cached"
                @click.stop="emit('moduleStartView')"

            >
              <q-tooltip>
                <div>Обновить</div>
              </q-tooltip>
            </q-btn>
          </div>

          <div v-if="activeTab === 'archive'">
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
              <q-tab
                  v-for="year of filterArchiveYear()"
                  :key="year"
                  :name="year"
                  :label="year"
              />
            </q-tabs>
          </div>

          <q-scroll-area
              class="tab-panels-scroll"
              :style="
              activeTab == 'actual'
                ? 'height: calc(100% - 72px - 32px)'
                : 'height: calc(100% - 108px - 32px)'
            "
          >
            <div v-if="errorMessage" class="no-date">
              {{ errorMessage }}
            </div>
            <q-tab-panels
                v-model="activeTab"
                animated
            >
              <q-tab-panel name="actual">
                <ExpansionReportsList
                    :reports-list="props.reportsList"
                    :record="recordActual"
                    :records-message = "props.recordsMessage"
                    :loading = "props.loading"
                    @change-reports="emit('changeReports', $event)"
                    @send-message-check="emit('sendMessageCheck',$event)"
                    @add-csp="emit('addCsp', $event)"
                    @delete-file="emit('deleteFile',$event)"
                    :error-message = "props.errorMessage"
                    v-if="isManufacturer"
                />
              </q-tab-panel>
              <q-tab-panel name="archive">
                <q-tab-panels v-model="archiveTab" animated outside-arrows v-if="isManufacturer">
                  <q-tab-panel v-for="year of filterArchiveYear()" :key="year" :name="year">
                    <ExpansionArchiveReportsList
                        :reports-list="props.reportsList"
                        :record="filteredArchiveRecord(year)"
                        :loading = "props.loading"
                        :error-message = "props.errorMessage"

                    />
                  </q-tab-panel>
                </q-tab-panels>
              </q-tab-panel>
            </q-tab-panels>
          </q-scroll-area>
        <q-linear-progress
            v-show="props.loading"
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
import {
  QTabs,
  QTab,
  QScrollArea,
  QTabPanels,
  QTabPanel, QTooltip, QBtn, QLinearProgress,
} from 'quasar'
import { ref} from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import {IRecord, IReportsList, IFile, IData, MessageRecords} from './Types.ts'
import ExpansionReportsList from './ExpansionReportsList.vue'
import ExpansionArchiveReportsList from "./ExpansionArchiveReportsList.vue";


const props = defineProps<{
  recordActual: IRecord
  reportsList: IReportsList[]
  recordsMessage: MessageRecords
  recordsArchive: IRecord[]
  isManufacturer: boolean
  errorMessage: string | undefined;
  loading: boolean
}>()

const archiveTab = ref()


const emit = defineEmits<{
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
  (
      e: 'changeReports',
      val:  number
  ): void,
  (
      e: 'sendMessageCheck',
      val: {
        reportName: string
        files: IFile[]
      },
  ): void,
  (
      e:'addCsp',
      val: IFile,
  ): void,
  (
      e:'deleteFile',
      val: IFile[],
  ): void

}>()

const moduleStartView = () => {

  emit('moduleStartView')
}

const activeTab = ref('actual')



const filteredArchiveRecord = (year:number)=>{
  const archiveRec = props.recordsArchive.filter((record:IRecord)=>{
    return record.data.find((field:IData)=>field.value == year)
  })

  return archiveRec[0]
}

const filterArchiveYear = ():number[] =>{
  return props.recordsArchive.map((records:IRecord)=>{
    const record = records.data.find((el:IData)=>{
      return el.alias == 'ShYear'
    })
    return record?.value
  }) as number[]
}


</script>

<style>
.agricultural-reports {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.agricultural-reports-card {
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
.agricultural-reports-card > .card-tabs {
  display: flex;
  align-items: center;
}
.agricultural-reports-card > .card-tabs > .tabs {
  flex-grow: 2;
}
.agricultural-reports-card > .card-tabs > .search-input {
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
.no-date{
  width: 100%;
  font-size: 1.3em;
  text-align: center;
  color: gray;
  padding: 16px;
}
.expansion-loading {
  min-width: 300px;
  margin: 8px;
  text-align:center;
}

.update-button {
  border-radius: 50%;
  -webkit-transition: -webkit-transform 0.8s ease-in-out;
  transition: transform 0.8s ease-in-out;
  margin: 16px;
}
.update-button:hover {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
  margin: 16px;
}

</style>
