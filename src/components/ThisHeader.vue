<template>
  <div
    class="business-modules__header"
    @click.stop
    @dblclick.stop="reveal">
    <q-icon
      v-if="props.closeBtn"
      class="business-modules__header-icon"
      name="keyboard_backspace"
      @click="dialogClose = true" />
    <div class="business-modules__header-title">
      {{ props.title }}
    </div>
    <q-space />
    <q-icon
      v-if="props.actionBtn"
      class="business-modules__header-icon"
      :name="props.actionBtnIcon ?? ''"
      @click="emit('action')" />
  </div>
  <q-separator />

  <this-dialog
    :show="dialogClose"
    title="Закрыть?"
    body="Вы уверены что хотите прервать выполнение регистрации документов ГИСОГД?"
    @yes="emit('closeModule')"
    @cancel="dialogClose = false" />
</template>

<script setup lang="ts">
import { QIcon, QSeparator, QSpace } from 'quasar';
import { ref } from 'vue';
import ThisDialog from './ThisDialog.vue';

interface IParent {
  splitter: number;
  limits: number[];
}

const props = defineProps<{
  title: string;
  closeBtn?: boolean;
  actionBtn?: boolean;
  actionBtnIcon?: string;
  parent?: IParent;
}>();
const emit = defineEmits(['closeModule', 'action', 'update:splitter']);

const dialogClose = ref(false);

const reveal = () => {
  if (!props.parent) return;

  if (props.parent.splitter == props.parent.limits[1]) emit('update:splitter', props.parent.limits[0]);
  else emit('update:splitter', props.parent.limits[1]);
};
</script>

<style>
.business-modules__header {
  width: 100%;
  display: flex;
  background: var(--q-primary);
  z-index: 100;
  border-radius: 0 !important;
}

.business-modules__header-icon {
  font-size: 25px;
  margin: 5px;
  color: rgb(255, 255, 255);
  opacity: 0.9;
  transition: opacity 175ms ease;
}

.business-modules__header-icon:hover {
  opacity: 0.7;
}

.business-modules__header-icon:active {
  opacity: 1;
}

.business-modules__header-title {
  font-size: 1.3em;
  line-height: 35px;
  margin-left: 8px;
  color: white;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.q-splitter__panel .q-splitter__after {
  overflow-y: hidden;
}

.q-splitter__panel .q-splitter__before {
  overflow-y: hidden;
}
</style>
