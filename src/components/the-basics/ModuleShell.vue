<template>
  <q-splitter
    class="business-modules__module-shell"
    v-model="splitter"
    :limits="limits"
  >
    <template #before>
      <div
        class="full-height"
        v-if="props.hideDescription"
      >
        <this-header
          title="Этапы"
          close-btn
          :parent="{ splitter, limits }"
          @update:splitter="splitter = $event"
          @close-module="$emit('closeModule')"
        />
        <q-stepper
          v-if="steps"
          class="business-modules__module-shell-stepper"
          color="primary"
          v-model="activeStep"
          header-nav
          flat
          vertical
          animated
        >
          <q-step
            v-for="(step, index) of steps"
            :key="index"
            :name="index"
            :title="step.title"
            :icon="step.icon"
            :done="lastCompletedStep + 1 > index"
            :active-icon="lastCompletedStep < index ? 'edit' : 'done'"
            :caption="step.caption"
            active-color="secondary"
            done-color="primary"
            @click="setStep(index)"
          />
        </q-stepper>
      </div>
      <q-splitter
        v-else
        v-model="splitterHorizontal"
        horizontal
        :limits="[10, 90]"
      >
        <template #before>
          <this-header
            title="Этапы"
            close-btn
            :parent="{ splitter, limits }"
            @update:splitter="splitter = $event"
            @close-module="$emit('closeModule')"
          />
          <q-stepper
            v-if="steps"
            class="business-modules__module-shell-stepper"
            color="primary"
            v-model="activeStep"
            header-nav
            flat
            vertical
            animated
          >
            <q-step
              v-for="(step, index) of steps"
              :key="index"
              :name="index"
              :title="step.title"
              :icon="step.icon"
              :done="lastCompletedStep + 1 > index"
              :active-icon="lastCompletedStep < index ? 'edit' : 'done'"
              :caption="step.caption"
              :disable="lastCompletedStep + 1 < index"
              active-color="secondary"
              done-color="primary"
              @click="setStep(index)"
            />
          </q-stepper>
        </template>
        <template v-slot:after>
          <this-header
            title="Описание этапа"
            :parent="{ splitter, limits }"
            @update:splitter="splitter = $event"
          />
          <div class="business-modules__module-shell-step-info">
            {{ steps[activeStep]?.body }}
          </div>
        </template>
      </q-splitter>
    </template>
    <template #after>
      <slot name="default"> </slot>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { QStep, QStepper, QSplitter } from 'quasar'
import { ref, toRefs } from 'vue'
import ThisHeader from '../ThisHeader.vue'

interface IStep {
  title: string
  body?: string
  caption?: string
  icon?: string
}

const props = defineProps<{
  steps: IStep[]
  activeStep: number
  lastCompletedStep: number
  hideDescription?: boolean // отключает описание этапа
  withoutBlocking?: boolean // не блокирует переход между шагами
}>()
const { steps, activeStep, lastCompletedStep } = toRefs(props)

const emit = defineEmits(['setActiveStep', 'closeModule'])

const splitter = ref(20)
const limits = [10, 30]

const splitterHorizontal = ref(50)

const setStep = (index: number) => {
  if (lastCompletedStep.value + 1 >= index || props.withoutBlocking) {
    emit('setActiveStep', index)
  }
}
</script>

<style>
.business-modules__module-shell {
  height: 100%;
  width: 100%;
}

.business-modules__module-shell-stepper {
  height: calc(100% - 36px);
  overflow-y: auto;
  background: none;
}

.business-modules__module-shell-step-info {
  height: calc(100% - 36px);
  overflow-y: auto;
  word-wrap: break-word;
  padding: 8px;
}
</style>
