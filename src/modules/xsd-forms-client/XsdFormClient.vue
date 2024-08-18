<script setup lang="ts">
import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import { onMounted, ref, computed } from 'vue';
import {
  QSplitter,
  QToolbar,
  QTooltip,
  QToolbarTitle,
  QList,
  QItem,
  QItemLabel,
  QItemSection,
  QSeparator,
  QBtn,
  QFile,
  QInput,
  QInnerLoading,
  QSpinner,
} from 'quasar';
import ThisDialog from '../../components/ThisDialog.vue';
import {
  ClickedEl,
  RequestsXSDType,
  XFCreate,
  XFItem,
  XFItemDocument,
  XFItemScheme,
} from './XsdFormClientTypes.ts';

const emit = defineEmits<{
  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;
  (e: 'openFileDialog', val: object): void;
}>();

const props = defineProps<{ requests: RequestsXSDType }>();

const {
  getSchemes,
  // getSchema,
  updateSchema,
  // removeSchema,
  getDocuments,
  // getDocument,
  updateDocument,
  removeDocument,
  getHTMLForm,
  validateXML,
  validateXMLDocument,
  checkSupporting,
} = props.requests;

const searchQuery = ref('');
const docName = ref('');

const filteredSchemesList = computed(() => {
  if (!activeScheme.value) {
    if (!searchQuery.value) {
      return schemesList.value;
    }
    const query = searchQuery.value.toLowerCase();
    if (!schemesList.value) {
      return [];
    }
    return schemesList.value.filter((schema: XFItemScheme) =>
      schema.Name.value.toLowerCase().includes(query),
    );
  } else {
    return schemesList.value;
  }
});
const filteredDocumentsList = computed(() => {
  if (activeScheme.value) {
    if (!searchQuery.value) {
      return documentsList.value;
    }
    const query = searchQuery.value.toLowerCase();
    if (!documentsList.value) {
      return [];
    }
    return documentsList.value.filter((document: XFItemDocument) =>
      document.Name.value.toLowerCase().includes(query),
    );
  } else {
    return documentsList.value;
  }
});

const splitterHorizontal = ref(15);
const toolbarTitle = ref('Редактирование XML форм');
// const showCloseButton = ref(true);
const showForm = ref(false);
const spinnerModel = ref(false);
const spinner = {
  on: () => {
    spinnerModel.value = true;
  },
  off: () => {
    spinnerModel.value = false;
  },
};

const schemesList = ref<XFItemScheme[] | undefined>([]);
const documentsList = ref<XFItemDocument[] | undefined>([]);

const activeScheme = ref<XFItem | null>(null);
const clickedElement = ref<ClickedEl | undefined>({ schId: undefined, docId: undefined });
//const activeDocument = ref();

const showCreateDialog = ref(false);
const createSchemaData = ref<XFCreate>({ name: '', file: undefined });

// const showFormDialog = ref(false);
const formData = ref<string | undefined>();

const showNameDialog = ref(false);

const isSupport = ref();

const setDefault = () => {
  schemesList.value = [];
  documentsList.value = [];
  activeScheme.value = null;
  clickedElement.value = undefined;
  isSupport.value = false;
};

const updateToolbarTitle = (param: number) => {
  if (param == 1) {
    toolbarTitle.value = 'Добавление XML документа';
  } else if (param == 2) {
    toolbarTitle.value = 'Заполнение формы';
  } else if (param == 3) {
    toolbarTitle.value = 'Редактирование XML форм';
  }
};

const onShowFormDialog = async (schId?: object, docId?: object) => {
  spinner.on();
  if (schId) {
    clickedElement.value = { schId, docId };
    const htmlForm = await getHTMLForm(schId, docId);
    if (htmlForm != undefined) {
      const blob = new Blob([htmlForm], { type: 'text/html; charset=utf-8' });
      formData.value = URL.createObjectURL(blob);
      // showFormDialog.value = true;
      showForm.value = true;
      window.addEventListener('message', iframeResponse.bind, { once: true });
    }
  }
  spinner.off();
};

const iframeResponse = async (e: MessageEvent) => {
  if (e?.data) {
    const file = new File([e.data], 'result.xml', {
      type: 'text/xml',
    });
    if (clickedElement.value?.schId) {
      //todo нужно сказать юзеру что сохраняешь невалидный но нужно ткнуть что невалидно, а с этим проблемы
      const isValid = await validateXML(clickedElement.value.schId, file);
      console.log('isValid', isValid);

      await updateDocument(clickedElement.value.schId, clickedElement.value.docId, {
        file,
        name: docName.value,
      });
      await onUpdateDocumentList();
    }
    showForm.value = false;
    docName.value = '';
  }
};

