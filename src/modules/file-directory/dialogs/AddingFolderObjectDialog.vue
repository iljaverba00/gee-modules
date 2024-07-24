<template>
  <q-dialog
    v-model="dialog"
    persistent
    seamless
  >
    <q-card class="dialog">
      <div class="q-pa-md text-h6">Создать папку объекта</div>
      <q-card-section class="q-pa-none q-px-md">
        <p>
          Чтобы добавить папку объекта в <b> {{ parentName }} </b>, <br />
          введите имя создаваемой папки
        </p>
        <q-input
          ref="inputNameRef"
          :class="{ 'apply-shake': inputNemeAnimation }"
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
        <p>Выберите дату</p>
        <q-input
          ref="inputDateRef"
          :class="{ 'apply-shake': inputDeteAnimation }"
          v-model="inputDate"
          mask="####_##_##"
          placeholder="1998_11_03"
          filled
          dense
          square
          no-error-icon
          lazy-rules="ondemand"
          @keyup.enter="create"
          :rules="[onlyDateRule, nameAlreadyThereRule]"
        >
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer"
            >
              <q-popup-proxy
                ref="popupProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="inputDate"
                  @update:model-value="popupProxy.hide()"
                  minimal
                  mask="YYYY_MM_DD"
                  :locale="locale"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
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
import {
  QInput,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QDate,
  QPopupProxy,
  QIcon,
} from 'quasar'
import { ref, computed } from 'vue'
import type { IFileOrFolder } from '../FileDirectoryTypes'
import type { Ref } from 'vue'

const props = defineProps<{
  model: boolean
  parentNode: IFileOrFolder
}>()

const emits = defineEmits<{
  (e: 'update:model', v: boolean): void
  (e: 'create', v: { name: string; date: string }): void
}>()

const dialog = computed({
  get: () => props.model,
  set: v => emits('update:model', v),
})

const locale = {
  days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  daysShort: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
  months: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthsShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июнь',
    'Июль',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
}

const inputNameRef = ref<QInput>()
const inputDateRef = ref<QInput>()
const popupProxy = ref()

const inputNemeAnimation = ref(false)
const inputDeteAnimation = ref(false)

const parentName = computed(() => props.parentNode.name)
const parentContents = computed(() => props.parentNode.content?.map(item => item.name))

const create = () => {
  const isValidName = inputNameRef.value?.validate()
  const isValidDate = inputDateRef.value?.validate()

  if (isValidName && isValidDate) {
    const data = {
      name: props.parentNode.path + inputName.value + '/',
      date: inputDate.value,
    }

    emits('create', data)
    close()
    return
  }

  !isValidName && startShake(inputNemeAnimation)
  !isValidDate && startShake(inputDeteAnimation)
}

const close = () => {
  inputName.value = ''
  inputDate.value = ''

  dialog.value = false
}

const startShake = (el: Ref<boolean>) => {
  el.value = true
  setTimeout(() => {
    el.value = false
  }, 730)
}

const inputName = ref('')
const inputDate = ref('')

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

const onlyDateRule = (val: string) => {
  const regExp = /^\d{4}_\d{2}_\d{2}$/
  return regExp.test(val) || 'Заполните дату в формате 1998_11_03'
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
