<template>
  <q-dialog
    v-model="showModule"
    maximized
  >
    <q-card v-start>
      <module-shell
        v-if="stepperMode"
        :steps="props.steps"
        :active-step="props.step"
        :last-completed-step="props.lastCompletedStep"
        :hide-description="props.hideDescription"
        :without-blocking="props.withoutBlocking"
        @set-active-step="emit('setActiveStep', $event)"
        @close-module="emit('closeModule')"
      >
        <slot name="default"></slot>
      </module-shell>
      
      <div
        v-else
        style="width: 100%; height: 100%"
      >
        <slot name="default"></slot>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { QDialog, QCard } from 'quasar'
import ModuleShell from './ModuleShell.vue'

interface IStep {
  title: string
  body?: string
  caption?: string
  icon?: string
}

const props = defineProps<{
  stepperMode: boolean
  showModule: boolean
  steps: IStep[]
  step: number
  lastCompletedStep: number
  hideDescription?: boolean // отключает описание этапа
  withoutBlocking?: boolean // не блокирует переход между шагами
}>()

const { showModule } = toRefs(props)

const emit = defineEmits(['moduleStartView', 'moduleEndView', 'setActiveStep', 'closeModule'])

const vStart = {
  mounted: () => emit('moduleStartView'),
  unmounted: () => emit('moduleEndView'),
}
</script>
