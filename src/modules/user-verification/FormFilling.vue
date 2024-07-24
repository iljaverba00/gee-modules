<template>
  <this-field necessarily label="ФИО">
    <q-input
      ref="fullNameRef"
      v-model="fullName"
      filled
      dense
      hide-bottom-space
      :rules="[minLengthRule]"
      lazy-rules="ondemand"
      hint="Обязательное поле"
      @update:model-value="afterUpdateFullName"
    />
  </this-field>

  <this-field>
    <q-btn-toggle
      v-model="typeFace"
      spread
      no-caps
      dense
      toggle-color="primary"
      toggle-text-color="white"
      color="white"
      text-color="grey"
      unelevated
      :options="[
        { label: 'Физ. лицо', value: 'in' },
        { label: 'Юр. лицо', value: 'le' },
        { label: 'ИП', value: 'ie' },
      ]"
    />
  </this-field>

  <this-field
    necessarily
    :label="
      typeFace == 'in'
        ? 'Имя физического лица'
        : typeFace == 'le'
        ? 'Наименование юридического лица'
        : 'Имя индивидуального предпринимателя'
    "
  >
    <q-input
      ref="nameLegalEntityRef"
      v-model="nameLegalEntity"
      :readonly="typeFace !== 'le'"
      filled
      dense
      hide-bottom-space
      :rules="typeFace !== 'le' ? undefined : [minLengthRule]"
      lazy-rules="ondemand"
      hint="Обязательное поле"
    />
  </this-field>

  <this-field
    necessarily
    :label="
      typeFace == 'in'
        ? 'ИНН физического лица'
        : typeFace == 'le'
        ? 'ИНН юридического лица'
        : 'ИНН индивидуального предпринимателя'
    "
  >
    <q-input
      ref="innRef"
      v-model="inn"
      filled
      dense
      hide-bottom-space
      :placeholder="typeFace == 'le' ? '12 34 56789 0' : '12 34 567890 12'"
      :mask="typeFace == 'le' ? '## ## ##### #' : '## ## ###### ##'"
      :rules="[innRule]"
      lazy-rules="ondemand"
      hint="Обязательное поле"
    />
  </this-field>

  <this-field label="Кадастровые номера земельных участков">
    <q-select
      ref="cadastralNumbersRef"
      v-model="cadastralNumbers"
      use-chips
      use-input
      multiple
      filled
      counter
      dense
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
      @beforeinput="beforeInputNumbers($event, cadastralNumbers)"
    >
      <template v-slot:selected-item="scope">
        <q-chip
          style="cursor: pointer"
          :color="validateCadastralNumber(scope.opt) ? 'white' : 'red-11'"
          :text-color="validateCadastralNumber(scope.opt) ? 'primary' : 'white'"
          icon-remove="clear"
          square
          removable
          dense
          :tabindex="scope.tabindex"
          @remove="scope.removeAtIndex(scope.index)"
        >
          <div class="cadastral-numbers-chip" @click="editChip(scope, cadastralNumbersRef)">
            {{ scope.opt }}
          </div>
          <q-tooltip v-if="!validateCadastralNumber(scope.opt)">
            Некорректный формат кадастрового номера, этот номер не будет загружен
          </q-tooltip>
        </q-chip>
      </template>
    </q-select>
  </this-field>

  <this-field label="Уникальный номер контура">
    <q-select
      ref="contourNumberRef"
      v-model="contourNumber"
      use-chips
      use-input
      multiple
      filled
      counter
      dense
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
      @beforeinput="beforeInputNumbers($event, contourNumber)"
    >
      <template v-slot:selected-item="scope">
        <q-chip
          style="cursor: pointer"
          :color="validateContourNumber(scope.opt) ? 'white' : 'red-11'"
          :text-color="validateContourNumber(scope.opt) ? 'primary' : 'white'"
          icon-remove="clear"
          square
          removable
          dense
          :tabindex="scope.tabindex"
          @remove="scope.removeAtIndex(scope.index)"
        >
          <div class="cadastral-numbers-chip" @click="editChip(scope, contourNumberRef)">
            {{ scope.opt }}
          </div>
          <q-tooltip v-if="!validateContourNumber(scope.opt)">
            Некорректный формат номера контура, этот номер не будет загружен
          </q-tooltip>
        </q-chip>
      </template>
    </q-select>
  </this-field>

  <this-field label="Файл доверенности">
    <q-file
      v-model="powerAttorneyFile"
      filled
      clearable
      use-chips
      dense
      accept=".pdf"
      :suffix="!powerAttorneyFile ? '.pdf' : undefined"
    >
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
      <template v-slot:file="scope">
        <q-chip color="white" text-color="primary" icon-remove="clear" square dense>
          <div class="cadastral-numbers-chip">
            {{ scope.file.name + ' | ' + getFileSize(scope.file.size) }}
          </div>
        </q-chip>
      </template>
    </q-file>
  </this-field>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QInput, QSelect, QChip, QBtnToggle, QTooltip, QFile, QIcon } from 'quasar';
