<template>
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
        header-class="expansion-item-header"
        group="somegroup"
        expand-separator
        hide-expand-icon
        @before-show="itemBeforeShow(item)"
    >
      <template v-slot:header>
        <q-item-section side>
          <q-icon
              :name="props.itemSettings.icon"
              :color="item.color"
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
        <q-item-section
            v-if="props.positioningCapability"
            class="go-map-btn"
            side
        >
          <q-btn
              color="primary"
              icon="place"
              dense
              rounded
              @click.stop="positioning(item.recordId)"
          >
            <q-tooltip :delay="400"> Перейти к объекту на карте </q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section
            v-if="props.positioningCapability"
            class="delete-plot-btn"
            side
        >
          <q-btn
              color="primary"
              icon="delete"
              dense
              rounded
              @click.stop="deleteCadNum = { item:item, cadNum: getCadNum(item) }; openDialogDelete = true"
          >
            <q-tooltip :delay="400"> Удалить земельный участок </q-tooltip>
          </q-btn>
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
                    :filled="!record.readonly"
                    :readonly="props.readonly || record.readonly"
                    autogrow
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
                    <q-btn
                        flat
                        round
                        type="file"
                        color="primary"
                        icon="add"
                        @click.stop="openFileInputDialog(item.recordId)"
                    />
                    <input :id="`inputFile-${item.recordId}`" type="file" @click.stop hidden @change="changeFile($event, item)"/>
                  </q-item-label>
                </q-item-section>
              </template>
              <template v-slot:default>
                <div
                    v-if="item.loading == true"
                    class="expansion-loading"
                    style="font-size: 3em"
                >
                  <q-spinner-dots color="primary"/>
                </div>
                <FilesList
                    borderless
                    v-if="item.files && item.files.length"
                    :data="item.files">
                  <template v-slot:slotDelete="slotDelete">
                    <q-btn
                        round
                        flat
                        color="primary"
                        icon="delete"
                        @click.stop="deleteFile(slotDelete.file, item)"
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

    <q-dialog v-model="openDialogDelete">
      <q-card class="dialog-delete-plot">
        <q-card-section>
          <div class="text-h6">Отправить сообщение об удалении участка с кадастровым номером {{ deleteCadNum.cadNum }}</div>
        </q-card-section>

        <q-card-section class="buttons-delete-cancel">
          <q-btn
              text-color="primary"
              label="Удалить"
              @click="deleteRecord(deleteCadNum); openDialogDelete = false;"
              v-close-popup
          />
          <q-btn
              class="q-ml-sm"
              color="primary"
              label="Отмена"
              @click="openDialogDelete = false;"
              v-close-popup
          />
        </q-card-section>
      </q-card>
    </q-dialog>
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
  QBtn,
  QCard,
  QCardActions,
  QCardSection,
  QDialog,
  QExpansionItem,
  QIcon,
  QInput,
  QItem,
  QItemLabel,
  QItemSection,
  QList, QSpinnerDots,
  QTooltip,
} from 'quasar'
import { ref, toRefs } from 'vue'
import FilesList from '../../components/FilesList.vue'
import { IData, IRecord, IFile } from './types.ts'

interface IItemSettings {
  labelTemplate: string
  captionTemplate: string
  icon: string
}

const props = defineProps<{
  records: IRecord[] | undefined;
  itemSettings: IItemSettings
  readonly?: boolean
  positioningCapability?: boolean
  isLoading: boolean;
}>()

const { records } = toRefs(props)

const deleteCadNum = ref();
const openDialogDelete = ref(false)

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
        record: IRecord,
        file: File
      },
  ): void,
  (e: 'positionOnObject', v: number): void,
  (
      e: 'deleteRecord',
      val: string | number | null | undefined,
  ): void,
  (
      e: 'showExpansion',
      val: IRecord,
  ): void,
  (e: 'deleteFile',
   val: {
    file: IFile,
    item: IRecord
  }): void;
}>()

const deleteRecord = (cadNum: {item: IRecord, cadNum: string}) => {
  cadNum.item.color = 'gray';
  emit('deleteRecord', cadNum.cadNum);
}

const deleteFile = (file: IFile, item: IRecord) => {
  const data = {
    file: file,
    item: item
  }
  emit('deleteFile', data);
}

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
  const labelItem = item.data.find((el) => el.alias === props.itemSettings.labelTemplate);
  return !labelItem ? '' : `${labelItem.name} ${labelItem.value ?? 'Не задано'}`;
};

const caption = (item: IRecord) => {
  const captionItem = item.data.find((el) => el.alias === props.itemSettings.captionTemplate);
  return !captionItem ? '' : `${captionItem.name} ${captionItem.value ?? 'Не задано'}`;
};

const defaultRecords = ref<IRecord | null>(null)

const activeRecordId = ref<number | null>(null)
const editedFields = ref<IData[]>([])

const updateField = (record: IData, recordId: number) => {
  if (editedFields.value.includes(record)) {
    editedFields.value.splice(editedFields.value.indexOf(record), 1, record);
  } else {
    editedFields.value.push(record);
  }

  activeRecordId.value = recordId;
};

const cancleEdited = (recordId: number) => {
  const index = records.value!.findIndex((el) => el.recordId == recordId);
  if (index == -1 || !defaultRecords.value) return;

  records.value![index] = JSON.parse(JSON.stringify(defaultRecords.value));

  clear();
};

const saveEdited = (recordId: number) => {
  const savedData = {
    recordId,
    data: editedFields.value,
  };

  emit('saveEditedRecord', savedData);
  setDefaultValue(records.value!.find((el) => el.recordId == recordId)!);
  clear();
};

const itemBeforeShow = (records: IRecord) => {
  if (defaultRecords.value?.recordId == records.recordId) return;

  setDefaultValue(records);
};

const setDefaultValue = (records: IRecord) => {
  defaultRecords.value = JSON.parse(JSON.stringify(records));
};

const clear = () => {
  editedFields.value = [];
  activeRecordId.value = null;
};

const positioning = (recordId: number) => {
  emit('positionOnObject', recordId);
};

const getCadNum = (item: IRecord) => {
  return item.data.find((attr: IData) => attr.alias === "CadNum")?.value;
}

const onShowExpansion = (record: IRecord) => {
  if (!record.files?.length){
    emit('showExpansion', record)
  }
}
</script>

<style>
.expansion-fields-no-data {
  width: 100%;
  font-size: 1.3em;
  text-align: center;
  color: gray;
}
.expansion-item-header {
  &:hover {
    .go-map-btn,
    .delete-plot-btn {
      opacity: 1;
    }
  }
}
.go-map-btn,
.delete-plot-btn {
  opacity: 0;
  transition: opacity 0.21s ease-in-out;
}
.q-dialog__inner > .dialog-delete-plot {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 300px;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
  background: white;
}
.expansion-loading {
  min-width: 300px;
  margin: 8px;
  text-align:center;
}
.buttons-delete-cancel {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>