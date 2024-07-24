<template>
  <main-wrapper
    :full-screen-mode="false"
    :stepper-mode="false"
    @module-start-view="moduleStartView"
    @module-end-view="emit('moduleEndView')"
  >
    <div class="messages-fields">
      <div class="messages-fields-card">
        <div class="card-tabs">
          <q-tabs
            class="tabs text-grey"
            active-color="primary"
            indicator-color="primary"
            v-model="activeTab"
            narrow-indicator
          >
            <q-tab v-if="!isAgriculturalPoducer" name="chat" label="Сообщения" />
            <!--  <q-tab
              name="status"
              label="Статус данных"
            /> -->
          </q-tabs>

          <q-input
            v-if="!isAgriculturalPoducer"
            v-model="searchText"
            :placeholder="props.searchField ?? 'Поиск автора'"
            filled
            dense
            class="search-input"
          >
            <template v-slot:append>
              <q-icon v-if="searchText === ''" name="search" color="primary" />
              <q-icon
                v-else
                class="cursor-pointer"
                name="clear"
                color="grey"
                @click="searchText = ''"
              />
            </template>

            <template v-slot:after>
              <q-checkbox
                v-model="filterNoResponse"
                checked-icon="comments_disabled"
                unchecked-icon="mark_unread_chat_alt"
                keep-color
              >
                <q-tooltip>
                  {{ filterNoResponse ? 'Все сообщения' : 'Только без ответа' }}
                </q-tooltip>
              </q-checkbox>
            </template>
          </q-input>
          <q-btn icon="cached" flat round color="primary" @click="refresh" class="refresh-button">
            <q-tooltip> Обновить данные </q-tooltip>
          </q-btn>
        </div>

        <q-scroll-area class="tab-panels-scroll" style="height: calc(100% - 108px - 32px)">
          <q-tab-panels v-model="activeTab" animated>
            <q-tab-panel name="chat">
              <q-list v-if="filterUsers.length" class="rounded-borders" bordered>
                <q-card v-for="user in filterUsers" :key="user.factId" class="my-card">
                  <q-expansion-item expand-separator icon="insert_comment">
                    <template v-slot:header>
                      <q-item-section>
                        <q-item-label>
                          {{ user.label ?? 'Без именни' }}
                        </q-item-label>
                        <q-item-label caption>
                          {{ user.caption }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>
                          {{ `Сообщений:  ${filterMessage(user.messages)?.length ?? 0}` }}
                        </q-item-label>
                      </q-item-section>
                    </template>
                    <q-card
                      v-for="message in filterMessage(user.messages)"
                      :key="message.factId"
                      class="no-padding"
                    >
                      <q-separator />

                      <q-card-section class="no-padding row">
                        <q-item style="width: 100%">
                          <q-item-section
                            style="width: 70%; text-overflow: ellipsis; word-break: break-word"
                          >
                            <q-chat-message :label="message.messageTime" />
                            <q-chat-message
                              :text="[message.text]"
                              bg-color="grey-4"
                              class="text-subtitle1"
                              :sent="isAgriculturalPoducer"
                            />
                          </q-item-section>
                        </q-item>
                      </q-card-section>

                      <q-card-section class="no-padding">
                        <q-item
                          style="width: 100%"
                          :class="isAgriculturalPoducer ? '' : 'justify-end'"
                        >
                          <q-input
                            v-if="message.noResponse && !isAgriculturalPoducer"
                            v-model="message.response"
                            :disable="message.loadResponse"
                            placeholder="Ответить"
                            filled
                            autogrow
                            dense
                            style="max-height: 300px"
                          >
                            <template v-slot:after>
                              <q-btn
                                round
                                dense
                                flat
                                :loading="message.loadResponse"
                                icon="send"
                                @click="onAnswer(message)"
                              />
                            </template>
                          </q-input>

                          <q-chat-message
                            v-else
                            bg-color="grey-4"
                            :sent="!isAgriculturalPoducer"
                            class="text-subtitle1"
                          >
                          <div v-if="!!message.response">
                            {{message.response}}
                          </div>  
                          <q-spinner-dots
                              v-if="!message.response && isAgriculturalPoducer"
                            />
                          </q-chat-message>
                        </q-item>
                      </q-card-section>

                      <q-separator />

                      <q-expansion-item v-mounted-item @before-show="onShowExpansion(message)">
                        <template v-slot:header>
                          <q-item-section side>
                            <q-icon name="folder_open" color="primary" />
                          </q-item-section>

                          <q-item-section>
                            <q-item-label>Приложенные файлы</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-item-label v-if="message.noResponse">
                              <q-btn
                                flat
                                round
                                type="file"
                                color="primary"
                                icon="add"
                                @click.stop="openFileInputDialog(message.factId)"
                              >
                                <q-tooltip>
                                  Добавить файл
                                </q-tooltip>
                              </q-btn>
                              <input
                                :id="`inputFile-${message.factId}`"
                                type="file"
                                @click.stop
                                hidden
                                @change="changeFile($event, message)"
                              />
                            </q-item-label>
                          </q-item-section>
                        </template>

                        <template v-slot:default>
                          <div
                            v-if="!message.files"
                            class="expansion-loading"
                            style="font-size: 3em"
                          >
                            <q-spinner-dots color="primary" />
                          </div>

                          <FilesList borderless v-if="message.files?.length" :data="message.files">
                          </FilesList>
                        </template>
                      </q-expansion-item>
                    </q-card>
                  </q-expansion-item>
                  <q-separator />
                </q-card>
              </q-list>

              <div v-else class="no-data">
                {{ errorMessage ? errorMessage : 'Нет данных' }}
              </div>
            </q-tab-panel>

            <q-tab-panel name="status">
              {{ title }}
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
        <div class="button-add" v-if="isAgriculturalPoducer && !errorMessage">
          <q-btn color="primary" label="Новое сообщение" @click="updateVisibilityDialog()" />
        </div>
        <q-linear-progress
          v-show="props.isLoading"
          style="top: -6px"
          size="6px"
          indeterminate
          color="primary"
        />
      </div>
    </div>
    <CreateDialog
      :visibility="visibilityCreateDialog"
      @create-message="createMessage"
      @update:visibility="updateVisibilityDialog"
    />
  </main-wrapper>
</template>

<script setup lang="ts">
import {
  QTabs,
  QTab,
  QScrollArea,
  QTabPanels,
  QTabPanel,
  QList,
  QCard,
  QExpansionItem,
  QSeparator,
  QCardSection,
  QItem,
  QItemSection,
  QChatMessage,
  QInput,
  QBtn,
  QItemLabel,
  QIcon,
  QCheckbox,
  QTooltip,
  QLinearProgress,
  QSpinnerDots,
} from 'quasar';

import { computed, ref, toRefs } from 'vue';
import MainWrapper from '../../components/the-basics/MainWrapper.vue';
import CreateDialog from './CreateDialog.vue';
import FilesList from '../../components/FilesList.vue';
import { Author, /* TreeNode, LazyLoad,*/ Message } from './Type';

const props = defineProps<{
  users: Author[];
  title: string;
  searchField: string;
  errorMessage: string | undefined;
  isAgriculturalPoducer: boolean;
  isLoading: boolean;
}>();
const { users, title, errorMessage, isAgriculturalPoducer } = toRefs(props);

const activeTab = ref('chat');
const searchText = ref('');
const visibilityCreateDialog = ref(false);
const filterNoResponse = ref(false);

const emit = defineEmits<{
  (e: 'moduleStartView'): void;
  (e: 'moduleEndView'): void;
  (e: 'refresh'): void;
  (e: 'sendMessage', val: Message): void;
  (
    e: 'createMessage',
    val: {
      message: string;
      file?: File;
    },
  ): void;
  (e: 'showExpansion', val: Message): void;
  (
    e: 'attachFile',
    val: {
      message: Message;
      file: File;
    },
  ): void;
}>();

const moduleStartView = () => {
  emit('moduleStartView');
};

const onAnswer = (message: Message) => {
  emit('sendMessage', message);
};

const filterUsers = computed(() => {
  return searchText.value.length
    ? users.value.filter((el) => {
        return (
          el.caption &&
          el.label &&
          (el.caption + el.label).toLowerCase().indexOf(searchText.value.toLowerCase()) > -1
        );
      })
    : users.value;
});

const createMessage = (e: { message: string; file?: File }) => {
  emit('createMessage', e);
  updateVisibilityDialog(false);
};

const updateVisibilityDialog = (value?: boolean) => {
  visibilityCreateDialog.value = value ?? !visibilityCreateDialog.value;
};

const filterMessage = (messages: Message[]) => {
  return messages.filter((message) => (filterNoResponse.value ? message.noResponse : message));
};

const refresh = () => {
  emit('refresh');
};

const onShowExpansion = (message: Message) => {
  if (!message.files?.length) {
    emit('showExpansion', message);
  }
};

const changeFile = (e: Event, item: Message) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  emit('attachFile', {
    message: item,
    file,
  });
};

