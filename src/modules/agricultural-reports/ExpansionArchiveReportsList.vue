<template>
  <q-list v-if="!props.loading" bordered >
    <q-expansion-item
        v-for="item in props.reportsList"
        :key="item.id"
        group="somegroup"
        expand-separator
        hide-expand-icon

    >
      <template v-slot:header>
        <q-item-section>
          <q-item-label>
            {{ item.name }}
          </q-item-label>
        </q-item-section>
      </template>
      <template v-if="record?.files && record.files.length" v-slot:default>
        <FilesList :data="filterFiles(item.name, record.files)"/>
      </template>
    </q-expansion-item>
  </q-list>

</template>

<script setup lang="ts">

import {QExpansionItem, QItemLabel, QItemSection, QList} from "quasar"
import {IReportsList, IRecord, IFile} from './Types.ts'
import FilesList from '../../components/FilesList.vue'
import {toRefs} from "vue";


const props = defineProps<{
  reportsList: IReportsList[]
  record: IRecord
  loading: boolean
  errorMessage: string | undefined;
}>()

const { record } = toRefs(props)


const filterFiles = (reportName: string, files: IFile[]): IFile[] => {
  const test = files.filter((file: IFile) => {
    return reportName.includes(file.docName.split('.', 1)[0])
  }) as IFile[]
  return test
}



</script>

<style>

</style>