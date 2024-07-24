<template>
  <q-list
    v-if="props.content && props.content.length"
    class="files-list custom-scroll"
  >
    <q-item
      v-for="file of props.content"
      :id="`file-${file.uid}`"
      :key="file.uid"
      :active="props.selectedNode?.uid == file.uid"
      class="file-item"
      active-class="selected-file"
      dense
      clickable
      v-ripple
      @click="emits('selectNode', file)"
    >
      <q-item-section avatar>
        <q-icon
          :name="file.icon"
          :color="file.color"
        />
      </q-item-section>
      <q-item-section>{{ file.name }}</q-item-section>
      <q-item-section side>
        <q-btn
          class="menu-btn"
          :style="props.selectedNode == file ? 'opacity: 1' : ''"
          icon="more_vert"
          size="sm"
          round
          flat
          @click.stop
        >
          <this-menu
            :node="file"
            :utils="utils"
            @update="emits('updateFolderContent', $event)"
            @showFileUploadConfirmationDialog="emits('showFileUploadConfirmationDialog', $event)"
          />
        </q-btn>
      </q-item-section>
      <this-menu
        :node="file"
        :utils="utils"
        is-context
        @update="emits('updateFolderContent', $event)"
        @showFileUploadConfirmationDialog="emits('showFileUploadConfirmationDialog', $event)"
      />
    </q-item>
  </q-list>
  <div
    class="no-data"
    v-else
  >
    Эта папка пуста
  </div>
</template>

<script setup lang="ts">
import { QBtn, QIcon, QList, QItem, QItemSection } from 'quasar'
import ThisMenu from './ThisMenu.vue'
import type { IFileOrFolder, IFileUploadData, UtilType } from './FileDirectoryTypes'
import { toRefs } from 'vue'

const props = defineProps<{
  selectedNode: IFileOrFolder | null
  content?: IFileOrFolder[]
  utils: UtilType
}>()

const { utils } = toRefs(props)

const emits = defineEmits<{
  (e: 'selectNode', node: IFileOrFolder): void
  (e: 'updateFolderContent', path: string): void
  (e: 'showFileUploadConfirmationDialog', data: IFileUploadData): void
}>()
</script>

<style scoped lang="sass">
.files-list
  width: 100%
  height: 100%

.file-item
  &:hover
    .menu-btn
      opacity: 1

.selected-file
  background: #32414f24
  color: black

.no-data
  text-align: center
  padding: 8px
  color: #535353
  user-select: none

.menu-btn
  width: 30px
  max-height: 30px
  opacity: 0
  color: black
  transition: opacity 150ms ease

  &:focus-visible
    opacity: 1
</style>
