<template>
  <q-list
      v-if="records.length"
      class="rounded-borders"
      bordered
      separator
  >
    <q-expansion-item
        v-for="item in records"
        :key="item"
        header-class="expansion-item-header"
        group="somegroup"
        hide-expand-icon
    >
      <template v-slot:header>
        <q-item-section side>
          <q-icon
              :name="item.decision == undefined ? biClockHistory : item.decision === 1 ? biCheckCircleFill : biXCircleFill"
              :color="item.decision === 2 ? 'red' : 'primary'"
          >
            <q-tooltip>
              <div>{{item.decision === 1 ? "Подтверждено" : (item.decision === 2 ? "Отказано" : "Ожидает подтверждение")}}</div>
            </q-tooltip>
          </q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label caption>
            {{ item.typeMessage }}
          </q-item-label>
          <q-item-label>
            {{ item.value }}
          </q-item-label>
        </q-item-section>
        <q-item-section
            v-if="item.decision === 2"
            side
        >
          <q-icon
              :name="biInfoCircle"
              color="primary"
              size="16px"
          />
        </q-item-section>
      </template>

      <template v-slot:default>
        <q-separator v-if="item?.decision == 2"/>
        <q-card v-if="item?.decision == 2">
            <q-item>
              <q-item-section>
                Причина отказа
              </q-item-section>
              <q-item-section>
                <q-input
                    v-model="item.response"
                    :readonly="true"
                    autogrow
                    :placeholder="item.response ? item.response : 'Не указана'"
                    borderless
                    square
                    dense
                />
              </q-item-section>
            </q-item>
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
  QItem,
  QIcon,
  QItemLabel,
  QItemSection,
  QList,
  QTooltip,
  QExpansionItem,
  QCard,
  QInput,
  /*QCardSection,*/
  QSeparator,
} from 'quasar'
import {biCheckCircleFill, biClockHistory, biXCircleFill, biInfoCircle} from '@quasar/extras/bootstrap-icons';
import {toRefs} from "vue";
import {INoAcceptedRecord} from "./types.ts";

const props = defineProps<{
  records: INoAcceptedRecord[],
  isLoading: boolean;
}>()

const { records } = toRefs(props)


</script>

<style>
</style>