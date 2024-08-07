<script setup lang="ts">
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import {onMounted, ref} from "vue";
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
  QDialog
} from 'quasar';
import ThisDialog from "../../components/ThisDialog.vue";
import {ClickedEl, RequestsXSDType, XFCreate, XFItem, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

const emit = defineEmits<{
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
  (e: 'openFileDialog', val: object): void
}>()

const props = defineProps<{ requests: RequestsXSDType }>()

const {
  getSchemes,
  // getSchema,
  updateSchema,
  removeSchema,
  getDocuments,
  // getDocument,
  updateDocument,
  removeDocument,
  getHTMLForm,
  validateXML,
  validateXMLDocument,
  checkSupporting
} = props.requests

const splitterHorizontal = ref(50);
const spinnerModel = ref(false);
const spinner = {
  on: () => {
    spinnerModel.value = true;
  },
  off: () => {
    spinnerModel.value = false;
  }
}


const schemesList = ref<XFItemScheme[] | undefined>([]);
const documentsList = ref<XFItemDocument[] | undefined>([])

const activeScheme = ref<XFItem | null>(null);
const clickedElement = ref<ClickedEl | undefined>({schId: undefined, docId: undefined});
//const activeDocument = ref();

const showCreateDialog = ref(false);
const createSchemaData = ref<XFCreate>({name: '', file: undefined})

const showFormDialog = ref(false);
const formData = ref<string | undefined>()

const isSupport = ref();


const setDefault = () => {
  schemesList.value = []
  documentsList.value = []
  activeScheme.value = null
  clickedElement.value = undefined
  isSupport.value = false
}

const onShowFormDialog = async (schId?: object, docId?: object) => {
  spinner.on()
  if (schId) {
    clickedElement.value = {schId, docId};
    const htmlForm = await getHTMLForm(schId, docId);
    if (htmlForm != undefined) {
      const blob = new Blob([htmlForm], {type: "text/html; charset=utf-8"});
      formData.value = URL.createObjectURL(blob);
      showFormDialog.value = true;
      window.addEventListener('message', iframeResponse.bind, {once: true})
    }
  }
  spinner.off()
}

const iframeResponse = async (e: MessageEvent) => {
  if (e?.data) {
    const file = new File([e.data], "result.xml", {
      type: "text/xml",
    })
    if (clickedElement.value?.schId) {

      //todo нужно сказать юзеру что сохраняешь невалидный но нужно ткнуть что невалидно, а с этим проблемы
      const isValid = await validateXML(clickedElement.value.schId, file);
      console.log('isValid', isValid);

      await updateDocument(clickedElement.value.schId, clickedElement.value.docId, {file, name: 'testtext'})
      await onUpdateDocumentList();
    }
    showFormDialog.value = false;
  }
};

const onValidateAll = async () => {
  async function setValid(doc: XFItemDocument) {
    const res = await validateXMLDocument(doc.XmlDocument_ID.value, doc.XsdSchema_ID.value);
    if (res) {
      doc.isValid = res.status === 200
    }
  }

  try {
    if (documentsList.value?.length) {
      for (const doc of documentsList.value) {
        doc.isValid = null
        void setValid(doc)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

const onValidateXmlDocument = async (doc: XFItemDocument, sch: XFItem) => {
  doc.isValid = null;
  const result = await validateXMLDocument(doc.XmlDocument_ID.value, sch.value)
  if (result) {
    doc.isValid = result.status === 200
  }
}

const onShowXML = async (recId: object) => {
  emit('openFileDialog', {factAlias: "XmlDocument_ID", recId})
}

const onShowXSD = async (recId: object) => {
  emit('openFileDialog', {factAlias: "XsdSchema_ID", recId})
}

const selectSchema = async (schema: XFItem) => {
  if (activeScheme?.value?.value === schema.value) {
    activeScheme.value = null;
    documentsList.value = [];
  } else {
    spinner.on()
    activeScheme.value = schema;
    documentsList.value = await getDocuments(activeScheme.value.value);
    spinner.off()
  }
}

async function updateSchemaHere(schId?: object) {
  await updateSchema(schId, createSchemaData.value);
  void onUpdateSchemaList();
}

const onRemoveDocument = async (docId: object) => {
  spinner.on()
  await removeDocument(docId);
  await onUpdateDocumentList();
  spinner.off()
}
const onRemoveSchema = async (schId: object) => {
  spinner.on()
  await removeSchema(schId)
  await onUpdateSchemaList();
  spinner.off()
}
const onUpdateDocumentList = async () => {

  if (activeScheme.value) {
    documentsList.value = await getDocuments(activeScheme.value.value);
  }
}
const onUpdateSchemaList = async () => {
  schemesList.value = await getSchemes();
}


const initial = async () => {
  setDefault();

  isSupport.value = await checkSupporting();
  if (isSupport.value) {
    void onUpdateSchemaList();
  }
}

// При смене банка дергаем initial, дропаем его наружу
defineExpose({initial})

onMounted(initial)

</script>

<template>
  <main-wrapper
      :full-screen-mode="false"
      :stepper-mode="false"
      @module-start-view="emit('moduleStartView')"
      @module-end-view="emit('moduleEndView')"
  >
    <q-toolbar class="text-primary">
      <q-btn round dense icon="add" @click="showCreateDialog = true">
        <q-tooltip>
          Добавить XSD форму
        </q-tooltip>
      </q-btn>
      <q-toolbar-title>
        Администрирование XSD-HTML-XML форм
      </q-toolbar-title>
      <q-btn :disable="!activeScheme || !documentsList?.length" @click="onValidateAll" round dense icon="done_all">
        <q-tooltip>
          Валидировать все документы
        </q-tooltip>
      </q-btn>
      <q-btn :disable="!activeScheme" @click="onShowFormDialog(activeScheme?.value,undefined)" round dense icon="add">
        <q-tooltip>
          Добавить XML документ
        </q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-separator/>

    <q-splitter
        style="height: calc(100% - 51px)"
        after-class=""
        v-model="splitterHorizontal"
        :limits="[30,70]"
    >
      <template v-slot:before>
        <q-list
            v-if="schemesList?.length"
            padding class="rounded-borders text-primary">
          <div
              v-for="schema of schemesList"
              :key="schema.XsdSchema_ID.name"
          >
            <q-item
                clickable
                v-ripple
                :active="activeScheme === schema.XsdSchema_ID"
                @click="selectSchema(schema.XsdSchema_ID)"
                active-class="my-menu-link"
            >
              <q-item-section>
                <q-item-label :style="activeScheme === schema.XsdSchema_ID?'color:white':''">XSD cхема :
                  {{ schema.Name.value ? schema.Name.value : '' }}
                </q-item-label>
                <q-item-label caption :style="activeScheme === schema.XsdSchema_ID?'color:white':''">
                  {{ schema.Desc.name }} : {{ schema.Name.value }}
                </q-item-label>
                <q-item-label caption :style="activeScheme === schema.XsdSchema_ID?'color:white':''">
                  {{ schema.XsdSchema_ID.name }} : {{ schema.XsdSchema_ID.value }}
                </q-item-label>
              </q-item-section>

              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn :style="activeScheme === schema.XsdSchema_ID?'color:white':''"
                         class="gt-xs" size="12px" flat dense round icon="preview"
                         @click="$event.stopPropagation();onShowFormDialog(schema.XsdSchema_ID.value, undefined)">
                    <q-tooltip>Показать форму для заполнения</q-tooltip>
                  </q-btn>
                  <q-btn :style="activeScheme === schema.XsdSchema_ID?'color:white':''"
                         class="gt-xs" size="12px" flat dense round icon="visibility"
                         @click="$event.stopPropagation(); onShowXSD(schema.XsdSchema_ID.value)">
                    <q-tooltip>Показать XSD схему</q-tooltip>
                  </q-btn>
                  <q-btn :style="activeScheme === schema.XsdSchema_ID?'color:white':''"
                         class="gt-xs" size="12px" flat dense round icon="delete"
                         @click="$event.stopPropagation(); onRemoveSchema(schema.XsdSchema_ID.value)">
                    <q-tooltip>Удалить XSD схему</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator/>
          </div>

        </q-list>
        <div class="text-subtitle1 text-primary center" v-else>
          {{
            isSupport ? 'В этом банке еще не добавлены схемы XSD' :
                'Для данной метамодели/банка XML схема не поддерживается'
          }}
        </div>
      </template>

      <template v-slot:after>
        <q-list
            v-if="documentsList?.length"
            padding class="rounded-borders text-primary">
          <div
              v-for="document of documentsList"
              :key="document.XsdSchema_ID.name"
          >
            <q-item
                clickable
                v-ripple
            >
              <q-item-section>
                <q-item-label>XML документ : {{ document.Name.value ? document.Name.value : '' }}</q-item-label>
                <q-item-label caption> {{ document.Desc.name }} : {{ document.Name.value }}</q-item-label>
                <q-item-label caption> {{ document.XmlDocument_ID.name }} : {{ document.XmlDocument_ID.value }}
                </q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <!--                  <q-btn class="gt-xs" size="12px" flat dense round icon="lock" @click="$event.stopPropagation()">-->
                  <!--                    <q-tooltip>Подписать документ ЭЦП</q-tooltip>-->
                  <!--                  </q-btn>-->
                  <q-btn :loading='document.isValid === null'
                         class="gt-xs" size="12px" flat dense round
                         :icon="document.isValid === undefined ? 'check':'check_circle'"
                         :text-color="document.isValid === true ? 'green':(document.isValid === false? 'red':'')"
                         @click="$event.stopPropagation(); onValidateXmlDocument(document, document.XsdSchema_ID)">
                    <q-tooltip>Проверить документ на соответствие схеме</q-tooltip>
                    <template v-slot:loading>
                      <q-spinner color="primary" size="1em"/>
                    </template>
                  </q-btn>
                  <q-btn class="gt-xs" size="12px" flat dense round icon="preview"
                         @click="$event.stopPropagation(); onShowFormDialog(document.XsdSchema_ID.value, document.XmlDocument_ID.value)">
                    <q-tooltip>Продолжить заполнение формы</q-tooltip>
                  </q-btn>
                  <q-btn class="gt-xs" size="12px" flat dense round icon="visibility" @click="
                  $event.stopPropagation(); onShowXML(document.XmlDocument_ID.value)">
                    <q-tooltip>Показать XML документ</q-tooltip>
                  </q-btn>
                  <q-btn class="gt-xs" size="12px" flat dense round icon="delete"
                         @click="$event.stopPropagation(); onRemoveDocument(document.XmlDocument_ID.value)">
                    <q-tooltip>Удалить XML документ</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator/>
          </div>
        </q-list>
        <div class="text-subtitle1 text-primary center" v-else>
          {{
            activeScheme?.value ?
                "К данной схеме еще нет заполненных документов. Нажмите + что бы добавить документ" :
                "Выберите схему слева, для отображения документов по ней"
          }}
        </div>
      </template>
    </q-splitter>

  </main-wrapper>

  <ThisDialog
      title="Заполните данные для создания схемы"
      :show="showCreateDialog"
      @cancel="showCreateDialog = false"
      @yes="showCreateDialog = false; updateSchemaHere()"
  >
    <q-input v-model:model-value="createSchemaData.name" label="Наименование" autofocus/>
    <q-file v-model:model-value="createSchemaData.file" multiple label="Файл XSD схемы" accept=".xsd"/>
  </ThisDialog>

  <q-dialog
      title="Форма для заполнения данных"
      v-model:model-value="showFormDialog"
      @cancel="showFormDialog = false"
      @yes="showFormDialog = false"
      full-height
      full-width
  >
    <div class="my-iframe">
      <iframe :src="formData" style="width: 100%; height: 100%"/>
    </div>

  </q-dialog>

  <q-inner-loading :showing="spinnerModel">
    <q-spinner
        color="primary"
        size="5em"
    />
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

</style>
