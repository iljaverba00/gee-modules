<template>
<!--   <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="moduleStartView"
    @module-end-view="moduleEndView"
    style="display: flex; justify-content: center; align-items: center"
  > -->
    <q-card v-if="createObj" bordered class="my-card" style="justify-content: center; align-items: center">
      <q-card-section v-if="createObj?.header || createObj?.subtitle">
        <div v-if="createObj?.header" class="text-h6">{{ createObj?.header }}</div>
        <div v-if="createObj?.subtitle" class="text-subtitle2">{{ createObj?.subtitle }}</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section style="overflow: auto; height: 90%; min-height: 250px" class="no-padding q-mt-sm">
        <q-list dense>
          <q-item dense v-for="field in createObj.fields" :key="field.id" class="q-pa-sm">
            <q-item-section>
              <q-item-label>
                <component
                  :is="getComponentByAlias(field.id, !!field.options)"
                  :label="getFiledNameByAlias(field.id)"
                  v-model="field.value"
                  :options="field.options"
                />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        
        <q-item v-if="createObj.files">
          <q-item-section>
            <q-file
              :model-value="createObj.files.value"
              @update:model-value="stateAsRefs.createObj.value!.files!.value = $event"
              label="Приложить файл"
              dense
              outlined
              use-chips
              multiple
              :accept="createObj.files.type"
              :rules="[(val) => !!val || 'Поле обязательно для заполнения']"
              reactive-rules
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </q-item-section>
        </q-item>
        
        <ol-map v-if="createObj.geometry" :geometry-info="createObj.geometry"/>

      </q-card-section>
      <q-linear-progress v-show="isLoading" size="4px" indeterminate color="primary" />

      <q-card-actions align="right" style="margin-right: 16px">
        <q-btn @click="send">Отправить</q-btn>
        <q-btn @click="$emit('cancel')">Отмена</q-btn>
      </q-card-actions>
    </q-card>
    <q-card v-else bordered class="my-card">
      <q-card-section style="height: 90%"> Отсутствуют данные... </q-card-section>
      <q-linear-progress v-show="isLoading" size="4px" indeterminate color="primary" />
    </q-card>
<!--   </main-wrapper> -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, toRefs } from 'vue';
// import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import StringFieldVue from './components/StringField.vue';
import FKFieldVue from './components/FKField.vue';
import OlMap from './components/OlMap.vue';
import DateFieldVue from './components/DateField.vue';
import { CreateObj, FactDescriptor, FactAttr } from './Type';
import {
  QCard,
  QCardSection,
  QCardActions,
  QItem,
  QItemSection,
  QItemLabel,
  QFile,
  QIcon,
  QList,
  QSeparator,
  QBtn,
  QLinearProgress,
} from 'quasar';

const props = defineProps<{
  createObj?: CreateObj;
  factDescriptor?: FactDescriptor;
  isLoading: boolean;
}>();
const emit = defineEmits<{
  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;
  (e: 'send'): void;
  (e: 'cancel'): void;
  (e: 'loadFactDescriptor', alias: string): void;
}>();
const stateAsRefs = toRefs(props);

// const moduleStartView = () => {
//   emit('moduleStartView');
// };
// const moduleEndView = () => {
//   emit('moduleEndView');
// };

onMounted(() => emit('moduleStartView'))
onUnmounted(() => emit('moduleEndView'))

const getFieldByAlias = (id: number) => {
  return stateAsRefs.factDescriptor.value?.attrs.find((attr: FactAttr) => attr.id == id);
};
const getFiledNameByAlias = (id: number) => {
  const attr = getFieldByAlias(id);
  return attr?.name;
};
const getComponentByAlias = (id: number, isSelectComponent: boolean) => {
  const attr = getFieldByAlias(id);
  if (attr) {
    if (isSelectComponent) return FKFieldVue;
    switch (true) {
      case [9, 10].includes(attr.type):
        return DateFieldVue;
      case [4, 11].includes(attr.logicalType):
        return FKFieldVue;
      default:
        return StringFieldVue;
    }
  }
};
const send = () => {
  emit('send');
};
</script>

<style scoped>
.my-card {
  width: 50vw;
  min-height: 250px;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
}

</style>
