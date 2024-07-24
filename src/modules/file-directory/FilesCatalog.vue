<template>
  <div class="catalog-root custom-scroll">
    <q-tree
      v-load-tree
      ref="catalogRef"
      node-key="uid"
      icon="keyboard_arrow_right"
      label-key="name"
      children-key="content"
      no-nodes-label="Нет файлов"
      control-color="black"
      selected-color="black"
      dense
      :duration="150"
      :nodes="nodes"
      v-model:selected="selectedUid"
      no-selection-unset
      @update:selected="updateSelected($event)"
      @lazy-load="(v: ILazyLoadData) => emits('lazyLoad', v)"
    >
      <template v-slot:default-header="prop">
        <div class="catalog-item">
          <q-icon
            :name="prop.node.icon"
            :color="prop.node.color"
          />
          <div class="label">
            {{ prop.node.name }}
          </div>
          <q-btn
            class="menu-btn"
            :style="props.selectedNode == prop.node ? 'opacity: 1' : ''"
            icon="more_vert"
            size="xs"
            round
            flat
            @click.stop
          >
            <this-menu
              :node="prop.node"
              :utils="utils"
              @update="emits('updateFolderContent', $event)"
              @showFileUploadConfirmationDialog="emits('showFileUploadConfirmationDialog', $event)"
            />
          </q-btn>
        </div>
        <this-menu
          :node="prop.node"
          :utils="utils"
          is-context
          @update="emits('updateFolderContent', $event)"
          @showFileUploadConfirmationDialog="emits('showFileUploadConfirmationDialog', $event)"
        />
      </template>
    </q-tree>
  </div>
</template>

<script setup lang="ts">
import { QBtn, QIcon, QTree } from 'quasar'
import { ref, toRefs, computed, watch } from 'vue'

import ThisMenu from './ThisMenu.vue'
import type { IFileOrFolder, ILazyLoadData, IFileUploadData, UtilType } from './FileDirectoryTypes'

const props = defineProps<{
  nodes: IFileOrFolder[]
  selectedNode: IFileOrFolder | null
  utils: UtilType
}>()

const emits = defineEmits<{
  (e: 'lazyLoad', v: ILazyLoadData): void
  (e: 'selectNode', node: IFileOrFolder): void
  (e: 'updateFolderContent', path: string): void
  (e: 'showFileUploadConfirmationDialog', data: IFileUploadData): void
}>()

const { nodes, utils } = toRefs(props)

const { getFolderContent } = utils.value

const catalogRef = ref<QTree>()
const vLoadTree = {
  mounted: () => {
    expandNode('root')
    updateSelected('root')
  },
}

const selectedUid = computed(() => props.selectedNode?.uid ?? null)

const updateSelected = (nodeUid: string) => {
  const node = getNode(nodeUid)
  if (!node) return

  emits('selectNode', node)
}

watch(selectedUid, async () => {
  const node = props.selectedNode

  if (!node) return
  if (node.type == 'FILE') return

  if (node.dataHasBeenRequested === false) {
    const parentType = node.type

    node.content = await getFolderContent(node.path, parentType)
    node.dataHasBeenRequested = true
    node.lazy = false
  }

  expandNode(node.uid)
})

const expandNode = (nodeUid: string) => {
  if (!catalogRef.value) return
  catalogRef.value.setExpanded(nodeUid, true)
}

const getNode = (nodeUid: string | null) => {
  if (!catalogRef.value) return
  const node = catalogRef.value.getNodeByKey(nodeUid) as IFileOrFolder

  return node
}
</script>

<style scoped lang="sass">
.catalog-root
  width: 100%
  height: 100%

.catalog-item
  display: flex
  align-items: center
  min-height: 25px
  width: 100%

  .label
    width: 100%
    padding: 0 8px
    white-space: nowrap
    overflow-x: hidden
    text-overflow: ellipsis

  &:hover
    .menu-btn
      opacity: 1

.menu-btn
  width: 21px
  max-height: 21px
  opacity: 0
  transition: opacity 150ms ease

  &:focus-visible
    opacity: 1
</style>

<style>
.catalog-root .q-tree__node--selected {
  background: #32414f24 !important;
}
</style>
