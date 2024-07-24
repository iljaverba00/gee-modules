<template>
  <q-item v-if="props.parent" :disable="props.loading">
    <q-item-section>
      <q-item-label caption> Раздел документов: </q-item-label>
      <q-item-label>{{ props.parent.name }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label>{{ props.parent.count ?? '-' }}</q-item-label>
      <q-tooltip :delay="400">
        {{ props.items?.length ? 'Колличество документов в этом разделе' : 'Нет документов' }}
      </q-tooltip>
    </q-item-section>
  </q-item>

  <q-list v-if="props.items?.length" bordered separator>
    <q-expansion-item
      v-for="(item, index) in props.items"
      :key="index"
      :disable="props.loading"
      group="somegroup"
    >
      <template v-slot:header>
        <q-item-section side>
          <q-icon name="description" color="primary" />
        </q-item-section>

        <q-item-section>
          <q-item-label v-if="item.data.name">
            {{ item.data.name }}
          </q-item-label>

          <q-item-label v-else caption> Имя документа не задано </q-item-label>
        </q-item-section>
      </template>

      <template v-slot:default>
        <q-card>
          <q-card-section>
            <q-expansion-item
              ref="expansionChildsRef"
              hide-expand-icon
              expand-icon-toggle
              @before-show="emit('loadFiles', { parent: props.parent, doc: item })"
            >
              <template v-slot:header>
                <q-item-section class="expansion-tools">
                  <q-btn
                    label="Просмотр файлов"
                    color="primary"
                    icon="folder"
                    unelevated
                    no-caps
                    @click="expansionChildsRef[index].toggle()"
                  />

                  <q-btn
                    label="Перейти к объекту"
                    color="primary"
                    icon-right="place"
                    unelevated
                    no-caps
                    @click="emit('goPlace', { parent: props.parent, doc: item })"
                  />
                </q-item-section>
              </template>

              <template v-slot:default>
                <q-card>
                  <q-card-section
                    v-if="item.loading"
                    style="display: flex; justify-content: center"
                  >
                    <q-spinner-dots color="primary" size="2em" />
                  </q-card-section>

                  <q-card-section v-if="item.files">
                    <FilesList borderless :data="item.files" />
                  </q-card-section>
                </q-card>
              </template>
            </q-expansion-item>
          </q-card-section>

          <q-card-section>
            <q-list v-if="item.allField.length">
              <q-item v-for="(record, _index) in item.allField" :key="_index" clickable>
                <q-item-section>
                  <q-item-label caption> {{ record.name }} </q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-item-label> {{ record.value }} </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </template>
    </q-expansion-item>
  </q-list>

  <span v-if="!props.items?.length && !props.loading" class="text-grey">
    Нет документов в этом разделе
  </span>
</template>

<script setup lang="ts">
import {
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QExpansionItem,
  QCard,
  QCardSection,
  QIcon,
  QBtn,
  QTooltip,
  QSpinnerDots,
} from 'quasar';
import { ref } from 'vue';
import FilesList from '../../components/FilesList.vue';
import type { IDocument, IGroup, IDoc } from './types';

const props = defineProps<{
  items: null | IDocument[];
  parent?: IGroup;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'goPlace', doc: IDoc): void;
  (e: 'loadFiles', doc: IDoc): void;
}>();

const expansionChildsRef = ref<QExpansionItem[]>([]);
</script>

<style>
.expansion-tools {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: nowrap;
}
.expansion-tools button {
  min-width: 50px;
  flex: auto;
}
.expansion-tools button .q-btn__content {
  flex-wrap: nowrap;
}
.expansion-tools button .q-btn__content > span {
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
