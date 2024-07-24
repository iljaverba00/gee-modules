<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="true"
    :show-module="showBuildingPermitDialog"
    :steps="stages"
    :step="step"
    :last-completed-step="lastCompletedStep"
    :allow-focus-outside="true"
    hide-description
    without-blocking
    @close-module="emit('close')"
    @set-active-step="emit('setActiveStep', $event)"
    @module-start-view="emit('moduleStartView')" >
    <q-card class="building-permit__data-side">
      <ThisHeader
        :title="stages[step].title"
        :action-btn="true"
        :action-btn-icon="'save'"
        @action="emit('saveCurrentStep')" />
      <q-card-section class="building-permit__component">
        <div
          v-for="field of cards"
          :key="field.component.length">
          <div
            v-if="field.title"
            class="building-permit__field-header">
            <span>{{ field.title }}</span>
          </div>
          <component
            v-if="field"
            :is="field.component"
            :card="field"
            editable></component>
        </div>
      </q-card-section>
    </q-card>
    <slot name="optionalSlot"></slot>
  </main-wrapper>
</template>

<script setup lang="ts">
import { VueElementConstructor, ref, toRefs } from 'vue';

import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import ThisHeader from '../../components/ThisHeader.vue';
import { QCard, QCardSection } from 'quasar';
// import EditedFields from '../..//components/EditedFields.vue';

import { Data } from './Types';

type Cards = {
  component: VueElementConstructor;
  card: object;
  title: string;
};

const emit = defineEmits(['showSearchDialog', 'setActiveStep', 'close', 'moduleStartView', 'saveCurrentStep']);
const props = defineProps<{ stages: Data[]; step: number; cards?: Cards[]; showBuildingPermitDialog: boolean; visible: boolean }>();

const lastCompletedStep = ref(-1);
const { stages, step, showBuildingPermitDialog, cards } = toRefs(props);
</script>

<style scoped>
.main-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.main-card-section {
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
}

.progress-bar {
  width: 100vw;
  max-height: 60px;
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.q-stepper__tab {
  min-height: 60px !important;
}
</style>

<style>
.building-permit__field-header {
  min-height: 36px;
  border-top: 1px solid rgb(0, 0, 0, 0.25);
  border-radius: 0;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 0px;
  text-align: center;
}
.building-permit__component > div:nth-child(1) > .building-permit__field-header {
  border-top: 0px !important;
}
.building-permit__data-side {
  overflow-y: hidden;
  height: 100%;
  border-radius: 0px;
}
.building-permit__component {
  overflow: auto;
  height: calc(100% - 36px);
  padding: 0px 15px;
}
#qStepper > .q-stepper__header > .q-stepper__tab {
  min-height: 60px !important;
}

#qStep {
  display: none;
}
</style>