import ThisField from '../../components/ThisField.vue';
import '../../components/custom-scroll.sass';
import type { IUserForm, IChipScope } from './types';

const fullName = ref('');
const typeFace = ref('le');
const nameLegalEntity = ref('');
const inn = ref('');
const cadastralNumbers = ref<string[]>([]);
const contourNumber = ref<string[]>([]);
const powerAttorneyFile = ref<null | File>(null);

const fullNameRef = ref();
const nameLegalEntityRef = ref();
const innRef = ref();
const cadastralNumbersRef = ref();
const contourNumberRef = ref();

const afterUpdateFullName = () => {
  if (typeFace.value === 'le') {
    return;
  } else if (typeFace.value === 'in') {
    nameLegalEntity.value = fullName.value;
  } else {
    nameLegalEntity.value = 'ИП ' + fullName.value;
  }
};

watch(typeFace, (val) => {
  if (val === 'le') {
    nameLegalEntity.value = '';
  } else if (val === 'in') {
    nameLegalEntity.value = fullName.value;
  } else {
    nameLegalEntity.value = 'ИП ' + fullName.value;
  }
});

const editChip = (scope: IChipScope, target: QSelect) => {
  scope.removeAtIndex(scope.index);
  target.updateInputValue(scope.opt);
};

const beforeInputNumbers = (e: InputEvent, model: string[]) => {
  if (!e.data) return;

  if (e.data == ',' || e.data == ' ') {
    e.preventDefault();

    const keydownEnter = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });

    (e.target as HTMLInputElement).dispatchEvent(keydownEnter);
  } else if (/[\s.,;|/\\]/.test(e.data) && e.data.length > 1) {
    e.preventDefault();

    const newCadastralNumbers = e.data.split(/[\s.,;|/\\]/).filter((el) => !!el);
    newCadastralNumbers.forEach((el) => {
      if (!model.includes(el)) {
        model.push(el);
      }
    });
  }
};

const validateCadastralNumber = (cadNum: string) => {
  const regex = /^\d{2}:\d{2}:\d{6,7}:\d{1,5}$/;
  return regex.test(cadNum);
};

const validateContourNumber = (conNum: string) => {
  const regex = /^[0-9]+$/;
  return regex.test(conNum);
};

const getFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} байт`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} КБ`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} МБ`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} ГБ`;
};

const minLengthRule = (val: string) => val.length >= 1 || 'Заполните поле';
const innRule = (inn: number | string): boolean | string => {
  let result = false;

  if (typeof inn === 'number') {
    inn = inn.toString();
  } else if (typeof inn !== 'string') {
    inn = '';
  }

  inn = inn
    .split(' ')
    .filter((el) => !!el)
    .join('');

  if (!inn.length) {
    return 'Заполните поле';
  } else if (/[^0-9]/.test(inn)) {
    return 'Поле может состоять только из цифр';
  } else if ([10, 12].indexOf(inn.length) === -1) {
    return 'Поле может состоять только из 10 или 12 цифр';
  } else {
    const checkDigit = (inn: string, coefficients: number[]) => {
      let n = 0;
      for (const i in coefficients) {
        n += coefficients[i] * parseInt(inn[Number(i)]);
      }
      return parseInt(((n % 11) % 10) + '');
    };

    switch (inn.length) {
      case 10: {
        const n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if (n10 === parseInt(inn[9])) {
          result = true;
        }
        break;
      }
      case 12: {
        const n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        const n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if (n11 === parseInt(inn[10]) && n12 === parseInt(inn[11])) {
          result = true;
        }
        break;
      }
    }

    if (!result) {
      return 'Неправильное контрольное число';
    }
  }

  return result ? true : 'Ошибка валидации ИНН';
};

const validateForm = async () => {
  const fullNameValidate = (await fullNameRef.value.validate()) as boolean;
  const nameLegalEntityValidate = (await nameLegalEntityRef.value.validate()) as boolean;
  const innValidate = (await innRef.value.validate()) as boolean;

  return {
    fullName: {
      valid: fullNameValidate,
      value: fullName.value,
    },
    nameLegalEntity: {
      valid: nameLegalEntityValidate,
      value: nameLegalEntity.value,
    },
    inn: {
      valid: innValidate,
      value: inn.value,
    },
    powerAttorneyFile: {
      valid: true,
      value: powerAttorneyFile.value,
    },
    cadastralNumbers: {
      valid: true,
      value: cadastralNumbers.value,
    },
    contourNumber: {
      valid: true,
      value: contourNumber.value,
    },
  } as IUserForm;
};

defineExpose({
  validateForm,
});
</script>

<style>
.cadastral-numbers-chip {
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: 1.1em;
}
</style>
