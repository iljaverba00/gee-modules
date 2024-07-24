<template>
  <q-list bordered v-if="!props.loading" >
    <q-expansion-item
        v-for="item in props.reportsList"
        :key="item.id"
        group="somegroup"
        expand-separator
        hide-expand-icon


    >
      <template v-slot:header>
        <q-item-section >
          <q-item-label>
            <q-avatar :color="getStatusColor(item)" size="18px" font-size="16px" class="material-icons-outlined" text-color="white" :icon="getStatusReports(item, record)" >
              <q-tooltip>
                <div>{{getStatusLabel(item, record)}}</div>
              </q-tooltip>
            </q-avatar>
            {{ item.name }}
          </q-item-label >
        </q-item-section>
        <q-item-section side>
          <q-btn :disable="disableChangeReports(item,record)" color="primary" class="q-mb-sm" size="12px" flat dense round icon="send"
                 @click.stop="changeReports(item.id)" >
            <q-tooltip>
              <div>Сформировать отчет</div>
            </q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side>
          <q-btn :disable="!visibleSend(item,record)" color="primary" class="q-mb-sm" size="12px" flat dense round icon="check"
                 @click.stop="sendReportButton(item)">
            <q-tooltip>
              <div>Отправить на проверку</div>
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </template>
      <template v-if="record?.files && record.files.length" v-slot:default>
        <FilesList :data="filterFiles(item, record.files)">
          <template v-slot:response="response">
            <q-btn
                v-if="!isSigFile(response?.file?.docName)"
                round
                flat
                color="primary"
                icon="sms"
            >
              <q-tooltip>
                <div>{{ checkResponseByFile(item, response.file) }}</div>
              </q-tooltip>
            </q-btn>
          </template>
          <template v-slot:slotDelete="slotDelete">
            <q-btn
                v-if="!isSigFile(slotDelete?.file?.docName)"
                :disable = "disableDelete(item) || slotDelete?.file?.disabled"
                round
                flat
                color="primary"
                icon="delete"
                @click.stop="emit('deleteFile', disabledDeleteFile(item))"
            >
              <q-tooltip>
                <div>Удалить</div>
              </q-tooltip>
            </q-btn>
          </template>
          <template v-slot:btn="btn">
            <q-btn
                v-if="!isSigFile(btn?.file?.docName)"
                :disable = "disableSig(item, record) || btn?.file?.disabled"
                round
                flat
                color="primary"
                icon="edit_document"
                @click.stop="emit('addCsp', btn.file)"
            >
              <q-tooltip>
                <div>Подписать ЭЦП</div>
              </q-tooltip>
            </q-btn>
          </template>
        </FilesList>
      </template>
    </q-expansion-item>
  </q-list>
  <DialogConfirmation
      :visibility="visibility"
      @update:visibility="visibility = $event"
      @sendReport="sendMessageCheckReports"
  />
</template>

<script setup lang="ts">

import {QExpansionItem, QItemLabel, QItemSection, QList, QBtn, QTooltip, QAvatar} from "quasar"
import {IReportsList, IRecord, IFile, MessageRecord, MessageRecords} from './Types.ts'
import FilesList from '../../components/FilesList.vue'
import {ref, toRefs} from "vue";
import DialogConfirmation from './DialogСonfirmation.vue'

const props = defineProps<{
  reportsList: IReportsList[]
  record: IRecord
  recordsMessage: MessageRecords
  loading: boolean
  errorMessage: string | undefined;
}>()

const { record, recordsMessage } = toRefs(props)
const visibility = ref(false)

const emit = defineEmits<{
  (
      e: 'changeReports',
      val: number,
  ): void,
  (
      e: 'sendMessageCheck',
      val: {
        reportName: string
        files: IFile[]
      },
  ): void
  (
      e: 'addCsp',
      val: IFile,
  ): void
  (
      e: 'deleteFile',
      val: IFile[],
  ): void
}>()

const changeReports = (reportsId: number) => {
  emit('changeReports', reportsId)
}


const checkResponseByFile = (report:IReportsList,file: IFile)=>{
  if(recordsMessage.value[report.id]?.length){
    for(let i=0, length = recordsMessage.value[report.id]?.length; i < length; i++){
      if(recordsMessage.value[report.id]?.[i]?.idsFile?.includes?.(file.docId) && recordsMessage.value[report.id]?.[i].status == 2){
        return recordsMessage.value[report.id]?.[i].response
      }
    }
  }
}