const onValidateAll = async () => {
  async function setValid(doc: XFItemDocument) {
    const res = await validateXMLDocument(doc.XmlDocument_ID.value, doc.XsdSchema_ID.value);
    if (res) {
      doc.isValid = res.status === 200;
    }
  }

  try {
    if (filteredDocumentsList.value?.length) {
      for (const doc of filteredDocumentsList.value) {
        doc.isValid = null;
        void setValid(doc);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const onValidateXmlDocument = async (doc: XFItemDocument, sch: XFItem) => {
  doc.isValid = null;
  const result = await validateXMLDocument(doc.XmlDocument_ID.value, sch.value);
  if (result) {
    doc.isValid = result.status === 200;
  }
};

const onShowXML = async (recId: object) => {
  emit('openFileDialog', { factAlias: 'XmlDocument_ID', recId });
};

// const onShowXSD = async (recId: object) => {
//   emit('openFileDialog', { factAlias: 'XsdSchema_ID', recId });
// };

const selectSchema = async (schema: XFItem) => {
  searchQuery.value = '';
  if (activeScheme?.value?.value === schema.value) {
    activeScheme.value = null;
    documentsList.value = [];
  } else {
    spinner.on();
    activeScheme.value = schema;
    documentsList.value = await getDocuments(activeScheme.value.value);
    spinner.off();
  }
};

async function updateSchemaHere(schId?: object) {
  await updateSchema(schId, createSchemaData.value);
  void onUpdateSchemaList();
}

const onRemoveDocument = async (docId: object) => {
  spinner.on();
  await removeDocument(docId);
  await onUpdateDocumentList();
  spinner.off();
};
// const onRemoveSchema = async (schId: object) => {
//   spinner.on();
//   await removeSchema(schId);
//   await onUpdateSchemaList();
//   spinner.off();
// };
const onUpdateDocumentList = async () => {
  if (activeScheme.value) {
    documentsList.value = await getDocuments(activeScheme.value.value);
  }
};
const onUpdateSchemaList = async () => {
  schemesList.value = await getSchemes();
};

const initEventListener = () => {
  const iframe = document.querySelector('iframe') as HTMLIFrameElement;
  if (iframe) {
    const messageListener = (event: MessageEvent) => {
      if (event?.data) {
        showForm.value = false;
        updateToolbarTitle(3);
        window.removeEventListener('message', messageListener);
      }
    };
    window.addEventListener('message', messageListener);
  }
};

const openForm = () => {
    onShowFormDialog(activeScheme?.value?.value);
    updateToolbarTitle(1)
    showNameDialog.value = false
};

// const simulateExit = () => {
//   const iframe = document.querySelector('iframe') as HTMLIFrameElement;
//   if (iframe) {
//     iframe.contentWindow?.parent.postMessage('exit', '*');
//   }
// };

// const iframeResponse = async (e: MessageEvent) => {
//   if (e?.data) {
//     const file = new File([e.data], 'result.xml', {
//       type: 'text/xml',
//     });

//     if (clickedScheme.value) {
//       const isValid = await validateXML(clickedScheme.value, file);
//       console.log(isValid);

//       await updateDocument(clickedScheme.value, undefined, { file, name: 'testtext' });
//       await onUpdateDocumentList();
//     }
//     showFormDialog.value = false;
//   }
// };

const initial = async () => {
  setDefault();

  isSupport.value = await checkSupporting();
  if (isSupport.value) {
    void onUpdateSchemaList();
  }
};

defineExpose({ initial });

onMounted(initial);

// onUnmounted(() => {
//   window.removeEventListener('message', iframeResponse);
// });
</script>

<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="emit('moduleStartView')"
    @module-end-view="emit('moduleEndView')"
    style="background-color: white;"
  >
    <q-toolbar class="text-primary">
      <!-- <q-btn round dense icon="add" @click="showCreateDialog = true">
        <q-tooltip> Добавить XSD форму </q-tooltip>
      </q-btn> -->
      <q-toolbar-title>{{ toolbarTitle }}</q-toolbar-title>
      <q-input
        v-model="searchQuery"
        label="Поиск"
        dense
        outlined
        style="padding-right: 10px"
        :disable="showForm"
        >
          <template v-slot:append>
            <q-icon v-if="searchQuery === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchQuery = ''" />
          </template
      ></q-input>
      <q-btn
        :disable="!activeScheme || !filteredDocumentsList?.length || showForm"
        @click="onValidateAll"
        round
        dense
        icon="done_all"
        style="margin-right: 10px;"
      >
        <q-tooltip v-if="!showForm"> Валидировать все документы </q-tooltip>
      </q-btn>
      <q-btn
        :disable="!activeScheme"
        @click="!showForm ? (showNameDialog = true) : ((showForm = false), updateToolbarTitle(3)), docName = ''"
        round
        dense
        :icon="!showForm ? 'add' : 'close'"
      >
        <q-tooltip> {{ !showForm ? 'Добавить XML документ' : 'Закрыть' }} </q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-separator />

    <q-splitter
      style="height: calc(100% - 51px)"
      after-class=""
      v-model="splitterHorizontal"
      :limits="[15, 85]"
    >
      <template v-slot:before>
        <q-list v-if="filteredSchemesList?.length" padding class="rounded-borders text-primary">
          <div v-for="schema of filteredSchemesList" :key="schema.XsdSchema_ID.name">
            <q-item
              :disable="showForm"
              clickable
              v-ripple
              :active="activeScheme === schema.XsdSchema_ID"
              @click="selectSchema(schema.XsdSchema_ID)"
              active-class="my-menu-link"
            >
              <q-item-section>
                <q-item-label :style="activeScheme === schema.XsdSchema_ID ? 'color:white' : ''">
                  {{ schema.Name.value ? schema.Name.value : '' }}
                </q-item-label>
                <q-item-label
                  caption
                  :style="activeScheme === schema.XsdSchema_ID ? 'color:white' : ''"
                >
                  {{ schema.Desc.name }} : {{ schema.Name.value }}
                </q-item-label>
                <!-- <q-item-label
                  caption
                  :style="activeScheme === schema.XsdSchema_ID ? 'color:white' : ''"
                >
                  {{ schema.XsdSchema_ID.name }} : {{ schema.XsdSchema_ID.value }}
                </q-item-label> -->
              </q-item-section>

              <!-- <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    :style="activeScheme === schema.XsdSchema_ID ? 'color:white' : ''"
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="preview"
                    @click="
                      $event.stopPropagation();
                      onShowFormDialog(schema.XsdSchema_ID.value);
                    "
                  >
                    <q-tooltip>Показать форму для заполнения</q-tooltip>
                  </q-btn>
                  <q-btn
                    :style="activeScheme === schema.XsdSchema_ID ? 'color:white' : ''"
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="visibility"
                    @click="
                      $event.stopPropagation();
                      onShowXSD(schema.XsdSchema_ID.value);
                    "
                  >
                    <q-tooltip>Показать XSD схему</q-tooltip>
                  </q-btn>
                  <q-btn
                    :style="activeScheme === schema.XsdSchema_ID ? 'color:white' : ''"
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="
                      $event.stopPropagation();
                      onRemoveSchema(schema.XsdSchema_ID.value);
                    "
                  >
                    <q-tooltip>Удалить XSD схему</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section> -->
            </q-item>
            <q-separator />
          </div>
        </q-list>
        <div class="text-subtitle1 text-primary center" v-else>
          {{
            isSupport
              ? 'В этом банке еще не добавлены схемы XSD'
              : 'Для данной метамодели/банка XML схема не поддерживается'
          }}
        </div>
      </template>

      <template v-slot:after>
        <!-- <q-splitter :limits="[0, 100]" v-model="splitterVertical" horizontal>
          <template v-slot:before> -->
        <div v-if="!showForm">
          <q-list v-if="filteredDocumentsList?.length" padding class="rounded-borders text-primary">
            <div v-for="document of filteredDocumentsList" :key="document.XsdSchema_ID.name">
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label> {{ document.Name.value ? document.Name.value : '' }}</q-item-label>
                  <q-item-label caption>
                    {{ document.Desc.name }} : {{ document.Name.value }}</q-item-label
                  >
                  <!-- <q-item-label caption>
                      {{ document.XmlDocument_ID.name }} : {{ document.XmlDocument_ID.value }}
                    </q-item-label> -->
                </q-item-section>
                <q-item-section top side>
                  <div class="text-grey-8 q-gutter-xs">
                    <!--                  <q-btn class="gt-xs" size="12px" flat dense round icon="lock" @click="$event.stopPropagation()">-->
                    <!--                    <q-tooltip>Подписать документ ЭЦП</q-tooltip>-->
                    <!--                  </q-btn>-->
                    <q-btn
                      :loading="document.isValid === null"
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      :icon="document.isValid === undefined ? 'check' : 'check_circle'"
                      :text-color="
                        document.isValid === true
                          ? 'green'
                          : document.isValid === false
                          ? 'red'
                          : ''
                      "
                      @click="
                        $event.stopPropagation();
                        onValidateXmlDocument(document, document.XsdSchema_ID);
                      "
                    >
                      <q-tooltip>Проверить документ на соответствие схеме</q-tooltip>
                      <template v-slot:loading>
                        <q-spinner color="primary" size="1em" />
                      </template>
                    </q-btn>
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      disable
                      icon="preview"
                      @click="
                        $event.stopPropagation();
                        onShowFormDialog(document.XsdSchema_ID.value);
                        updateToolbarTitle(2);
                      "
                    >
                      <q-tooltip>Продолжить заполнение формы</q-tooltip>
                    </q-btn>
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="visibility"
                      @click="
                        $event.stopPropagation();
                        onShowXML(document.XmlDocument_ID.value);
                      "
                    >
                      <q-tooltip>Показать XML документ</q-tooltip>
                    </q-btn>
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="
                        $event.stopPropagation();
                        onRemoveDocument(document.XmlDocument_ID.value);
                      "
                    >
                      <q-tooltip>Удалить XML документ</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />
            </div>
          </q-list>
          <div class="text-subtitle1 text-primary center" v-else>
            {{
              activeScheme?.value
                ? 'К данной схеме еще нет заполненных документов. Нажмите + что бы добавить документ'
                : 'Выберите схему слева, для отображения документов по ней'
            }}
          </div>
        </div>
        <!-- </template> -->
        <!-- <template v-slot:separator> -->
        <!-- <q-separator
              v-if="splitterVertical < 100"
              style="cursor: pointer"
            > -->
        <!-- </q-separator> -->
        <!-- </template> -->
        <!-- <template v-slot:after> -->
        <div class="my-iframe-container" v-if="showForm">
          <!-- <q-btn v-if="showCloseButton && showForm" icon="bug_report" @click="simulateExit" /> -->
          <!-- <q-btn
            v-if="showCloseButton && showForm"
            round
            size="xl"
            icon="close"
            @click="(showForm = false), updateToolbarTitle(3), docName = ''"
            class="close-button"
          >
            <q-tooltip>Закрыть</q-tooltip></q-btn -->
        
          <div class="my-iframe">
            <iframe :src="formData" @load="initEventListener" style="width: 100%; height: 100%" />
          </div>
        </div>
        <!-- </template> -->
        <!-- </q-splitter> -->
      </template>
    </q-splitter>
  </main-wrapper>

  <ThisDialog
    title="Заполните данные для создания схемы"
    :show="showCreateDialog"
    @cancel="showCreateDialog = false"
    @yes="
      showCreateDialog = false;
      updateSchemaHere();
    "
  >
    <q-input v-model:model-value="createSchemaData.name" label="Наименование" autofocus />
    <q-file
      v-model:model-value="createSchemaData.file"
      multiple
      label="Файл XSD схемы"
      accept=".xsd"
    />
  </ThisDialog>
  <ThisDialog
    v-model:model-value="showNameDialog"
    title="Имя документа"
    @cancel="showNameDialog = false, docName = ''"
    @yes="openForm"
    yes-btn-label="Создать"
  >
    <q-input v-model="docName" label="Введите имя файла"> </q-input>
  </ThisDialog>
  <!-- <q-dialog
    title="Форма для заполнения данных"
    v-model:model-value="showFormDialog"
    @cancel="showFormDialog = false"
    @yes="showFormDialog = false"
    full-height
    full-width
  >
    <div class="my-iframe">
      <iframe :src="formData" style="width: 100%; height: 100%" />
    </div>
  </q-dialog> -->

  <q-inner-loading :showing="spinnerModel">
    <q-spinner color="primary" size="5em" />
  </q-inner-loading>
</template>

<style lang="sass">

.my-menu-link
  color: white
  background: var(--q-primary)

.center
  display: flex
  align-items: center
  justify-content: center
  height: 100%

.my-iframe
  width: 100%
  height: 100%
  background: white
  overflow: hidden !important

.q-splitter__panel .q-splitter__after
  overflow-y: auto

.q-splitter__panel .q-splitter__before
  overflow-y: auto

.my-iframe-container
  position: relative
  width: 100%
  height: 100%


.close-button
  color: var(--q-primary)
  background-color: white
  position: absolute
  bottom: 10px
  right: 10px
  z-index: 1
  opacity: 0.33

  &:hover
    opacity: 1
    color: white
    background-color: var(--q-primary)
</style>
