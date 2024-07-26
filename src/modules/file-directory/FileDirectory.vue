<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="emit('moduleStartView')"
  >
    <div
      v-if="props.access"
      class="file-directory"
    >
      <div class="body">
        <div class="grid-container">
          <div class="catalog">
            <files-catalog
              :nodes="nodes"
              :selected-node="selectedNode"
              :utils="localUtils"
              @lazy-load="onLazyLoad"
              @select-node="selectNode"
              @update-folder-content="updateFolderContent($event)"
              @showFileUploadConfirmationDialog="showFileUploadConfirmationDialog($event)"
            />
          </div>
          <div class="path">
            <this-path
              :path="selectedFolderPath"
              :loading="transitionAlongWayLoading"
              @get-folder-by-path="getFolderByPath($event)"
              @update="updateFolderContent($event)"
            />
          </div>
          <div class="search">
            <search-in-folder
              :folder-name="selectedFolderName"
              @search="searchContent($event)"
              @search-clear="searchClear"
            />
          </div>
          <div
            class="working-area"
            @dragenter="onDragEnter"
            @dragleave="onDragLeave"
            @dragover="onDragEnter"
            @dragexit="onDragLeave"
            @drop="onDrop"
          >
            <download-progress />
            <files-list
              :content="filteredFolderContent"
              :selected-node="selectedNode"
              :utils="localUtils"
              @select-node="selectNode"
              @update-folder-content="updateFolderContent($event)"
              @showFileUploadConfirmationDialog="showFileUploadConfirmationDialog($event)"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="no-data"
    >
      У вас нет доступа к файловой системе
    </div>
  </main-wrapper>

  <ConfirmDeletionDialog
    v-if="selectedNode"
    :model="confirmDeletion"
    :node="selectedNode"
    @update:model="confirmDeletion = $event"
    @confirm="onDelete(selectedNode.path)"
  />

  <FileUploadConfirmationDialog
    :model="fileUploadModel"
    :data="fileUploadFiles"
    @update:model="fileUploadModel = $event"
    @decision="fileUploadDecision($event)"
  />

  <LoadingVisualizationPanel />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, toRefs } from 'vue'
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import FilesCatalog from './FilesCatalog.vue'
import ThisPath from './ThisPath.vue'
import SearchInFolder from './SearchInFolder.vue'
import FilesList from './FilesList.vue'
import ConfirmDeletionDialog from './dialogs/ConfirmDeletionDialog.vue'
import FileUploadConfirmationDialog from './dialogs/FileUploadConfirmationDialog.vue'
import DownloadProgress from './DownloadProgress.vue'
import LoadingVisualizationPanel from './loading-panel/LoadingVisualizationPanel.vue'
import utils from './utils'

import type {
  IFileOrFolder,
  ILazyLoadData,
  IFileUploadData,
  IDecisionData,
  RequestsType,
} from './FileDirectoryTypes'
import './custom-scroll.sass'

const props = defineProps<{
  requests: RequestsType
  access: boolean
}>()

const emit = defineEmits<{
  (e: 'moduleStartView'): void
}>()

const { requests } = toRefs(props)
const localUtils = utils(requests.value)

const {
  getFolderContent,
  getNodeByPath,
  getNodesTreeByPath,
  deleteByPath,
  sendFilesByPath,
  getFilesByDataTransfer,
  checkFileExist,
  creteNewFileName,
} = localUtils

const fileUploadModel = ref(false)
const fileUploadFiles = ref<IFileUploadData[]>([])

const showFileUploadConfirmationDialog = (data: IFileUploadData) => {
  fileUploadFiles.value.push(data)
  fileUploadModel.value = true
}

const fileUploadDecision = async ({ decision, file, parentPath }: IDecisionData) => {
  switch (decision) {
    case 'save': {
      const newName = await creteNewFileName(parentPath, file)
      const success = await sendFilesByPath(parentPath, file, newName)
      success && (await updateFolderContent(parentPath))
      break
    }
    case 'skip': {
      break
    }
    case 'replace': {
      const success = await sendFilesByPath(parentPath, file)
      success && (await updateFolderContent(parentPath))
      break
    }
  }
}

onMounted(() => {
  ['dragover', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, preventDefault)
  })

  document.addEventListener('keyup', keyupDelete)
})

onUnmounted(() => {
  ['dragover', 'drop'].forEach(eventName => {
    document.removeEventListener(eventName, preventDefault)
  })

  document.removeEventListener('keyup', keyupDelete)
})

const preventDefault = (event: Event) => {
  event.preventDefault()
  return false
}

const keyupDelete = (event: KeyboardEvent) => {
  event.preventDefault()
  if (event.code !== 'Delete') return
  if (
    !selectedNode.value ||
    selectedNode.value.type === 'ROOT' ||
    selectedNode.value.type === 'DATA_FOLDER'
  )
    return

  confirmDeletion.value = true
}

const onDragEnter = (event: DragEvent) => {
  event.preventDefault()
  if (selectedFolderType.value == 'OBJECT_FOLDER') return

  const el = document.querySelector('.working-area') as HTMLElement
  el.classList.add('select-container')
}
const onDragLeave = (event: DragEvent) => {
  event.preventDefault()
  if (selectedFolderType.value == 'OBJECT_FOLDER') return

  const el = document.querySelector('.working-area') as HTMLElement
  el.classList.remove('select-container')
}
const onDrop = (event: DragEvent) => {
  event.preventDefault()
  if (selectedFolderType.value == 'OBJECT_FOLDER') return

  const el = document.querySelector('.working-area') as HTMLElement
  el.classList.remove('select-container')

  getFilesByDataTransfer(event.dataTransfer, async promiseFiles => {
    const files = await Promise.resolve(promiseFiles)

    if (!selectedFolderPath.value) return

    for (const file of files) {
      const isFileExist = await checkFileExist(selectedFolderPath.value, file)
      if (!isFileExist) {
        const success = await sendFilesByPath(selectedFolderPath.value, file)
        success && (await updateFolderContent(selectedFolderPath.value))
      } else {
        showFileUploadConfirmationDialog({
          parentPath: selectedFolderPath.value,
          file,
        })
      }
    }
  })
}

