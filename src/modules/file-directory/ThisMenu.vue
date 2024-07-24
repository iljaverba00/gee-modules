<template>
  <q-menu
    :touch-position="props.isContext ? true : undefined"
    :context-menu="props.isContext ? true : undefined"
  >
    <q-list
      dense
      style="min-width: 100px"
    >
      <q-item
        v-if="type === 'DATA_FOLDER'"
        clickable
        v-close-popup
        @click="startUploadFiles"
      >
        <q-item-section>Загрузить файл/файлы</q-item-section>
        <q-item-section side>
          <q-icon name="upload_file" />
        </q-item-section>
      </q-item>

      <q-item
        v-if="type === 'OBJECT_FOLDER' || type === 'DATE_FOLDER'"
        clickable
        v-close-popup
        @click="startUploadFolder"
      >
        <q-item-section>Загрузить папку</q-item-section>
        <q-item-section side>
          <q-icon name="drive_folder_upload" />
        </q-item-section>
      </q-item>

      <q-item
        v-if="type == 'FOLDER' || type == 'ROOT'"
        clickable
        v-close-popup
        @click="addingFolder = true"
      >
        <q-item-section>Создать папку</q-item-section>
        <q-item-section side>
          <q-icon name="folder" />
        </q-item-section>
      </q-item>

      <q-item
        v-if="type == 'OBJECT_FOLDER'"
        clickable
        v-close-popup
        @click="addingDateFolder = true"
      >
        <q-item-section>Создать набор данных</q-item-section>
        <q-item-section side>
          <q-icon name="folder" />
        </q-item-section>
      </q-item>

      <q-item
        v-if="type == 'FOLDER' || type == 'ROOT'"
        clickable
        v-close-popup
        @click="addingFolderObject = true"
      >
        <q-item-section>Создать папку объекта</q-item-section>
        <q-item-section side>
          <q-icon name="create_new_folder" />
        </q-item-section>
      </q-item>

      <q-item
        v-if="type != 'FILE' && type != 'ROOT' && type != 'DATA_FOLDER'"
        clickable
        v-close-popup
        @click="confirmDeletion = true"
      >
        <q-item-section style="color: red">Удалить папку</q-item-section>
        <q-item-section side>
          <q-icon
            name="delete"
            color="red"
          />
        </q-item-section>
      </q-item>

      <q-item
        v-if="type == 'FILE'"
        clickable
        v-close-popup
        @click="downloadFile"
      >
        <q-item-section>Скачать файл</q-item-section>
        <q-item-section side>
          <q-icon name="file_download" />
        </q-item-section>
      </q-item>

      <q-item
        v-if="type == 'FILE'"
        clickable
        v-close-popup
        @click="confirmDeletion = true"
      >
        <q-item-section style="color: red">Удалить файл</q-item-section>
        <q-item-section side>
          <q-icon
            name="delete"
            color="red"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>

  <ConfirmDeletionDialog
    :model="confirmDeletion"
    :node="props.node"
    @update:model="confirmDeletion = $event"
    @confirm="onDelete"
  />

  <AddingFolderDialog
    :model="addingFolder"
    :parent-node="props.node"
    @update:model="addingFolder = $event"
    @create="addFolder($event)"
  />

  <AddingFolderObjectDialog
    :model="addingFolderObject"
    :parent-node="props.node"
    @update:model="addingFolderObject = $event"
    @create="addFolderObject($event)"
  />

  <AddingDateFolderDialog
    :model="addingDateFolder"
    :parent-node="props.node"
    @update:model="addingDateFolder = $event"
    @create="addFolderDate($event)"
  />

  <input
    ref="filesUploader"
    type="file"
    hidden
    multiple
    @click.stop
  />
  <input
    ref="directoryUploader"
    type="file"
    hidden
    multiple
    webkitdirectory
    directory
    @click.stop
  />
</template>

<script setup lang="ts">
import { QIcon, QList, QItem, QItemSection, QMenu, ClosePopup } from 'quasar'
import { ref, computed, toRefs } from 'vue'
import ConfirmDeletionDialog from './dialogs/ConfirmDeletionDialog.vue'
import AddingFolderDialog from './dialogs/AddingFolderDialog.vue'
import AddingFolderObjectDialog from './dialogs/AddingFolderObjectDialog.vue'
import AddingDateFolderDialog from './dialogs/AddingDateFolderDialog.vue'
import type { IFileOrFolder, IFile, UtilType } from './FileDirectoryTypes'

const vClosePopup = ClosePopup

const props = defineProps<{
  node: IFileOrFolder
  isContext?: boolean
  utils: UtilType
}>()

const emits = defineEmits<{
  (e: 'update', path: string): void
  (e: 'showFileUploadConfirmationDialog', data: { parentPath: string; file: IFile }): void
}>()

const { utils } = toRefs(props)
const {
  createFolderByPath,
  createFolderObjectByPath,
  createFolderDateByPath,
  deleteByPath,
  downloadFileByPath,
  sendFilesByPath,
  getFilesPathByFiles,
  checkFileExist,
} = utils.value

const type = computed(() => props.node.type)

const confirmDeletion = ref(false)
const addingFolder = ref(false)
const addingFolderObject = ref(false)
const addingDateFolder = ref(false)

const filesUploader = ref<HTMLInputElement>()
const directoryUploader = ref<HTMLInputElement>()

const startUploadFiles = () => {
  if (!filesUploader.value) return

  filesUploader.value.click()

  filesUploader.value.onchange = async event => {
    const inputFiles = (event.target as HTMLInputElement).files
    if (!inputFiles || !inputFiles.length) return

    const files = getFilesPathByFiles(inputFiles)

    for (const file of files) {
      const isFileExist = await checkFileExist(props.node.path, file)
      if (!isFileExist) {
        const success = await sendFilesByPath(props.node.path, file)
        success && emits('update', props.node.path)
      } else {
        emits('showFileUploadConfirmationDialog', {
          parentPath: props.node.path,
          file,
        })
      }
    }
  }
}

const startUploadFolder = () => {
  if (!directoryUploader.value) return

  directoryUploader.value.click()

  directoryUploader.value.onchange = async event => {
    const inputFiles = (event.target as HTMLInputElement).files
    if (!inputFiles || !inputFiles.length) return

    const files = getFilesPathByFiles(inputFiles)

    for (const file of files) {
      const isFileExist = await checkFileExist(props.node.path, file)
      if (!isFileExist) {
        const success = await sendFilesByPath(props.node.path, file)
        success && emits('update', props.node.path)
      } else {
        emits('showFileUploadConfirmationDialog', {
          parentPath: props.node.path,
          file,
        })
      }
    }
  }
}

const addFolder = async (folderPath: string) => {
  const success = await createFolderByPath(folderPath)
  success && emits('update', props.node.path)
}

const addFolderObject = async (data: { name: string; date: string }) => {
  const success = await createFolderObjectByPath(data.name, data.date)
  success && emits('update', props.node.path)
}

const addFolderDate = async (folderPath: string) => {
  const success = await createFolderDateByPath(folderPath)
  success && emits('update', props.node.path)
}

const onDelete = async () => {
  const success = await deleteByPath(props.node.path)
  success && emits('update', getParentPath(props.node.path))
}

const downloadFile = async () => {
  await downloadFileByPath(props.node.path, props.node.name)
}

const getParentPath = (path: string) => {
  const paths = path.split('/').filter(item => !!item)
  if (paths.length > 0) paths.pop()
  if (paths.length <= 0) return '/'
  return '/' + paths.join('/') + '/'
}
</script>