const filterFiles = (report:IReportsList, files: IFile[]) => {
  const filterFiles = files.filter((file: IFile) => {
    return report.name.includes(file.docName.split('.', 1)[0])
  }) as IFile[]
  return filterFiles.sort((a,b) => {if (a.docId < b.docId) {
    return -1;
  }
  if (a.docId > b.docId) {
    return 1;
  }
  return 0;
  })
}

const isSigFile = (name: string): boolean => {
  return name.endsWith(".sig");
}

const disableSig = (report:IReportsList, record:IRecord) =>{
  if (record?.files) {
    const files = filterFiles(report, record.files)
    const filesVisible = files.filter((file: IFile) => {
      return file.disabled != true}) as IFile[]
    if (filesVisible?.find(file => isSigFile(file.docName))) return true
  }
  return false

}

const visibleSend = (report:IReportsList,record:IRecord) =>{

  if (record?.files){
    const files = filterFiles(report, record.files)
    if (files?.length){
      const filesVisible = files.filter((file: IFile) => {
        return file.disabled != true}) as IFile[]
      if (filesVisible?.length){
        if (disableSig(report,record)){
          const messages = recordsMessage.value[report.id] as MessageRecord[];
          if (messages?.length) {
            if(messages[0].status != 2) return false
          }
          return true
        }
      }
    }
  }

}



const disableDelete = (report:IReportsList)=>{
  const messages = recordsMessage.value[report.id] as MessageRecord[];
  if(messages?.length){
    if(messages[0].status != 2) return true
  }


}


const disableChangeReports = (report:IReportsList,record:IRecord) =>{
  if (record?.files){
    const files = filterFiles(report, record.files)
    if (files?.length){
      const filesVisible = files.filter((file: IFile) => {
        return file.disabled != true}) as IFile[]
      if (filesVisible?.length){
        if (disableSig(report,record)){
          const messages = recordsMessage.value[report.id] as MessageRecord[];
          if (messages?.length) {
            if(messages[0].status != 2) return true
          }
          return true
        }
        return true
      }
      return false
    }
  }
}


const getStatusReports = (report:IReportsList, record:IRecord) =>{

  if (record?.files){
    const files = filterFiles(report, record.files)
    if (files?.length){
      const messages = recordsMessage.value[report.id] as MessageRecord[];
      if(messages?.length) {
        if(!messages[0].status) return 'schedule'
      }
      return 'task_alt'
    }
    else{
      return 'circle'
    }
  }
}

const getStatusColor = (report:IReportsList)=>{
  const messages = recordsMessage.value[report.id] as MessageRecord[]

  if(messages?.length) {
    switch (messages[0].status) {
      case 1:
        return 'green'
      case 2:
        return 'red'
      default:
        return 'yellow'
    }
  }
  return 'primary'
}

const getStatusLabel = (report:IReportsList, record:IRecord)=>{

  if (record?.files){
    const files = filterFiles(report, record.files)
    if (files?.length){
      const messages = recordsMessage.value[report.id] as MessageRecord[] | undefined;
      if(messages?.length) {
        switch (messages[0].status) {
          case 1:
            return 'Подтверждено'
          case 2:
            return 'Отклонено'
          default:
            return 'Отправлено на проверку'
        }
      }
      return 'Сформирован'
    }
    else{
      return 'Не сформирован'
    }
  }
}

const activeReport = ref<IReportsList>();

const sendReportButton = (report:IReportsList) => {
  activeReport.value = report;
  visibility.value = true;

}

const sendMessageCheckReports = () => {
  if(activeReport.value){
    const filesReport = filterFiles(activeReport.value, record.value.files)
    const sendFiles = filesReport.filter((file: IFile) => {
      return file.disabled != true
    }) as IFile[]
    const data = {
      reportName:activeReport.value.name,
      files:sendFiles
    }
    emit('sendMessageCheck', data)
    activeReport.value = undefined
  }

}

const disabledDeleteFile = (report: IReportsList) =>{
  const filesReport = filterFiles(report, record.value.files)
  const sendFiles = filesReport.filter((file: IFile) => {
    return file.disabled != true
  }) as IFile[]
  return sendFiles as IFile[]
}


</script>

<style>

</style>
