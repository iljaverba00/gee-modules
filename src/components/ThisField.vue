<template>
  <div
    class="modules-field"
    :class="props.toLine ? 'modules-field-line' : 'modules-field-stack'"
  >
    <div
      v-if="props.label"
      class="label"
    >
      <p>{{ props.label }}</p>
      <p
        class="necessarily"
        v-if="props.necessarily"
      >
        *
      </p>
    </div>
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  toLine?: boolean
  necessarily?: boolean
}>()
</script>

<style>
.modules-field {
  width: 100%;
  display: flex;
  margin: 0 0 16px 0;
}
.modules-field > .label {
  font-size: 1rem;
  color: rgb(29, 29, 29);
}
.modules-field-stack {
  flex-direction: column;
}
.modules-field-line {
  flex-direction: row;
  align-items: center;
}
.modules-field-stack > .label {
  margin: 0 0 4px 0;
}
.modules-field-line > .label {
  white-space: nowrap;
  margin: 0 8px 0 0;
}
.label {
  display: flex;
}
.label > p {
  margin: 0;
}
.necessarily {
  color: var(--q-primary);
  font-size: 1.5rem;
  line-height: 1rem;
}
</style>
