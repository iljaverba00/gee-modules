<template>
  <!-- date -->
  <div
    v-if="itemType == 'date'"
    class="building-permit__section-input">
    <q-item-section class="q-mb-xs">
      <!-- :disable="!display.value?.value?.edit" -->
      <q-input
        v-model="itemInfo.value"
        dense
        filled
        type="date"
        mask="##/##/####"
        max="3000-12-31">
        <template v-slot:append>
          <q-icon
            name="event_busy"
            size="xs"
            color="black"
            @click="clearCalendar()"
            class="cursor-pointer" />
        </template>
        <template v-slot:prepend>
          <q-btn
            v-if="JSON.stringify(itemInfo) != JSON.stringify(firstModel)"
            size="xs"
            icon="history"
            class="no-padding"
            flat
            style="float: right"
            @click="backValue()">
            <!-- <q-tooltip>{{ t("TableData.words.undoChange") }}</q-tooltip> -->
          </q-btn>
        </template>
      </q-input>
    </q-item-section>
  </div>
  <!-- select -->
  <div
    v-if="itemType == 'select'"
    class="building-permit__section-input">
    <!-- <div v-if="!moveBtnGroup" class="text-right q-mb-sm">
      <q-btn
        v-if="JSON.stringify(itemInfo) != JSON.stringify(firstModel)"
        style="padding: 0.1em"
        icon="history"
        flat
        dense
        @click="backValue()">
        <q-tooltip>Отменить изменение</q-tooltip>
      </q-btn>
      <q-btn style="padding: 0.1em" icon="search" flat dense @click="showSearchDialog = true">
        <q-tooltip>Выбор объекта</q-tooltip>
      </q-btn>
      <q-btn style="padding: 0.1em" icon="delete" flat dense @click="deleteItemInfo">
        <q-tooltip>Удалить значение</q-tooltip>
      </q-btn>
      <q-btn style="padding: 0.1em" icon="add" flat dense>
        <q-tooltip>Создать новую запись</q-tooltip>
      </q-btn>
    </div> -->
    <q-input
      v-model="itemInfo.value"
      dense
      filled
      label="Заполните поле">
      <template
        v-if="moveBtnGroup"
        #append>
        <q-btn
          v-if="JSON.stringify(itemInfo) != JSON.stringify(firstModel)"
          style="padding: 0.1em"
          icon="history"
          flat
          dense
          @click="backValue()">
          <q-tooltip>Отменить изменение</q-tooltip>
        </q-btn>
        <q-btn
          style="padding: 0.1em"
          icon="search"
          flat
          dense
          @click="emit('showSearchDialog', itemAlias, fieldIndex)">
          <q-tooltip>Выбор объекта</q-tooltip>
        </q-btn>
        <q-btn
          style="padding: 0.1em"
          icon="delete"
          flat
          dense
          @click="deleteItemInfo">
          <q-tooltip>Удалить значение</q-tooltip>
        </q-btn>
        <q-btn
          style="padding: 0.1em"
          icon="add"
          flat
          dense
          @click="emit('showCrumbsComponent', itemAlias, fieldIndex)">
          <q-tooltip>Создать новую запись</q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <!-- </q-item-section> -->
  </div>
  <!-- only input -->
  <div
    v-if="itemType == 'input'"
    class="building-permit__section-input">
    <q-input
      v-model="itemInfo.value"
      dense
      filled
      label="Заполните поле" />
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, unref, toRefs } from 'vue';
import { QIcon, QBtn, QItemSection, QTooltip, QInput } from 'quasar';
import { SubData, emptyItemValue } from '../../modules/building-permit/Types.ts';

const emit = defineEmits(['showSearchDialog', 'showCrumbsComponent']);
const props = defineProps<{ field: SubData; fieldIndex: number }>();

const { field } = unref(props);
const { fieldIndex } = toRefs(props);

const itemInfo = ref(field.value);
const itemType = ref(field.type);
const itemAlias = ref(field.alias);
//Variables
const moveBtnGroup = ref(false);
const firstModel = ref(JSON.parse(JSON.stringify(itemInfo.value)));
// const showSearchDialog = ref(false);

//Functions
const clearCalendar = () => {
  itemInfo.value.value = '';
};
const backValue = () => {
  itemInfo.value = firstModel.value;
};
const windowResize = () => {
  if (window.innerWidth > 700) {
    moveBtnGroup.value = true;
  } else {
    moveBtnGroup.value = false;
  }
};
// const selectItem = (e: ItemList) => {
//   itemInfo.value = e;
// };
const deleteItemInfo = () => {
  itemInfo.value = emptyItemValue;
};
//Hooks
onMounted(() => {
  windowResize();
  window.addEventListener('resize', windowResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', windowResize);
});
</script>
