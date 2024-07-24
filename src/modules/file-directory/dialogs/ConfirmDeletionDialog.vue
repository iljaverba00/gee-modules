<template>
  <q-dialog
    v-model="dialog"
    persistent
    seamless
  >
    <q-card class="dialog">
      <div class="q-pa-md text-h6">
        {{ header }}
      </div>
      <q-card-section class="q-pa-none q-px-md">
        <p>{{ bodyText1 }}</p>
        <p>
          {{ bodyText2 }} <b> {{ name }} </b>
        </p>
        <q-input
          filled
          dense
          square
          v-model="inputName"
          :placeholder="name"
          @keyup.enter="inputName.trim() == name && confirm()"
        />
      </q-card-section>
      <q-card-actions
        class="q-pa-md"
        align="right"
      >
        <q-btn
          color="primary"
          flat
          label="ОК"
          :disable="inputName.trim() != name"
          @click="confirm"
        />
        <q-btn
          color="primary"
          label="ОТМЕНА"
          @click="close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QInput, QDialog, QCard, QCardSection, QCardActions, QBtn } from 'quasar'
import { ref, computed } from 'vue'
import type { IFileOrFolder } from '../FileDirectoryTypes'

const props = defineProps<{
  model: boolean
  node: IFileOrFolder
}>()

const emits = defineEmits<{
  (e: 'update:model', v: boolean): void
  (e: 'confirm'): void
}>()

const dialog = computed({
  get: () => props.model,
  set: v => emits('update:model', v),
})

const name = computed(() => props.node.name)
const type = computed(() => props.node.type)
const header = computed(() => `Удалить ${type.value == 'FILE' ? 'файл' : 'папку'}?`)
const bodyText1 = computed(() =>
  type.value == 'FILE'
    ? 'Это приведет к необратимому удалению файла'
    : 'Это приведет к необратимому удалению данных по этому пути, включая все вложенные файлы',
)
const bodyText2 = computed(() =>
  type.value == 'FILE'
    ? 'Подтвердите, что вы хотите удалить этот файла, введя его наименование:'
    : 'Подтвердите, что вы хотите удалить эту папку, введя ее наименование:',
)

const inputName = ref('')

const confirm = () => {
  emits('confirm')
  close()
}

const close = () => {
  inputName.value = ''
  dialog.value = false
}
</script>

<style scoped lang="sass">
.dialog
  min-width: 300px
  background: white
</style>
