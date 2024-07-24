<template>
  <q-splitter
    v-model="splitter"
    :horizontal="$q.screen.width < 935"
    :limits="limits"
  >
    <template #before>
      <this-header
        title="Реестр учета сведений"
        :parent="{ splitter, limits }"
        @update:splitter="splitter = $event"
      />
      <div class="business-modules__stage-two-card">
        <this-card :data="props.card" />
      </div>
    </template>
    <template #after>
      <q-splitter
        v-model="splitterHorizontal"
        horizontal
        :limits="limitsHorizontal"
      >
        <template #before>
          <this-header
            title="Документы подготовленные к размещению"
            action-btn
            action-btn-icon="autorenew"
            :parent="{ splitter: splitterHorizontal, limits: limitsHorizontal }"
            @update:splitter="splitterHorizontal = $event"
            @action="emit('refreshDocuments')"
          />
          <div class="business-modules__stage-two-mini-cards">
            <CardList :ref-data="props.cardList" />
          </div>
        </template>
        <template #after>
          <q-splitter
            v-model="splitterHorizontalActions"
            horizontal
            reverse
            unit="px"
            :limits="[52, 52]"
            separator-style="cursor: auto"
          >
            <template #before>
              <this-header
                title="Подготовка документов к размещению в ГИСОГД"
                :parent="{ splitter: splitterHorizontal, limits: limitsHorizontal }"
                @update:splitter="splitterHorizontal = $event"
              />
              <div class="business-modules__stage-two-procedure">
                <slot></slot>
              </div>
            </template>
            <template #after>
              <div class="business-modules__stage-two-actions">
                <q-btn
                  v-if="!props.procedureRun"
                  class="business-modules__stage-two-btn"
                  push
                  color="primary"
                  label="Запустить процедуру"
                  :disable="props.disableActivity"
                  @click="emit('startProcedure')"
                />
                <q-btn
                  class="business-modules__stage-two-btn"
                  push
                  color="negative"
                  label="Перейти к третьему этапу"
                  :disable="props.disableActivity"
                  @click="dialogConfirmation = true"
                />
              </div>
            </template>
          </q-splitter>
        </template>
      </q-splitter>
    </template>
  </q-splitter>

  <this-dialog
    :show="dialogConfirmation"
    title="Закончить выполнение этапа"
    body="Вы уверены что хотите перейти к следующему этапу? Зарегистрировать документы больше не получится!"
    @yes="emit('nextStep')"
    @cancel="dialogConfirmation = false"
  >
  </this-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { QSplitter, QBtn } from 'quasar'
import ThisHeader from '../../../components/ThisHeader.vue'
import ThisCard from '../../../components/ThisCard.vue'
import CardList from '../../../components/CardList.vue'
import ThisDialog from '../../../components/ThisDialog.vue'

import type { ICardRow, ICardList } from '../RegistrationDocumentsGisogdTypes'

const props = defineProps<{
  disableActivity: boolean
  procedureRun: boolean
  card: ICardRow[]
  cardList: ICardList[]
}>()

const emit = defineEmits([
  'loadSecondStep',
  'clearSecondStep',
  'startProcedure',
  'nextStep',
  'refreshDocuments',
])
onMounted(() => emit('loadSecondStep'))
onUnmounted(() => emit('clearSecondStep'))

const splitter = ref(50)
const limits = [10, 90]

const splitterHorizontal = ref(30)
const limitsHorizontal = [10, 80]

const splitterHorizontalActions = ref(52)

const dialogConfirmation = ref(false)
</script>

<style>
.business-modules__stage-two-card,
.business-modules__stage-two-procedure,
.business-modules__stage-two-mini-cards {
  height: calc(100% - 36px);
  overflow-y: auto;
}

.business-modules__stage-two-btn {
  width: calc(50% - 4px);
}

.business-modules__stage-two-btn span {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.business-modules__stage-two-actions {
  padding: 8px;
  display: flex;
  justify-content: space-between;
}
</style>
