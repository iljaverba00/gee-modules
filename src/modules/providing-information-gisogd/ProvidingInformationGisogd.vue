<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="true"
    :show-module="props.showModule"
    :steps="steps"
    :step="step"
    :last-completed-step="lastCompletedStep"
    @module-start-view="emit('moduleStartView')"
    @module-end-view="emit('moduleEndView')"
    @set-active-step="step = $event"
    @close-module="emit('close')"
  >
    <stage-one
      v-if="step == 0"
      :disable-activity="disableActivityStepOne"
      :files="props.stepOneFiles"
      :card="props.stepOneCard"
      :reason-refusal="props.stepOneReasonRefusal"
      @load-first-step="emit('loadFirstStep')"
      @clear-first-step="emit('clearFirstStep')"
      @reject-first-step="emit('rejectFirstStep', $event)"
      @next-step="nextStep()"
    >
    </stage-one>
    <stage-two
      v-if="step == 1"
      :disable-activity="disableActivityStepTwo"
      :card="props.stepTwoEditedCard"
      @load-second-step="emit('loadSecondStep')"
      @clear-second-step="emit('clearSecondStep')"
      @save-card-second-step="
        emit('saveCardSecondStep', $event);
        nextStep()
      "
      @next-step="nextStep()"
    >
    </stage-two>
  </main-wrapper>
</template>

<script setup lang="ts">
import { VueElementConstructor, ref } from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import StageOne from './stages/StageOne.vue'
import StageTwo from './stages/StageTwo.vue'

import steps from './StepsConfig.json'

import { IFile, ICardRow, IReasonRefusal } from './ProvidingInformationGisogdTypes'

interface ICard {
  component: VueElementConstructor
  card: object
}

const props = defineProps<{
  showModule: boolean

  stepOneFiles: IFile[]
  stepOneCard: ICardRow[]
  stepOneReasonRefusal: IReasonRefusal[]

  stepTwoEditedCard: ICard | ICard[]
}>()

const emit = defineEmits([
  'loadFirstStep',
  'clearFirstStep',
  'rejectFirstStep',

  'loadSecondStep',
  'clearSecondStep',
  'saveCardSecondStep',

  'moduleStartView',
  'moduleEndView',
  'close',
])

const step = ref(0)
const lastCompletedStep = ref(-1)

const disableActivityStepOne = ref(false)
const disableActivityStepTwo = ref(false)

const nextStep = () => {
  disableActivity(step.value)

  if (lastCompletedStep.value + 1 == step.value) lastCompletedStep.value++
  if (step.value <= steps.length - 1) step.value++

  // if (save) emit('saveActiveStep', step.value)
}

const disableActivity = (step: number) => {
  switch (step) {
    case 0:
      disableActivityStepOne.value = true
      break
    case 1:
      disableActivityStepTwo.value = true
      break
  }
}

defineExpose({
  nextStep,
  disableActivityStepOne,
  disableActivityStepTwo,
})!
</script>
