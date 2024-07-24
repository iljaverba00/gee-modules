<template>
  <q-select
    ref="selectRef"
    v-bind="props"
    options-selected-class="text-primary text-weight-bold"
    hide-bottom-space
    hide-selected
    options-dense
    filled
    dense
  >
    <template v-if="props.noOptionText" v-slot:no-option>
      <q-item dense>
        <q-item-section> {{ props.noOptionText }} </q-item-section>
      </q-item>
    </template>

    <template v-slot:option="{ itemProps, opt, selected }">
      <q-item
        v-bind="itemProps"
        @click="
          selected ? $emit('update:modelValue', null) : null;
          selectRef?.blur();
        "
      >
        <q-item-section>
          <q-item-label>{{ opt.label }}</q-item-label>
        </q-item-section>

        <q-item-section v-if="selected" side>
          <q-icon name="done" color="primary" />
        </q-item-section>
      </q-item>
    </template>

    <template v-if="props.tooltip" v-slot:default>
      <q-tooltip :delay="400"> {{ props.tooltip }} </q-tooltip>
    </template>

    <template v-if="props.modelValue" v-slot:append>
      <q-badge color="primary" floating rounded />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import {
  QSelectProps,
  QSelect,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
  QTooltip,
  QBadge,
} from 'quasar';
import { ref } from 'vue';

interface IProps extends QSelectProps {
  tooltip?: string;
  noOptionText?: string;
}

const props = defineProps<IProps>();

const selectRef = ref<QSelect>();
</script>
