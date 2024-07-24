<template>
  <q-list v-if="!props.loading" bordered>
    <q-item
        v-for="item in props.reportsList"
        :key="item.id"
        clickable
    >
      <template v-slot:default>
        <q-item-section>
          <q-item-label>
            {{ item.name }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn color="primary" class="q-mb-sm" size="12px" flat dense round icon="send"
                 @click.stop="visibleDialog(item)">
            <q-tooltip>
              <div>Сформировать отчет</div>
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </template>
    </q-item>
  </q-list>
  <ChoiceRecordDialog
      :records="records"
      :visible="visible"
      @update:visible="visible = $event"
      @getRecordId="onChange"
  />
</template>

<script setup lang="ts">

import {QItem, QItemLabel, QItemSection, QList, QBtn, QTooltip} from "quasar"
import {IReportsList, IRecord} from './Types.ts'
import ChoiceRecordDialog from "./ChoiceRecordDialog.vue";
import {ref} from "vue";


const props = defineProps<{
  reportsList: IReportsList[]
  loading: boolean
  errorMessage: string | undefined;
  recordsRegion: IRecord[]
  recordsRaion: IRecord[]
}>()


const emit = defineEmits<{
  (
      e: 'changeReport',
      val: {
        recordId: number,
        activReport: IReportsList
      },
  ): void,
}>()


/*const changeReports = (reportsId: number) => {
  emit('changeReports', reportsId)
}*/

const visible = ref(false);
const records = ref<IRecord[]>([]);
const acttivReport = ref<IReportsList>();


const visibleDialog = (item: IReportsList) => {
  if (item.alias == 'SubjUnion_ID'){
    acttivReport.value = item;
    onChange(props.recordsRegion[0].recordId)
  }
  else{
    records.value = props.recordsRaion
    visible.value = true;
    acttivReport.value = item
  }

}

const onChange = (id: number) => {
  emit('changeReport',
  {
    recordId: id,
    activReport: acttivReport.value!
  }
)
}

</script>

<style>

</style>