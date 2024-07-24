<template>
  <q-list v-if="records && records.length" class="rounded-borders" bordered>
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
          <q-icon :name="props.itemSettings.icon" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ label(item) }}
          </q-item-label>
          <q-item-label caption>
            {{ caption(item) }}
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="props.positioningCapability" class="go-map-btn" side>
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
          v-if="props.positioningCapability && props.showDeleteBtn"
          class="go-map-btn"
          side
        >
          <q-btn
            color="primary"
            icon="auto_delete"
            flat
            rounded
            @click.stop="deletionRequest(item)"
          >
            <q-tooltip :delay="400"> Отправить заявку на удаление </q-tooltip>
          </q-btn>
        </q-item-section>

        <q-tooltip v-if="activeRecordId ? item.recordId != activeRecordId : false">
          Сохраните или отмените изменения
        </q-tooltip>
      </template>

      <template v-slot:default>
        <q-card>
          <q-card-section>
            <q-item v-for="(record, index) in item.data" :key="index" clickable>
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
          </q-card-section>

          <q-card-actions v-if="!props.readonly && editedFields.length" align="right">
            <q-btn flat label="Сохранить" color="primary" @click="saveEdited(item.recordId)" />
            <q-btn label="Отменить" color="primary" @click="cancleEdited(item.recordId)" />
          </q-card-actions>
        </q-card>
      </template>
    </q-expansion-item>
  </q-list>

  <div v-else-if="!isLoading" class="expansion-fields-no-data">Нет записей</div>

  <DeletionConfirmationDialog
    v-model="showDialogRemove"
    :record="toDelete"
    @remove="emit('deletionRequest', toDelete)"
  />
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
  QInput,
} from 'quasar';
import { ref, toRefs } from 'vue';
import { IRecord, IData } from './Types.ts';
import DeletionConfirmationDialog from './DeletionConfirmationDialog.vue';

interface IItemSettings {
  labelTemplate: string;
  captionTemplate: string;
  icon: string;
}

const props = defineProps<{
  records: IRecord[] | undefined;
  itemSettings: IItemSettings;
  isLoading: boolean;
  readonly?: boolean;
  positioningCapability?: boolean;
  showDeleteBtn?: boolean;
}>();

const { records } = toRefs(props);

const emit = defineEmits<{
  (
    e: 'save',
    val: {
      recordId: number;
      data: IData[];
    },
  ): void;
  (e: 'positionOnObject', v: number): void;
  (e: 'deletionRequest', record: IRecord | undefined): void;
}>();

const label = (item: IRecord) => {
  const labelItem = item.data.find((el) => el.alias === props.itemSettings.labelTemplate);
  return !labelItem ? '' : `${labelItem.name} ${labelItem.value ?? 'Не задано'}`;
};

const caption = (item: IRecord) => {
  const captionItem = item.data.find((el) => el.alias === props.itemSettings.captionTemplate);
  return !captionItem ? '' : `${captionItem.name} ${captionItem.value ?? 'Не задано'}`;
};

const defaultRecords = ref<IRecord | null>(null);

const activeRecordId = ref<number | null>(null);
const editedFields = ref<IData[]>([]);

const showDialogRemove = ref(false);
const toDelete = ref<IRecord>();

const positioning = (recordId: number) => {
  emit('positionOnObject', recordId);
};

const deletionRequest = (record: IRecord) => {
  toDelete.value = record;
  showDialogRemove.value = true;
  // emit('deletionRequest', recordId);
};

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

  emit('save', savedData);
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
    .go-map-btn {
      opacity: 1;
    }
  }
}
.go-map-btn {
  opacity: 0;
  transition: opacity 0.21s ease-in-out;
}
</style>
