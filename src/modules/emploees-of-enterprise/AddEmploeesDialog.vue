<template>
<!--  <div class="text-h2">Количество в createRecord: {{createRecord.length}}</div>-->
  <q-card class="button-add-land-plots">
    <q-btn color="primary" label="Добавить сотрудника" @click="openDialog"/>
    <q-dialog v-model="visibleDialog" class="dialog-info-emploees">
      <q-scroll-area
          class="tab-panels-scroll"
          style="height: calc(90% - 72px - 32px)"
      >
        <q-card class="dialog-add-land-plots" >
          <q-card-section>
            <div class="text-h6"><q-icon name="people" size="25px"/> Введите информацию о сотруднике</div>
          </q-card-section>

          <q-card v-for="item in createRecord" :key="item.recordId">
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
                      :filled="!record.readonly"
                      :readonly="props.readonly || record.readonly"
                      :placeholder="record.emptyValue ? 'Не задано' : undefined"
                      borderless
                      square
                      dense
                      @update:model-value="updateField(record, item.recordId)"
                  />
                </q-item-section>
              </q-item>

<!--              <q-expansion-item
                  v-mounted-item
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
                      <input :id="`inputFile-${item.recordId}`" type="file"  @click.stop  hidden @change="changeFile($event, item.recordId)"/>
                    </q-item-label>
                  </q-item-section>
                </template>
                <template v-if="item.files && item.files.length" v-slot:default>
                  <FilesList borderless  :data="item.files" />
                </template>
              </q-expansion-item>-->
            </q-card-section>

            <q-card-actions
                v-if="!props.readonly && editedFields.length"
                align="right"
            >
              <q-btn
                  flat
                  label="Сохранить"
                  color="primary"
                  @click="saveEdited(item.recordId); visibleDialog=false;"
              />
              <q-btn
                  label="Отменить"
                  color="primary"
                  @click="cancleEdited(item.recordId); visibleDialog=false;"
                             />

            </q-card-actions>
          </q-card>


        <!--  <ExpansionFieldsList
              :records="createRecord"
              :item-settings="{
              labelTemplate: 'Name',
              //captionTemplate: '',
              icon: 'people',
            }"
              @save-edited-record="emit('saveEditedRecord', $event)"
              @attach-file="emit('attachFile', $event)"
          /> -->
<!--          <q-card-section class="button-add-land-plots q-fab__label&#45;&#45;external-bottom">-->
<!--            <q-btn color="primary" label="Добавить cотрудника" @click="openDialog" v-close-popup/>-->
<!--          </q-card-section>-->
        </q-card>
      </q-scroll-area>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">

import {
  // QExpansionItem,
  // QList,
  // QItem,
  // QItemSection,
  // QIcon,
  // QItemLabel,
  // QTooltip,
  QCard,
  QCardSection,
  QDialog,
  QScrollArea,
  // QCardActions,
  QBtn, QInput,
  //QExpansionItem,
  QItemSection, QCardActions, QItem, QIcon,
  //QItemLabel,
  // QInput,
} from 'quasar'
import {ref, toRefs} from 'vue'
// import {ref} from 'vue'
import {IData,/*IData, */IRecord} from "./types.ts";
//import ExpansionFieldsList from "./ExpansionFieldLists.vue";
//import FilesList from "src/components/FilesList.vue";

const visibleDialog = ref(false)
const createRecord = ref<IRecord[]>([])
// const fakeRecord = ref<IRecord[]>([])
const editedFields = ref<IData[]>([])
const activeRecordId = ref<number | null>(null)
const defaultRecords = ref<IRecord | null>(null)


const props = defineProps<{
  fakeRecord: IRecord
  readonly?: boolean
 }>()

const emit = defineEmits<{
  // (e: 'moduleStartView'): void
  // (e: 'moduleEndView'): void
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

}>()

const {fakeRecord} = toRefs(props)

const setDefaultValue = (records: IRecord) => {
  defaultRecords.value = JSON.parse(JSON.stringify(records))
}

const clear = () => {
  editedFields.value = []
  activeRecordId.value = null
}

const saveEdited = (recordId: number) => {
  const savedData = {
    recordId,
    data: editedFields.value,
  }
  emit('saveEditedRecord', savedData)
  setDefaultValue(fakeRecord.value)
  clear()
}

/*const openFileInputDialog = (itemId: number) => {
  const el = document.getElementById(`inputFile-${itemId}`)
  el && el.click();
}*/

const updateField = (record: IData, recordId: number) => {
  if (editedFields.value.includes(record)) {
    editedFields.value.splice(editedFields.value.indexOf(record), 1, record)
  } else {
    editedFields.value.push(record)
  }

  activeRecordId.value = recordId
}

/*const changeFile = (e: Event, itemId: number) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  emit('attachFile', {
    recordId: itemId,
    file
  })
}*/

const cancleEdited = (recordId: number) => {
  if(fakeRecord.value.recordId != recordId || !defaultRecords.value) return

  fakeRecord.value = JSON.parse(JSON.stringify(fakeRecord.value))

  clear()
}

const openDialog = ()=>{
  visibleDialog.value = !visibleDialog.value
  if(visibleDialog.value){
    createRecord.value = [JSON.parse(JSON.stringify(fakeRecord.value))]
    // console.log(createRecord.value)
  }
}

</script>

<style scoped>
.tab-panels-scroll {
  margin: 16px;
  flex: auto;
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
