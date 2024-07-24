<template>
  <q-list v-if="props.data.length" class="business-modules__files" bordered separator>
    <q-item
      v-for="file of props.data"
      :key="file.docId"
      :active="!props.ecpMode && file.docName == activeFile?.docName"
      dense
      clickable
      @click="!props.ecpMode && showFile(file)"
      :disable="file.disabled"
    >
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white" :icon="getIcon(format(file.docName))" />
      </q-item-section>

      <q-item-section>
        <q-item-label style="overflow-wrap: break-word">{{ file.docName }}</q-item-label>
        <q-item-label class="business-modules__files-list-item">{{ file.fileDate }}</q-item-label>
      </q-item-section>

      <q-item-section side top v-if="file.disabled">
        <slot name="response" v-bind:file="file"></slot>
      </q-item-section>

      <q-item-section side top v-if="!props.ecpMode">
        <slot name="btn" v-bind:file="file"></slot>
      </q-item-section>

      <q-item-section side top v-if="!props.ecpMode">
        <slot name="slotDelete" v-bind:file="file"></slot>
      </q-item-section>

      <q-item-section v-if="!props.ecpMode" side top>
        <q-btn round flat color="primary" icon="file_download" @click.stop="downloadFile(file.url)">
          <q-tooltip :delay="isImage(format(file.docName)) ? 1000 : 400">
            <img v-if="isImage(format(file.docName))" :src="file.url" width="200" />
            <div v-else>Скачать</div>
          </q-tooltip>
        </q-btn>
      </q-item-section>

      <q-item-section v-else side>
        <q-icon :name="getIconSig(file.docName)" :color="iconSigColor(file.docName)">
          <q-tooltip> {{ iconSigInfo(file.docName) }}</q-tooltip>
        </q-icon>
      </q-item-section>
    </q-item>
  </q-list>

  <q-linear-progress v-else-if="loading" indeterminate color="secondary" size="4px" />

  <div v-else class="business-modules__files-no-data">Нет файлов</div>

  <FileViewer :imgsFormat="imgs" :docsFormat="docs" :file="activeFile" />
</template>

<script setup lang="ts">
import {
  QList,
  QItem,
  QItemSection,
  QAvatar,
  QBtn,
  QTooltip,
  QLinearProgress,
  QIcon,
  openURL,
} from 'quasar';
import { ref, onMounted } from 'vue';
import FileViewer from './FileViewer.vue';

export interface IFile {
  docName: string;
  docId: string;
  folder: boolean;
  fileDate: string;
  url: string;
  disabled?: boolean;
}

const props = defineProps<{
  data: IFile[];
  ecpMode?: boolean;
}>();

const loading = ref(true);

const loadEnd = () => {
  loading.value = false;
};

onMounted(() => {
  if (!props.data.length && loading.value) {
    setTimeout(loadEnd, 5000);
  }
});

const imgs = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
const docs = ['txt', 'xml', 'pdf', 'log'];

const isImage = (format: string) => {
  return imgs.includes(format);
};

const format = (name: string) => {
  return name.split('.')?.pop()?.toLowerCase() ?? '';
};

const getIcon = (format: string) => {
  if (imgs.find((el) => el == format)) return 'image';
  else if (docs.find((el) => el == format)) return 'description';
  else if (format == 'sig') return 'assignment_turned_in';
  else return 'folder_zip';
};

const activeFile = ref<IFile | null>(null);

const showFile = async (file: IFile) => {
  if (activeFile.value?.docName == file.docName) activeFile.value = null;
  else activeFile.value = file;
};

const downloadFile = (url: string) => {
  openURL(url + '&download=true');
};

const fileIsSoloSig = (name: string) => {
  let _name: string | string[] = name.split('.');
  _name.pop();
  _name = _name.join('.');

  const solo = props.data.findIndex((el: IFile) => el.docName == _name);

  if (solo == -1) return true;
  else return false;
};

const getIconSig = (name: string) => {
  if (format(name) == 'sig') return fileIsSoloSig(name) ? 'file_copy' : 'create';
  else if (props.data.find((el: IFile) => el.docName == `${name}.sig`)) return 'done';
  else return '';
};

const iconSigColor = (name: string) => {
  const icon = getIconSig(name);
  switch (icon) {
    case 'file_copy':
    case 'create':
      return 'blue';
    case 'done':
      return 'green';
    case '':
      return '';
  }
};

const iconSigInfo = (name: string) => {
  const icon = getIconSig(name);
  switch (icon) {
    case 'file_copy':
      return 'Этот файл подписан прикрепленной подписью';
    case 'create':
      return 'Это файл подписи';
    case 'done':
      return 'Файл подписан';
    case '':
      return 'Файл не подписан';
  }
};
</script>

<style>
.business-modules__files {
  min-width: 300px;
  margin: 8px;
}

.business-modules__files-list-item {
  color: #5b5b5b;
  font-size: 0.8em;
}

.business-modules__files-no-data {
  min-width: 300px;
  padding: 8px;
}
</style>
./FilesTypes
