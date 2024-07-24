<template>
  <fullscrean-window
    v-if="fullScreenMode"
    v-bind="_props"
    :stepperMode="stepperMode"
  />

  <div
    v-start
    v-else-if="!fullScreenMode && stepperMode"
    style="width: 100%; height: 100%"
  >
    <module-shell
      v-bind="_props"
      :active-step="_props.step"
    >
      <slot name="default"></slot>
    </module-shell>
  </div>

  <div
    v-start
    v-else-if="!fullScreenMode && !stepperMode"
    style="width: 100%; height: 100%; background: var(--module-bg-color);"
  >
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import FullscreanWindow from './FullscreanWindow.vue'
import ModuleShell from './ModuleShell.vue'

interface IStep {
  title: string
  body?: string
  caption?: string
  icon?: string
}

const props = defineProps<{
  fullScreenMode: boolean
  stepperMode: boolean
  showModule?: boolean
  steps?: IStep[]
  step?: number
  lastCompletedStep?: number
  hideDescription?: boolean // отключает описание этапа
  withoutBlocking?: boolean // не блокирует переход между шагами
}>()
const emit = defineEmits(['moduleStartView', 'moduleEndView'])

const { fullScreenMode, stepperMode, ...other } = toRefs(props)
const _props = reactive(other) as {
  showModule: boolean
  steps: IStep[]
  step: number
  lastCompletedStep: number
  hideDescription: boolean
  withoutBlocking: boolean
}

const vStart = {
  mounted: () => emit('moduleStartView'),
  unmounted: () => emit('moduleEndView'),
}
</script>
