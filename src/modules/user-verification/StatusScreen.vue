<template>
  <div class="status-screen">
    <div class="block-info-title">
      <span>{{ title }}</span>
      <q-icon
        v-if="solution === 'processing'"
        class="animation-icon"
        name="autorenew"
        size="50px"
        color="info"
      />
    </div>
    <div v-if="solution !== 'processing'" class="block-info-solution">
      <span>Решение:</span>
      <span
        :style="
          solutions == 'Доступ разрешен' ? 'color: var(--q-positive)' : 'color: var(--q-negative)'
        "
        >{{ solutions }}</span
      >
    </div>
    <div v-if="commentSolution && solution !== 'processing'" class="block-info-comment">
      <span class="main">Комментарий:</span>
      <span class="sub">{{ commentSolution }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QIcon } from 'quasar';

const props = defineProps<{
  solution: 'access' | 'rejection' | 'processing';
  commentSolution?: string;
}>();

const title = computed(() =>
  props.solution !== 'processing' ? 'Данные обработаны' : 'Данные обрабатываются',
);

const solutions = computed(() => {
  switch (props.solution) {
    case 'access':
      return 'Доступ разрешен';
    case 'rejection':
      return 'В доступе отказано';
    case 'processing':
    default:
      return '';
  }
});
</script>

<style>
.animation-icon {
  animation: spin 2s infinite ease-in-out;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.status-screen {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  background: white;
  min-width: 250px;
  max-width: 550px;
  max-height: 90%;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  padding: 16px;
}
.status-screen > [class^='block-info'] {
  display: flex;
  color: #414141;
}
.status-screen > .block-info-title {
  font-size: 1.5rem;
  align-items: center;
  gap: 16px;
}
.status-screen > .block-info-solution {
  font-size: 1.2rem;
  justify-content: space-between;
  gap: 16px;
}
.status-screen > .block-info-comment {
  flex-direction: column;
  font-size: 1rem;
}
.status-screen > .block-info-comment > .sub {
  font-size: 0.9rem;
  color: #555555;
}
</style>
