<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="moduleStartView"
    @module-end-view="moduleEndView"
    style="display: flex; justify-content: center; align-items: center"
  >
    <q-card bordered style="width: 450px">
      <q-card-section>
        <div class="text-h6">{{ headerText ?? 'Проверка вхождения координат' }}</div>
        <div v-if="subtitleText" class="text-subtitle2">{{ subtitleText }}</div>
      </q-card-section>

      <q-card-section horizontal>
        <q-card-section class="q-py-none" style="width: 50%">
          <q-select
            v-model="crs"
            :options="crsOptions"
            emit-value
            map-options
            dense
            outlined
            style="width: 190px"
            label="Система координат"
          />
        </q-card-section>
        <!-- <q-card-section class="text-right q-py-none" style="width: 50%">
          <q-toggle :disable="!checkRad()" v-model="degree" dense label="Градусы"/>
        </q-card-section> -->
      </q-card-section>

      <q-card-section horizontal>
        <q-card-section style="width: 50%">
          <q-input
            dense
            outlined
            v-model.number="latitude"
            label="Широта (х)"
            fill-mask="0"
            :mask="isDegree ? mask : undefined"
          />
        </q-card-section>
        <q-card-section style="width: 50%">
          <q-input
            dense
            outlined
            v-model.number="longitude"
            label="Долгота (у)"
            fill-mask="0"
            :mask="isDegree ? mask : undefined"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />
      <q-linear-progress
          v-show="props.isLoading"
          size="4px"
          indeterminate
          color="primary"
      />

      <q-card-actions align="right">
        <q-btn :disable="props.isLoading" flat @click="check">{{ btnCheckText ?? 'Проверить' }} </q-btn>
      </q-card-actions>
    </q-card>
  </main-wrapper>

  <alert-dialog v-model:show="showAlertDialog" :text="alertInfo?.text" :title="alertInfo?.title" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import AlertDialog from './AlertDialog.vue';
import {
  QCard,
  QCardActions,
  QCardSection,
  QBtn,
  QSeparator,
  QInput,
  QSelect,
  QLinearProgress
} from 'quasar';

const props = defineProps<{
  headerText?: string;
  subtitleText?: string;
  btnCheckText?: string;
  alertInfo: {
    show: boolean;
    title: string;
    text: string;
  };
  crsOptions: { label: string; value: number; isRad: boolean }[];
  isLoading?: boolean
}>();
const emit = defineEmits<{
  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;
  (e: 'check', value: { longitude: number; latitude: number; crs: number }): void;
  (e: 'update:aler-show', value: boolean): void;
}>();

const longitude = ref<string>('0');
const latitude = ref<string>('0');
const degree = ref(false);
const isDegree = computed(() => degree.value && checkRad());
const crs = ref(-6);
const showAlertDialog = computed({
  get: () => props.alertInfo.show,
  set: (v: boolean) => {
    emit('update:aler-show', v);
  },
});

const moduleStartView = () => {
  emit('moduleStartView');
};
const moduleEndView = () => {
  emit('moduleEndView');
};
const check = () => {
  let lon = '',
    lat = '';
  if (isDegree.value) {
    const parsDegres = function (value: string) {
      const match = value.match(
        /^\s*([+-]?\d{1,3})\s*°?\s*(\d{1,2})?\s*'?\s*(\d{1,2}(?:\.\d+)?)?″?\s*$/i,
      ) as RegExpMatchArray;
      const degrees = parseFloat(match[1] as string) as number;
      const minutes = parseFloat(match[2] as string) as number;
      const seconds = parseFloat(match[3] as string) as number;
      return (degrees + minutes / 60 + seconds / 3600).toFixed(6);
    };

    lat = parsDegres(latitude.value);
    lon = parsDegres(longitude.value);
  } else {
    lon = longitude.value;
    lat = latitude.value;
  }
  emit('check', {
    longitude: +lon,
    latitude: +lat,
    crs: +crs.value,
  });
};

const mask = ref("###° ##' ##.##″");

const checkRad = () => {
  return props.crsOptions.find((el) => el.value == crs.value)?.isRad;
};

</script>

<style scoped></style>
