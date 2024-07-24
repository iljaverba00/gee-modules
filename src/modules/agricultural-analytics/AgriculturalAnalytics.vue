<template>
  <main-wrapper
      :full-screen-mode="false"
      :stepper-mode="false"
      @module-start-view="moduleStartView"
      @module-end-view="emit('moduleEndView')"
  >
    <div class="agricultural-fields">
      <div  class="agricultural-fields-card">
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
                  label="Аналитика"
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
                <AnalyticsList
                    :reports-list="reportsList"
                    :loading = "loading"
                    :records-region = "recordsRegion"
                    :records-raion = "recordsRaion"
                    @change-report="emit('changeReport', $event)"
                    :error-message = "errorMessage"
                    v-if="isMin"

                />
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
  QTabPanel, QLinearProgress, QTooltip, QBtn,
} from 'quasar'
import { ref } from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import {IReportsList, IRecord} from './Types.ts'
import AnalyticsList from "./AnalyticsList.vue";



const props = defineProps<{
  reportsList: IReportsList[]
  isMin: boolean
  errorMessage: string | undefined;
  loading: boolean
  recordsRegion: IRecord[]
  recordsRaion: IRecord[]
}>()



const emit = defineEmits<{
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
  (
      e: 'changeReport',
      val:  {
        recordId: number,
        activReport: IReportsList
      }
  ): void,

}>()

const moduleStartView = () => {

  emit('moduleStartView')
}

const activeTab = ref('actual')



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
  align-items: center;
}
.agricultural-fields-card > .card-tabs > .tabs {
  flex-grow: 2;
}
.agricultural-fields-card > .card-tabs > .search-input {
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