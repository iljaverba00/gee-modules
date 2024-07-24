<template>
  <q-dialog v-model="showSearchDialog">
    <q-card class="building-permit__card-search-dialog">
      <q-bar class="bg-primary">
        <q-space />
        <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" />
        <q-btn dense flat icon="close" @click="$emit('hideSearchDialog')" />
      </q-bar>
      <q-separator />
      <q-input
        v-model="dialogInput"
        type="search"
        dense
        filled
        label="Поиск"
        square
        @update:model-value="search(dialogInput)">
        <template #append>
          <q-btn icon="menu" dense flat @click="toggleRightDrawer = !toggleRightDrawer" />
        </template>
      </q-input>
      <q-layout view="LHh lpR lFr" container class="full-height building-permit__card-search-dialog-list">
        <q-drawer v-model="toggleRightDrawer" :width="300" side="right" bordered :behavior="'desktop'">
          <q-card class="building-permit__card-search-dialog-drawer">
            <q-item v-if="selectedItem.text">Пользователь: {{ selectedItem.text }}</q-item>
            <q-item>Информация: {{ selectedItem.value }}</q-item>
            <q-item v-if="selectedItem.createDate">Создано: {{ selectedItem.createDate }}</q-item>
            <q-item v-if="selectedItem.changeDate">Изменено: {{ selectedItem.changeDate }}</q-item>
            <q-item v-if="selectedItem.code">Код: {{ selectedItem.code }}</q-item>
            <q-item v-if="selectedItem.changeOperator">Оператор: {{ selectedItem.changeOperator }}</q-item>
          </q-card>
        </q-drawer>
        <q-list class=" ">
          <q-item
            v-for="item of itemListForSearch"
            :key="item.text"
            clickable
            :active="setActive(item)"
            active-class="building-permit__card-search-dialog-active-item"
            class="building-permit__card-search-dialog-item"
            @click="itemSelection(item)">
            {{ item.text }}
          </q-item>
        </q-list>
      </q-layout>
      <q-separator />
      <q-card-actions class="building-permit__card-search-actions" align="right">
        <q-btn label="OK" @click="emitOk()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, toRefs, unref } from "vue";
import { ItemList } from "../../modules/building-permit/Types.ts";
import { QCard, QList, QCardActions, QItem, QInput, QSeparator, QLayout, QDrawer, QBtn, QBar, QSpace } from "quasar";

const emit = defineEmits(["selectItem", "hideSearchDialog"]);
const props = defineProps<{ itemList: ItemList[]; showSearchDialog: boolean }>();
const { itemList } = unref(props);
const { showSearchDialog } = toRefs(props);

//Variables
const dialogInput = ref("");
const toggleRightDrawer = ref(false);
const itemListForSearch = ref(itemList);
const selectedItem = ref<ItemList>({ value: "Ничего не выбрано" });

//Functions
const search = (e: string) => {
  itemListForSearch.value = itemList.filter((v) => v.text?.toLowerCase().includes(e.toLowerCase()));
};
const itemSelection = (item: ItemList) => {
  selectedItem.value = item;
  setActive(item);
};
const emitOk = () => {
  emit("selectItem", selectedItem.value);
  emit("hideSearchDialog");
};
const setActive = (item: ItemList) => {
  return selectedItem.value.text === item.text;
};
</script>

<style>
.building-permit__card-search-dialog {
  width: 700px;
  height: 600px;
  overflow: hidden !important;
  max-width: 80vw !important;
  display: flex;
  flex-direction: column;
}
.building-permit__card-search-dialog-item {
  border-bottom: 1px solid rgb(0, 0, 0, 0.12);
  align-items: center;
}
.building-permit__card-search-dialog-list {
  /* height: calc(100% - 72px) !important; */
  height: 100% !important;
  overflow-y: auto !important;
}
.building-permit__card-search-dialog-drawer {
  width: 100%;
  height: 100%;
}
.building-permit__card-search-actions {
  padding-right: 2em;
}
.building-permit__card-search-dialog-list > div > div > div > .q-list > :last-child {
  border-bottom: 0px;
}
.building-permit__card-search-dialog-active-item {
  background-color: rgb(0, 0, 0, 0.12);
}
</style>
