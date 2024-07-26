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
  QInput
} from 'quasar';
import ThisDialog from "../../components/ThisDialog.vue";
import {RequestsXSDType, XFCreateSchema, XFItem, XFItemDocument, XFItemScheme} from "./XsdFormAdminTypes.ts";

const emit = defineEmits<{
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
}>()

const props = defineProps<{ requests: RequestsXSDType }>()

const {
  getSchemes,
  getSchema,
  updateSchema,
  removeSchema,
  getDocuments,
  getDocument,
  //updateDocument,
  removeDocument,
  getHTMLForm,
  validateXMLDocument,
  checkSupporting
} = props.requests

const splitterHorizontal = ref(50);

const schemesList = ref<XFItemScheme[] | undefined>([]);
const documentsList = ref<XFItemDocument[] | undefined>([])

const activeScheme = ref<XFItem | null>(null);
//const activeDocument = ref();

const showCreateDialog = ref(false);
const createSchemaData = ref<XFCreateSchema>({name: '', file: undefined})

const showFormDialog = ref(false);
const formData = ref<string | undefined>()

const showXsdXmlDialog = ref(false);
const xsdxmlData = ref<string | undefined>()

const isSupport = ref();


const onShowFormDialog = async (id: object) => {
  formData.value = await getHTMLForm(id);
  showFormDialog.value = true;
}

const onValidateXmlDocument = async (docId: object) => {
  const result = await validateXMLDocument(docId)
  if (!result) {
    console.log("success")
  } else {
    console.log("errors")
  }
}

const onShowXML = async (docId: object) => {
  const doc = await getDocument(docId);
  xsdxmlData.value = JSON.stringify(doc);
  showXsdXmlDialog.value = true;
}

const onShowXSD = async (schId: object) => {
  const sch = await getSchema(schId);
  xsdxmlData.value = JSON.stringify(sch);
  showXsdXmlDialog.value = true;
}

const selectSchema = async (schema: XFItem) => {
  if (activeScheme?.value?.value === schema.value) {
    activeScheme.value = null;
    documentsList.value = [];
  } else {
    activeScheme.value = schema;
    documentsList.value = await getDocuments(activeScheme.value.value);
  }
}

async function updateSchemaHere() {
  await updateSchema(createSchemaData.value);
  void onUpdateSchemaList();
}

const onRemoveDocument = async (docId: object) => {
  await removeDocument(docId);
  await onUpdateDocumentList();
}
const onRemoveSchema = async (schId: object) => {
  await removeSchema(schId)
  await onUpdateSchemaList();
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
        class="full-height"
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
                  <q-btn class="gt-xs" size="12px" flat dense round icon="lock" @click="$event.stopPropagation()">
                    <q-tooltip>Подписать документ ЭЦП</q-tooltip>
                  </q-btn>
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
    <q-input :model-value="createSchemaData.name" label="Наименование" autofocus/>
    <q-file :model-value="createSchemaData.file" label="Файл XSD схемы" accept=".xsd"/>
  </ThisDialog>

  <ThisDialog
      title="Форма для заполнения данных"
      :show="showFormDialog"
      @cancel="showFormDialog = false"
      @yes="showFormDialog = false"
  >
    <div class="full-height full-width" v-html="formData"/>
  </ThisDialog>

  <ThisDialog
      title="XSD/XML"
      :show="showXsdXmlDialog"
      @cancel="showXsdXmlDialog = false"
      @yes="showXsdXmlDialog = false"
  >
    <div class="full-height full-width" v-html="xsdxmlData"/>
  </ThisDialog>


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


</style>
