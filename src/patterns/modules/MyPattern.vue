<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
  >
    <div class="my-first-module">
      {{ props.foo + props.bar }}
    </div>
  </main-wrapper>
</template>

<script setup lang="ts">
import MainWrapper from "../../components/the-basics/MainWrapper.vue";

const props = defineProps<{
  foo: string
  bar: number
}>()

// const emit = defineEmits<{
//   (e: 'submit', v: string): void
//   (e: 'moduleStartView'): void
//   (e: 'moduleEndView'): void
// }>()
</script>

<style>
.my-first-module {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
