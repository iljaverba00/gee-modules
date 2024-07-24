<template>
  <q-dialog
    v-model="dialog"
    persistent
    seamless
  >
    <q-card class="dialog">
      <div class="q-pa-md text-h6">Создать папку</div>
      <q-card-section class="q-pa-none q-px-md">
        <p>
          Чтобы добавить новую папку в <b> {{ parentName }} </b>, <br />
          введите имя создаваемой папки
        </p>
        <q-input
          ref="inputRef"
          :class="{ 'apply-shake': inputAnimation }"
          v-model="inputName"
          filled
          dense
          square
          no-error-icon
          maxlength="64"
          placeholder="Новая папка"
          lazy-rules="ondemand"
          @keyup.enter="create"
          :rules="[minLengthRule, symbolRule, noDotRule, nameAlreadyThereRule, noDateRule]"
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
          @click="create"
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
import { QBtn, QCard, QCardActions, QCardSection, QDialog, QInput } from 'quasar'
import { ref, computed } from 'vue'
import type { IFileOrFolder } from '../FileDirectoryTypes'

const props = defineProps<{
  model: boolean
  parentNode: IFileOrFolder
}>()

const emits = defineEmits<{
  (e: 'update:model', v: boolean): void
  (e: 'create', name: string): void
}>()

const dialog = computed({
  get: () => props.model,
  set: v => emits('update:model', v),
})

const inputRef = ref<QInput>()
const inputAnimation = ref(false)

const parentName = computed(() => props.parentNode.name)
const parentContents = computed(() => props.parentNode.content?.map(item => item.name))

const inputName = ref('')

const minLengthRule = (val: string) => {
  return val.length > 0 || 'Введите имя'
}

const symbolRule = (val: string) => {
  const regExp = /[\\/:*?"<>|]/g
  return !regExp.test(val) || 'Имя не должно содержать символы: \\/:*?"<>|'
}

const noDotRule = (val: string) => {
  const regExp = /^\.|\.$/
  return !regExp.test(val) || 'Имя не должно начинаться и заканчиваться точкой'
}

const nameAlreadyThereRule = (val: string) => {
  return !parentContents.value?.find(item => item == val) || 'Файл с таким именем уже существует'
}

const noDateRule = (val: string) => {
  const regExp = /^\d{4}_\d{2}_\d{2}$/
  return !regExp.test(val) || 'Папку с данным форматом допустимо создавать толька в папках объекта'
}

const create = () => {
  const isValid = inputRef.value?.validate()

  if (isValid) {
    emits('create', props.parentNode.path + inputName.value + '/')
    close()
    return
  }

  startShake()
}

const close = () => {
  inputName.value = ''
  dialog.value = false
}

const startShake = () => {
  inputAnimation.value = true
  setTimeout(() => {
    inputAnimation.value = false
  }, 730)
}
</script>

<style scoped lang="sass">
.dialog
  min-width: 300px
  background: white
.apply-shake
  animation: shake 0.73s cubic-bezier(0.36, 0.07, 0.19, 0.97) both
@keyframes shake
  10%,
  90%
    transform: translate3d(-1px, 0, 0)
  20%,
  80%
    transform: translate3d(2px, 0, 0)
  30%,
  50%,
  70%
    transform: translate3d(-4px, 0, 0)
  40%,
  60%
    transform: translate3d(4px, 0, 0)
</style>
