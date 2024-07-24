<template>
  <div>
    <q-card-section class="q-pa-none">
      <p>
        В папке <b> {{ props.filePath }} </b> уже есть файл с именем <b> {{ props.fileName }} </b>,
        выберите действие:
      </p>
      <q-option-group
        v-model="group"
        :options="options"
        type="radio"
        inline
      />
    </q-card-section>

    <q-card-actions
      class="q-pa-none"
      align="right"
    >
      <q-btn
        color="primary"
        flat
        label="Ок"
        @click="emits('setDecision', group)"
      />
      <q-btn
        color="primary"
        label="Пропустить"
        @click="emits('removeItem')"
      />
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { QCardSection, QCardActions, QBtn, QOptionGroup } from 'quasar'
import { ref } from 'vue'

const props = defineProps<{
  filePath: string
  fileName: string
}>()

const emits = defineEmits<{
  (e: 'setDecision', decision: string): void
  (e: 'removeItem'): void
}>()

const group = ref('replace')
const options = [
  { label: 'Заменить файл в папке', value: 'replace' },
  { label: 'Пропустить этот файл', value: 'skip' },
  { label: 'Сохранить оба файла', value: 'save' },
]
</script>
