<template>
  <div class="user-information-form custom-scroll">
    <FormFilling ref="formRef" />

    <this-field>
      <q-checkbox
        v-model="consentProcessing"
        label="Даю своё согласие на обработку персональных данных"
      />
    </this-field>

    <this-field>
      <q-btn
        color="primary"
        label="Отправить"
        :disable="!consentProcessing"
        @click="checkValidationForm"
      />
    </this-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QBtn, QCheckbox } from 'quasar'
import FormFilling from './FormFilling.vue'
import ThisField from '../../components/ThisField.vue'
import '../../components/custom-scroll.sass'
import type { IUserForm } from './types'

const emit = defineEmits<{
  (e: 'submitUserForm', v: IUserForm): void
}>()

const formRef = ref()

const consentProcessing = ref(false)

const checkValidationForm = async () => {
  const validation = (await formRef.value.validateForm()) as IUserForm

  let isTidy = true
  for (const fieldName in validation) {
    if (!validation[fieldName as keyof IUserForm].valid) {
      isTidy = false
      break
    }
  }

  if (isTidy) emit('submitUserForm', validation)
}
</script>

<style>
.user-information-form {
  width: 90%;
  min-width: 350px;
  max-width: 600px;
  max-height: 95%;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  padding: 16px 16px 0 16px;
  overflow: auto;
  background: white;
}
</style>
