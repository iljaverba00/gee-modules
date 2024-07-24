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
      :files="props.files"
      :card="props.stageOneCard"
      :reason-refusal="props.reasonRefusal"
      @load-first-step="emit('loadFirstStep')"
      @clear-first-step="emit('clearFirstStep')"
      @rejection="emit('rejection', $event)"
      @next-step="nextStep(true)"
    />
    <stage-two
      v-if="step == 1"
      :disable-activity="disableActivityStepTwo"
      :procedure-run="props.procedureRun"
      :card="props.stageTwoCard"
      :card-list="props.stageTwoCardList"
      @load-second-step="emit('loadSecondStep')"
      @clear-second-step="emit('clearSecondStep')"
      @refresh-documents="emit('refreshDocuments')"
      @start-procedure="emit('startProcedure')"
      @next-step="nextStep(true)"
    >
      <slot name="stageTwo"> </slot>
    </stage-two>
    <stage-three
      v-if="step == 2"
      :disable-activity="disableActivityStepThree"
      :statuses="props.applicationStatuses"
      :files="props.filesToSigning"
      @load-third-step="emit('loadThirdStep')"
      @clear-third-step="emit('clearThirdStep')"
      @get-files-to-signing="emit('getFilesToSigning')"
      @set-signing-files="emit('setSigningFiles', $event)"
      @next-step="nextStep(true)"
    />
    <stage-four
      v-if="step == 3"
      :disable-activity="disableActivityStepFour"
      :card-list="props.stageFourCardList"
      :import-procedure-list="props.importProcedureList"
      :procedure-import-name="props.procedureImportName"
      @get-layers-by-card="emit('getLayersByCard', $event)"
      @load-fourth-step="emit('loadFourthStep')"
      @clear-fourth-step="emit('clearFourthStep')"
      @run-procedure-import="emit('runProcedureImport', $event)"
      @next-step="nextStep(true)"
    >
      <slot name="stageFour"> </slot>
    </stage-four>
  </main-wrapper>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import StageOne from './stages/StageOne.vue'
import StageTwo from './stages/StageTwo.vue'
import StageThree from './stages/StageThree.vue'
import StageFour from './stages/StageFour.vue'

import steps from './StepsConfig.json'

import type {
  IFile,
  IFilesGroup,
  ICardRow,
  IReasonRefusal,
  ICardList,
  IProcedure,
} from './RegistrationDocumentsGisogdTypes'

const props = defineProps<{
  showModule: boolean
  // stage 1
  files: IFile[]
  stageOneCard: ICardRow[]
  reasonRefusal: IReasonRefusal[]
  // stge 2
  procedureRun: boolean
  stageTwoCard: ICardRow[]
  stageTwoCardList: ICardList[]
  // stage 3
  applicationStatuses: ICardRow[]
  filesToSigning: IFilesGroup[]
  // stage 4
  procedureImportName: string
  stageFourCardList: ICardList[]
  importProcedureList: IProcedure[]
}>()

const emit = defineEmits([
  'loadFirstStep',
  'loadSecondStep',
  'loadThirdStep',
  'loadFourthStep',

  'clearFirstStep',
  'clearSecondStep',
  'clearThirdStep',
  'clearFourthStep',

  'moduleStartView',
  'moduleEndView',

  'close',

  'rejection',
  'startProcedure',
  'refreshDocuments',
  'getFilesToSigning',
  'setSigningFiles',
  'getLayersByCard',
  'runProcedureImport',

  'saveActiveStep',
])

const step = ref(0)
const lastCompletedStep = ref(-1)

const disableActivityStepOne = ref(false)
const disableActivityStepTwo = ref(false)
const disableActivityStepThree = ref(false)
const disableActivityStepFour = ref(false)

const nextStep = (save?: boolean) => {
  disableActivity(step.value)

  if (lastCompletedStep.value + 1 == step.value) lastCompletedStep.value++
  if (step.value <= steps.length - 1) step.value++

  if (save) emit('saveActiveStep', step.value)
}

const computedStep = computed({
  get: () => step.value,
  set: (s: number) => {
    step.value = s
    lastCompletedStep.value = s - 1

    disableActivityStepOne.value = s > 0 ? true : false
    disableActivityStepTwo.value = s > 1 ? true : false
    disableActivityStepThree.value = s > 2 ? true : false
    disableActivityStepFour.value = s > 3 ? true : false
  },
})

const disableActivity = (step: number) => {
  switch (step) {
    case 0:
      disableActivityStepOne.value = true
      break
    case 1:
      disableActivityStepTwo.value = true
      break
    case 2:
      disableActivityStepThree.value = true
      break
    case 3:
      disableActivityStepFour.value = true
      break
  }
}

defineExpose({
  nextStep,
  computedStep,
  disableActivityStepOne,
  disableActivityStepTwo,
  disableActivityStepThree,
  disableActivityStepFour,
})
</script>

<style>
.business-modules__loading {
  padding: 8px;
  min-width: 300px;
}
</style>
