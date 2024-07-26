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
        v-model="splitterHorizontal"
        class="full-height"
        :limits="[30,70]"
    >
      <template v-slot:before>
        <q-list
            v-if="schemesList?.length"
            padding class="rounded-borders text-primary">
          <div
              v-for="schema of schemesList"
              :key="schema"
          >
            <q-item
                clickable
                v-ripple
                :active="activeScheme === schema.XsdSchema_ID"
                @click="selectSchema(schema)"
                active-class="my-menu-link"
            >
              <q-item-section>
                <q-item-label>XSD cхема : {{ schema.Name.value ? schema.Name.value : '' }}</q-item-label>
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
                         @click="$event.stopPropagation();onShowFormDialog()">
                    <q-tooltip>Показать форму для заполнения</q-tooltip>
                  </q-btn>
                  <q-btn :style="activeScheme === schema.XsdSchema_ID?'color:white':''"
                         class="gt-xs" size="12px" flat dense round icon="visibility"
                         @click="$event.stopPropagation(); onShowXSD(schema.XsdSchema_ID.value)">
                    <q-tooltip>Показать XSD схему</q-tooltip>
                  </q-btn>
                  <q-btn :style="activeScheme === schema.XsdSchema_ID?'color:white':''"
                         class="gt-xs" size="12px" flat dense round icon="delete"
                         @click="$event.stopPropagation(); removeSchema(schema.XsdSchema_ID.value)">
                    <q-tooltip>Удалить XSD схему</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator/>
          </div>

        </q-list>
        <div style="text-align: center" class="text-subtitle1 text-primary" v-else>
          {{
            isSupport ? 'В данном банке еще не добавлены схемы XSD' :
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
              :key="document"
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
                         @click="$event.stopPropagation();removeDocument(document.XmlDocument_ID.value)">
                    <q-tooltip>Удалить XML документ</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator/>
          </div>
        </q-list>
        <div style="text-align: center" class="text-subtitle1 text-primary" v-else>
          Выберите схему для добавления документа
        </div>
      </template>
    </q-splitter>

  </main-wrapper>

  <ThisDialog
      title="Заполните данные для создания схемы"
      :show="showCreateDialog"
      @cancel="showCreateDialog = false"
      @yes="showCreateDialog = false; updateSchemaHere"
  >
    <q-input :model-value="createSchemaData.name" label="Наименование"/>
    <q-file :model-value="createSchemaData.file" label="Файл XSD схемы" accept=".xsd"/>
  </ThisDialog>

  <ThisDialog
      title="Форма для заполнения данных"
      :show="showFormDialog"
      @cancel="showFormDialog = false"
      @yes="showFormDialog = false"
  >
    <div class="full-height full-width" v-html="formData.form"/>
  </ThisDialog>

  <ThisDialog
      title="XSD/XML"
      :show="showXsdXmlDialog"
      @cancel="showXsdXmlDialog = false"
      @yes="showXsdXmlDialog = false"
  >
    <div class="full-height full-width" v-html="xsdxmlData?.data"/>
  </ThisDialog>


</template>

<script setup lang="ts">
import MainWrapper from '../../components/the-basics/MainWrapper.vue'
import {onMounted, ref} from "vue";
import {
  QSplitter,
  QToolbar,
  QToolbarTitle,
  QSeparator,
  QBtn
} from 'quasar';
import ThisDialog from "../../components/ThisDialog.vue";
import type {RequestsType} from "../file-directory/FileDirectoryTypes.ts";

const emit = defineEmits<{
  (e: 'moduleStartView'): void
  (e: 'moduleEndView'): void
}>()

const props = defineProps<{ requests: RequestsType }>()

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

const schemesList = ref([]);
const documentsList = ref([])

const activeScheme = ref(null);
//const activeDocument = ref();

const showCreateDialog = ref(false);
const createSchemaData = ref({name: '', file: null})

const showFormDialog = ref(false);
const formData = ref({form: ''})

const showXsdXmlDialog = ref(false);
const xsdxmlData = ref({data: ''})

const isSupport = ref();


const onShowFormDialog = async (id: number) => {
  formData.value.form = await getHTMLForm(id);
  showFormDialog.value = true;
}

const onValidateXmlDocument = async (docId: number) => {
  const result = await validateXMLDocument(docId)
  if (!result) {
    console.log("success")
  } else {
    console.log("errors")
  }
}

const onShowXML = async (docId: number) => {
  xsdxmlData.value.data = await getDocument(docId)
  showXsdXmlDialog.value = true;
}

const onShowXSD = async (schId: number) => {
  xsdxmlData.value.data = await getSchema(schId)
  showXsdXmlDialog.value = true;
}

const selectSchema = async (schema) => {
  if (activeScheme?.value?.value === schema?.XsdSchema_ID?.value) {
    activeScheme.value = null;
    documentsList.value = [];
  } else {
    activeScheme.value = schema.XsdSchema_ID;
    documentsList.value = await getDocuments(activeScheme.value);
  }
}

async function updateSchemaHere() {
  await updateSchema(createSchemaData.value);
  void updateSchemaList();
}

const updateSchemaList = async () => {
  schemesList.value = await getSchemes();
}


onMounted(async () => {
  isSupport.value = await checkSupporting();
  if (isSupport.value) {
    void updateSchemaList()
  }
})

</script>

<style lang="sass">

.my-menu-link
  color: white
  background: var(--q-primary)

</style>
