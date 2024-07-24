<template>
  <ol-scaleline-control
    class-name="business-modules__map-scaleline-control"
  />
</template>

<style>
.business-modules__map-scaleline-control {
  background: var(--q-primary);
  opacity: 0.8;
  border-radius: 4px;
  bottom: 4px;
  left: 4px;
  padding: 2px;
  position: absolute;
}
.business-modules__map-scaleline-control-inner {
  border: 1px solid white;
  border-top: none;
  color: white;
  font-size: 10px;
  text-align: center;
  margin: 1px;
  will-change: contents, width;
  transition: all 0.3s;
}
</style>
