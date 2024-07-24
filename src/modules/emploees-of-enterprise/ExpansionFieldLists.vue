<template>
<!--  <div class="text-h6">Количество в records: {{records.length}}</div>-->
  <q-list
      v-if="records && records.length"
      class="rounded-borders"
      bordered
  >
    <q-expansion-item
        v-for="item in records"
        :key="item.recordId"
        :label="item.recordId + ''"
        :disable="activeRecordId ? item.recordId != activeRecordId : false"
        group="somegroup"
        expand-separator
        hide-expand-icon
        @before-show="itemBeforeShow(item)"
    >
      <template v-slot:header>
        <q-item-section side>
          <q-icon
              :name="props.itemSettings.icon"
              color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ label(item) }}
          </q-item-label>
          <q-item-label caption>
            {{ caption(item) }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon
              name="delete"
              color="primary"
              @click.stop="deleteRecord(item.recordId)"
          />
        </q-item-section>

        <q-tooltip v-if="activeRecordId ? item.recordId != activeRecordId : false">
          Сохраните или отмените изменения
        </q-tooltip>
      </template>

      <template v-slot:default>
        <q-card>
          <q-card-section>
            <q-item
                v-for="(record, index) in item.data"
                :key="index"
                clickable
            >
              <q-item-section>
                {{ record.name }}
              </q-item-section>
              <q-item-section>
                <q-input
                    v-model="record.value"
                    :filled="!props.readonly && !record.readonly"
                    :readonly="props.readonly || record.readonly"
                    :placeholder="record.emptyValue ? 'Не задано' : undefined"
                    borderless
                    square
                    dense
                    @update:model-value="updateField(record, item.recordId)"
                />
              </q-item-section>
            </q-item>
            
            <q-expansion-item
              v-mounted-item
              @before-show="onShowExpansion(item)"
            > 
            <template v-slot:header>
              <q-item-section side>
                <q-icon
                  name="folder_open"
                  color="primary"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Файлы 
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <q-btn flat round type="file" color="primary" icon="add" @click.stop="openFileInputDialog(item.recordId)" />
                  <input :id="`inputFile-${item.recordId}`" type="file"  @click.stop  hidden @change="changeFile($event, item)"/>
                </q-item-label>
              </q-item-section>
            </template>
              <template  v-slot:default>
                <div v-if="item.loading == true" class="expansion-loading" style="font-size: 3em">
                  <q-spinner-dots
                      color="primary"
                  />
                </div>
                <FilesList v-if="item.files && item.files.length" borderless  :data="item.files">
                  <template v-slot:slotDelete="slotDelete">
                    <q-btn
                        round
                        flat
                        color="primary"
                        icon="delete"
                        @click.stop="deleteFileRecord(item,slotDelete.file)"
                    >
                    <q-tooltip>
                      <div>Удалить</div>
                    </q-tooltip>
                  </q-btn>
              </template>
                </FilesList>
              </template>
            </q-expansion-item>
          </q-card-section>

          <q-card-actions
              v-if="!props.readonly && editedFields.length"
              align="right"
          >
            <q-btn
                flat
                label="Сохранить"
                color="primary"
                @click="saveEdited(item.recordId)"
            />
            <q-btn
                label="Отменить"
                color="primary"
                @click="cancleEdited(item.recordId)"
            />
          </q-card-actions>
        </q-card>
      </template>
    </q-expansion-item>
  </q-list>

  <div
      v-else-if="!isLoading"
      class="expansion-fields-no-data"
  >
    Нет записей
  </div>
</template>

<script setup lang="ts">
import {
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QItemLabel,
  QTooltip,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QInput, QSpinnerDots,
} from 'quasar'
import { ref, toRefs } from 'vue'
import FilesList from '../../components/FilesList.vue'
import { IRecord, IData, IFile } from './types.ts'

interface IItemSettings {
  labelTemplate: string
  captionTemplate: string
  icon: string
}

const props = defineProps<{
  records: IRecord[]
  itemSettings: IItemSettings
  readonly?: boolean
  isLoading: boolean
}>()

const { records } = toRefs(props)

const emit = defineEmits<{
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
  ): void,
  (
  e: 'deleteRecord',
  val:  number,
  ): void,
  (
      e: 'showExpansion',
      val: IRecord,
  ): void,
  (
      e:'deleteFile',
      val: {
        record: IRecord
        file: IFile
      },
  ): void
}
>()

const changeFile = (e: Event, item: IRecord) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  emit('attachFile', {
    record: item,
    file
  })
}

const openFileInputDialog = (itemId: number) => {
  const el = document.getElementById(`inputFile-${itemId}`)
  el && el.click();
}

const label = (item: IRecord) => {
  const labelItem = item.data.find(el => el.alias === props.itemSettings.labelTemplate)
//  return !labelItem ? '' : `${labelItem.name} ${labelItem.value ?? 'Не задано'}`
  return !labelItem ? '' : `${labelItem.value ?? 'Не задано'}`
}

const caption = (item: IRecord) => {
  const captionItem = item.data.find(el => el.alias === props.itemSettings.captionTemplate)
  return !captionItem ? '' : `${captionItem.value ?? ''}`
}

const defaultRecords = ref<IRecord | null>(null)

const activeRecordId = ref<number | null>(null)
const editedFields = ref<IData[]>([])

const updateField = (record: IData, recordId: number) => {
  if (editedFields.value.includes(record)) {
    editedFields.value.splice(editedFields.value.indexOf(record), 1, record)
  } else {
    editedFields.value.push(record)
  }

  activeRecordId.value = recordId
}

const cancleEdited = (recordId: number) => {
  const index = records.value.findIndex(el => el.recordId == recordId)
  if (index == -1 || !defaultRecords.value) return

  records.value[index] = JSON.parse(JSON.stringify(defaultRecords.value))

  clear()
}

const saveEdited = (recordId: number) => {
  const savedData = {
    recordId,
    data: editedFields.value,
  }

  emit('saveEditedRecord', savedData)
  setDefaultValue(records.value.find(el => el.recordId == recordId)!)
  clear()
}

const itemBeforeShow = (records: IRecord) => {
  if (defaultRecords.value?.recordId == records.recordId) return

  setDefaultValue(records)
}

const setDefaultValue = (records: IRecord) => {
  defaultRecords.value = JSON.parse(JSON.stringify(records))
}

const clear = () => {
  editedFields.value = []
  activeRecordId.value = null
}
const deleteRecord = (recordId:number )=>{
  //должна вызвать emit
  emit('deleteRecord',  recordId)
}

const onShowExpansion = (record: IRecord) => {
  if (!record.files?.length){
    emit('showExpansion', record)
  }
}

const deleteFileRecord = (record:IRecord,file:IFile) => {
  const data = {
    record:record,
    file: file,
  };
  emit('deleteFile', data)
}

</script>

<style>
.expansion-fields-no-data {
  width: 100%;
  font-size: 1.3em;
  text-align: center;
  color: gray;
}
</style>