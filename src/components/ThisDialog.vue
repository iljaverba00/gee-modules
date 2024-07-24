<template>
  <q-dialog
    v-model="show"
    persistent
    transition-show="fadeslide"
    transition-hide="fadeslide"
  >
    <q-card>
      <q-card-section
        v-if="title.length"
        class="business-modules__dialog-title"
      >
        <div class="business-modules__dialog-title-text">
          {{ title }}
        </div>
      </q-card-section>
      <q-card-section
        v-if="body.length"
        :style="[styleBody(title)]"
      >
        {{ body }}
      </q-card-section>
      <q-card-section :style="[styleBody(body + title)]">
        <slot></slot>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          :label="yesBtnLabel"
          :disable="yesBtnDisable"
          @click="emit('yes')"
        />
        <q-btn
          flat
          color="primary"
          :label="cancelBtnLabel"
          :disable="cancelBtnDisable"
          @click="emit('cancel')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  QDialog,
  QCard,
  QBtn,
  QCardSection,
  QCardActions,
} from 'quasar'
import { toRefs, StyleValue } from 'vue'

interface Props {
  show: boolean
  title: string
  body: string
  yesBtnLabel: string
  cancelBtnLabel: string
  yesBtnDisable: boolean
  cancelBtnDisable: boolean
}
const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '',
  body: '',
  yesBtnLabel: 'Да',
  cancelBtnLabel: 'Отмена',
  yesBtnDisable: false,
  cancelBtnDisable: false,
})

const { show, title, body, yesBtnLabel, cancelBtnLabel } =
  toRefs(props)
const emit = defineEmits(['yes', 'cancel'])

const styleBody = (text: string) => {
  return {
    padding: '16px',
    'padding-top': text.length ? '0' : '16',
  } as StyleValue
}
</script>

<style>
.business-modules__dialog-title {
  padding: 16px;
}

.business-modules__dialog-title-text {
  font-size: 1.25rem;
  letter-spacing: 0.0125em;
}
</style>
