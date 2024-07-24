<template>
  <div class="business-modules__map-wrapper">
    <div
      v-if="props.showLegend"
      class="drawer"
      :style="drawerStyle()"
    >
      <div
        class="drawer-controller"
        :style="drawerControllerStyle()"
      >
        <div
          class="content"
          @click="legendHidden = !legendHidden"
        >
          <q-icon :name="legendHidden ? 'arrow_forward_ios' : 'arrow_back_ios'" />
        </div>
      </div>
      <slot name="legend"> </slot>
    </div>
    <div :style="mapWrapperStyle()">
      <slot name="map"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QIcon } from 'quasar'
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  showLegend?: boolean
}>()

const legendHidden = ref(false)

watch(legendHidden, val => {
  sessionStorage.setItem('module__drawer-model', val ? 'true' : 'false')
})

onMounted(() => {
  const drawer = sessionStorage.getItem('module__drawer-model')

  if (drawer === 'true') {
    legendHidden.value = true
  } else {
    legendHidden.value = false
  }
})

const drawerStyle = () => {
  return !legendHidden.value ? 'width: 350px; height: 100%' : 'width: 0px; height: 100%'
}

const drawerControllerStyle = () => {
  if (props.showLegend && !legendHidden.value) {
    return 'left: 322px;'
  } else {
    return 'left: -27px;'
  }
}

const mapWrapperStyle = () => {
  if (props.showLegend && !legendHidden.value) {
    return 'width: calc(100% - 350px); height: 100%;'
  } else {
    return 'width: 100%; height: 100%'
  }
}
</script>

<style>
.business-modules__map-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  background: white;
}
.business-modules__map-wrapper > .drawer {
  transition: width 0.12s ease-in-out;
}
.business-modules__map-wrapper > .drawer > .drawer-controller {
  position: absolute;
  z-index: 1;
  margin-top: 92px;
  border-radius: 0 0px 6px 6px;
  width: 80px;
  height: 30px;
  rotate: 90deg;
  transform: perspective(50px) rotateX(230deg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: left 0.12s ease-in-out;
}
.business-modules__map-wrapper > .drawer > .drawer-controller > .content {
  rotate: 90deg;
  transform: perspective(50px) rotateY(323deg) scale(2);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.5;
  transition: opacity 0.25s;
  cursor: pointer;
}
.business-modules__map-wrapper > .drawer > .drawer-controller > .content:hover {
  opacity: 1;
}
</style>