const openFileInputDialog = (itemId: string) => {
  const el = document.getElementById(`inputFile-${itemId}`);
  el && el.click();
};
</script>

<style scoped>
.messages-fields {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.messages-fields-card {
  width: 90%;
  height: 90%;
  min-width: 300px;
  max-width: 800px;
  max-height: 90%;
  box-shadow: 0px 3px 11px -5px rgb(0 0 0 / 50%);
  border-radius: 16px;
  overflow: hidden;
  background: white;
}
.messages-fields-card > .card-tabs {
  display: flex;
  align-items: center;
  margin: 0px 16px;
}
.messages-fields-card > .card-tabs > .tabs {
  flex-grow: 2;
}
.messages-fields-card > .card-tabs > .search-input {
  padding: 16px 0px;
  flex-grow: 1;
}
.tab-panels-scroll {
  margin: 16px;
  flex: auto;
}
.tab-panels-scroll .q-tab-panel {
  padding: 0 !important;
}

.no-data {
  width: 100%;
  font-size: 1.3em;
  text-align: center;
  color: gray;
}
.button-add {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5%;
}
.refresh-button {
  border-radius: 50%;
  -webkit-transition: -webkit-transform 0.8s ease-in-out;
  transition: transform 0.8s ease-in-out;
}
.refresh-button:hover {
  -webkit-transform: rotate(360deg);
  transform: rotate(360deg);
}
.expansion-loading {
  min-width: 300px;
  margin: 8px;
  text-align: center;
}
</style>
