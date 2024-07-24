<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="emit('moduleStartView')"
    @module-end-view="emit('moduleEndView')"
  >
    <div class="user-verification">
      <LoadingScreen v-if="props.loading" />

      <UserInformationForm
        v-else-if="props.noUser"
        @submit-user-form="createUserData($event)"
      />

      <StatusScreen
        v-else
        :solution="props.statusSolution"
        :comment-solution="props.commentSolution"
      />
    </div>
  </main-wrapper>
</template>

<script setup lang="ts">
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import UserInformationForm from './UserInformationForm.vue'
import LoadingScreen from './LoadingScreen.vue'
import StatusScreen from './StatusScreen.vue'
import type { IUserForm, IForm } from './types'

const props = defineProps<{
  loading: boolean
  noUser: boolean
  statusSolution: 'access' | 'rejection' | 'processing'
  commentSolution?: string
}>()

const emit = defineEmits<{
  (e: 'submitUserForm', v: IForm): void
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
}>()

const createUserData = (form: IUserForm) => {
  const data = {
    fullName: form.fullName.value,
    nameLegalEntity: form.nameLegalEntity.value,
    inn: form.inn.value.replaceAll(' ', ''),
    powerAttorneyFile: form.powerAttorneyFile.value,
    cadastralNumbers: form.cadastralNumbers.value
      .filter(cadastralNumber => /^\d{2}:\d{2}:\d{6,7}:\d{1,5}$/.test(cadastralNumber))
      .join(', '),
    contourNumber: form.contourNumber.value
      .filter(cadastralNumber => /^[0-9]+$/.test(cadastralNumber))
      .join(', '),
    approval: true,
  }

  emit('submitUserForm', data)
}
</script>

<style>
.user-verification {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.user-verification input {
  font-size: 1.1em;
}
</style>
