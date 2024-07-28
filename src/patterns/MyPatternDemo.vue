<script setup lang="ts">
//import {ref} from 'vue'
// import MyPattern from "./modules/MyPattern.vue";
// import FileDirectory from "../modules/file-directory/FileDirectory.vue";
//
// const localeFoo = ref('1')
// const localeBar = ref(1)

import requests from "../modules/xsd-forms-admin/XsdFormAdminService.ts";
import XsdFormAdmin from "../modules/xsd-forms-admin/XsdFormAdmin.vue";

const req = requests();

</script>

<template>
 <XsdFormAdmin :requests="req" />
</template>

<style>
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  background-color: #ececec;

}

.app {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 30px;
  position: relative;
}

:root {
  --q-primary: #2450df;
  --q-secondary: #04db89;
  --q-negative: #ce1616;
}
</style>
