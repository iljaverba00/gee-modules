<template>
  <q-dialog v-model="show" class="dialog-info-emploees">
    <q-scroll-area
        class="tab-panels-scroll"
        style="height: calc(90% - 72px - 32px)"
    >
      <q-card class="dialog-add-land-plots">
        <q-card-section class="analytics-card" >
          <div class="text-h6">
            <q-icon name="travel_explore" size="25px"/>
            Выберите объект
          </div>
        </q-card-section>

        <q-card v-for="item in records" :key="item.recordId">
          <q-item
                v-for="(record, index) in item.data"
                :key="index"
                @click="getRecord(item.recordId)"
                clickable
                v-close-popup
          >
            <q-item-section>
              {{ record.value }}
            </q-item-section>
          </q-item>
        </q-card>
      </q-card>
    </q-scroll-area>
  </q-dialog>
</template>

<script setup lang="ts">

import {
  QCard,
  QCardSection,
  QDialog,
  QScrollArea,
  QItemSection,
  QItem,
  QIcon, ClosePopup,
} from 'quasar'

import {computed} from 'vue'
import {IRecord} from "./Types.ts";

const vClosePopup = ClosePopup;

const props = defineProps<{
  records: IRecord[]
  visible: boolean
}>()

const emit = defineEmits<{
  (
      e: 'update:visible',
      val: boolean,
  ): void,
  (
      e: 'getRecordId',
      val: number,
  ): void,
}>()

const show = computed({
  get: () => {
    return props.visible
  },
  set: (v: boolean) => {
    emit('update:visible', v)
  }
})

const getRecord = (recordId:number) =>{
  emit("getRecordId",recordId)
}

</script>

<style scoped>
.tab-panels-scroll {
  margin: 16px;
  flex: auto;
  padding: 0 !important;
}

.analytics-card{
  color: white;
  background: #1976d2;
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
