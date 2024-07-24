<template>
  <q-list v-if="records && records.length" class="rounded-borders" bordered separator>
    <q-item v-for="item in records" :key="item.recordId">
      <q-item-section side>
        <q-icon :name="getIcon(item)?.icon" :color="getIcon(item)?.color">
          <q-tooltip :delay="400">{{ getIcon(item)?.tooltip }}</q-tooltip>
        </q-icon>
      </q-item-section>

      <q-item-section>
        <q-item-label class="request__item-label"> Номер контура </q-item-label>
        <q-item-label>
          {{ getRequest(item) }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-if="getResponse(item)">
        <q-item-label class="request__item-label"> Ответ </q-item-label>
        <q-item-label>
          {{ getResponse(item) }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-else>
        <q-item-label class="request__item-label"> Без ответа </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label> Дата создания: {{ getDate(item)[0] }} </q-item-label>
        <q-item-label v-if="getDate(item)[0] != getDate(item)[1]">
          Дата решения: {{ getDate(item)[1] }}
        </q-item-label>
      </q-item-section>

    </q-item>
  </q-list>

  <div v-else-if="!isLoading" class="expansion-fields-no-data">Нет запросов</div>
</template>

<script setup lang="ts">
import { QList, QItem, QItemSection, QItemLabel, QIcon, QTooltip } from 'quasar';
import { toRefs } from 'vue';
import { IRecord } from './Types.ts';

const props = defineProps<{
  records: IRecord[] | undefined;
  isLoading: boolean;
}>();

const { records } = toRefs(props);

const getIcon = (item: IRecord) => {
  const typeField = item.data.find((el) => el.alias === 'MsMessageType_ID');
  const yesNoField = item.data.find((el) => el.alias === 'YesNo_ID');

  if (typeField?.value == 7) {
    return {
      icon: yesNoField?.value === null ? 'auto_delete' : yesNoField?.value === 1 ? 'done' : 'close',
      color:
        yesNoField?.value === null ? 'grey' : yesNoField?.value === 1 ? 'positive' : 'negative',
      tooltip:
        yesNoField?.value === null
          ? 'Запрос на удаление на рассмотрении'
          : yesNoField?.value === 1
          ? 'Запись удалена'
          : 'Удаление отклонено',
    };
  } else if (typeField?.value == 6) {
    return {
      icon: yesNoField?.value === null ? 'more_time' : yesNoField?.value === 1 ? 'done' : 'close',
      color:
        yesNoField?.value === null ? 'grey' : yesNoField?.value === 1 ? 'positive' : 'negative',
      tooltip:
        yesNoField?.value === null
          ? 'Запрос на добавление на рассмотрении'
          : yesNoField?.value === 1
          ? 'Запись добавлена'
          : 'Добавление отклонено',
    };
  }
};

const getRequest = (item: IRecord) => {
  const responseField = item.data.find((el) => el.alias === 'Request');
  return responseField?.value;
};

const getResponse = (item: IRecord) => {
  const responseField = item.data.find((el) => el.alias === 'Response');
  return responseField?.value;
};

const getDate = (item: IRecord) => {
  const date = item.data.find((el) => el.alias === 'zipDATE')?.value;
  const lastDate = item.data.find((el) => el.alias === 'zipLastDate')?.value;
  return [date, lastDate];
};
</script>

<style>
.request__item-label {
  color: #919191;
}
</style>