const onDelete = async (path: string) => {
  const success = await deleteByPath(path)
  success && (await updateFolderContent(getParentPath(path)))
}

const getParentPath = (path: string) => {
  const paths = path.split('/').filter(item => !!item)
  if (paths.length > 0) paths.pop()
  if (paths.length <= 0) return '/'
  return '/' + paths.join('/') + '/'
}

const nodes = ref<IFileOrFolder[]>([
  {
    name: '/',
    path: '/',
    type: 'ROOT',
    icon: 'account_tree',
    content: [] as IFileOrFolder[],
    uid: 'root',
    expanded: false,
    lazy: true,
    dataHasBeenRequested: false,
    color: 'black',
  },
])

/**
 * Executes a lazy load operation.
 *
 * @param {ILazyLoadData} data - The lazy load data containing the node and done function.
 * @returns {Promise<void>} - A promise that resolves when the lazy load operation is complete.
 */
const onLazyLoad = async (data: ILazyLoadData): Promise<void> => {
  const { node, done, fail } = data

  const path = node.path
  const parentType = node.type

  const content = await getFolderContent(path, parentType)

  if (content) done(content)
  else fail()

  node.dataHasBeenRequested = true
}

const selectedNode = ref<IFileOrFolder | null>(null)
const selectNode = (val: IFileOrFolder) => {
  selectedNode.value = val
}

const confirmDeletion = ref(false)

const transitionAlongWayLoading = ref(false)

const selectedFolderType = ref<string | undefined>()
const selectedFolderPath = ref<string | undefined>()
const selectedFolderName = ref<string | undefined>()
const selectedFolderContent = ref<IFileOrFolder[] | undefined>()
const filteredFolderContent = ref<IFileOrFolder[] | undefined>()

watch(
  selectedNode,
  node => {
    if (!node || node.type === 'FILE') return

    selectedFolderType.value = node.type
    selectedFolderPath.value = node.path
    selectedFolderName.value = node.name
    selectedFolderContent.value = filteredFolderContent.value = node.content
  },
  { deep: true },
)

const searchContent = (filterText: string) => {
  if (!selectedFolderContent.value || !selectedFolderContent.value.length) return

  filteredFolderContent.value = selectedFolderContent.value.filter(item =>
    item.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()),
  )
}

const searchClear = () => {
  filteredFolderContent.value = selectedFolderContent.value
}

/**
 * Updates the folder content for the specified path.
 *
 * @param {string} path - The path of the folder to update.
 * @return {Promise<void>} - A promise that resolves once the folder content has been updated.
 */
const updateFolderContent = async (path: string): Promise<void> => {
  const node = getNodeByPath(nodes.value, path)
  if (!node) return

  const content = await getFolderContent(path)
  if (!content) return

  node.content = content
  selectedNode.value = null
  selectedNode.value = node
}

/**
 * Retrieves a folder node from the given path.
 *
 * @param {string} path - The path of the folder.
 * @return {Promise<void>} - A promise that resolves when the folder node is retrieved.
 */
const getFolderByPath = async (path: string): Promise<void> => {
  transitionAlongWayLoading.value = true
  const node = getNodeByPath(nodes.value, path)

  if (node) {
    selectedNode.value = node
  } else {
    const newTree = await getNodesTreeByPath(path)

    if (newTree) {
      nodes.value = newTree
      const node = getNodeByPath(nodes.value, path)

      if (node) {
        selectedNode.value = node
      }
    } else {
      console.error('newTree: ', newTree)
    }
  }

  transitionAlongWayLoading.value = false
}
</script>

<style scoped lang="sass">
$b-b-color: #f9f9f9

.file-directory
  min-width: 250px
  width: 1100px
  max-width: 100%
  height: calc(100vh - 50px)
  margin: auto
  padding: 10px

.no-data
  min-width: 250px
  width: 1100px
  max-width: 100%
  margin: auto
  padding: 10px
  text-align: center
  font-size: 1.4em
  color: grey

.body
  overflow: hidden
  width: 100%
  height: 100%

.grid-container
  height: 100%
  width: 100%
  display: grid
  gap: 8px
  grid-template-columns: 266px repeat(3, 1fr)
  grid-template-rows: 40px repeat(3, 1fr)

.catalog
  grid-column-start: 1
  grid-column-end: 2
  grid-row-start: 2
  grid-row-end: 5
  background: $b-b-color

.path
  grid-column-start: 1
  grid-column-end: 3
  grid-row-start: 1
  grid-row-end: 2
  background: $b-b-color

.search
  grid-column-start: 3
  grid-column-end: 5
  grid-row-start: 1
  grid-row-end: 2
  background: $b-b-color

.working-area
  grid-column-start: 2
  grid-column-end: 5
  grid-row-start: 2
  grid-row-end: 5
  background: $b-b-color
  box-sizing: border-box
  border: 2px solid transparent

.select-container
  background: #1976D227
  border-radius: 4px
  border: 2px solid var(--q-primary)
</style>
