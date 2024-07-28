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
  QSpinner
} from 'quasar';
import ThisDialog from "../../components/ThisDialog.vue";
import {RequestsXSDType, XFCreateSchema, XFItem, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

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
  //updateDocument,
  removeDocument,
  getHTMLForm,
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
//const activeDocument = ref();

const showCreateDialog = ref(false);
const createSchemaData = ref<XFCreateSchema>({name: '', file: undefined})

const showFormDialog = ref(false);
const formData = ref<string | undefined>()

const isSupport = ref();


const onShowFormDialog = async (id: object) => {
  spinner.on()
  const htmlForm = await getHTMLForm(id);
  if (htmlForm != undefined) {
    const blob = new Blob([htmlForm], {type: "text/html; charset=utf-8"});
    formData.value = URL.createObjectURL(blob);
    showFormDialog.value = true;
  }
  spinner.off()
}

const onValidateXmlDocument = async (docId: object) => {
  const result = await validateXMLDocument(docId)
  if (!result) {
    console.log("success")
  } else {
    console.log("errors")
  }
}

const onShowXML = async (recId: object) => {
  emit('openFileDialog', {factAlias: "XmlDocument_ID", recId})
}

const onShowXSD = async (recId: object) => {
  emit('openFileDialog',{factAlias: "XsdSchema_ID", recId})
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

onMounted(async () => {
  isSupport.value = await checkSupporting();
  if (isSupport.value) {
    void onUpdateSchemaList()
  }
})

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
        Настройка XSD-HTML-XML форм
      </q-toolbar-title>
      <q-btn :disable="!activeScheme" round dense icon="add">
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
                         @click="$event.stopPropagation();onShowFormDialog(schema.XsdSchema_ID.value)">
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
                  <q-btn class="gt-xs" size="12px" flat dense round icon="check"
                         @click="$event.stopPropagation(); onValidateXmlDocument(document.XmlDocument_ID.value)">
                    <q-tooltip>Проверить документ на соответствие схеме</q-tooltip>
                  </q-btn>
                  <q-btn class="gt-xs" size="12px" flat dense round icon="preview"
                         @click="$event.stopPropagation(); onShowFormDialog(document.XmlDocument_ID.value)">
                    <q-tooltip>Заполнить HTML форму</q-tooltip>
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
          Выберите схему слева, для отображения документов
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

  <ThisDialog
      title="Форма для заполнения данных"
      :show="showFormDialog"
      @cancel="showFormDialog = false"
      @yes="showFormDialog = false"
  >
    <iframe :src="formData" class="my-iframe"/>
  </ThisDialog>

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
  width: 700px !important
  height: 500px !important

</style>
