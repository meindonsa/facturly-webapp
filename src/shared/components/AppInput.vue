<script setup lang="ts">
// ============================================================
// AppInput — champ de formulaire réutilisable
//
// Props :
//   modelValue : valeur (v-model)
//   label      : libellé au-dessus
//   type       : text | email | password | number | tel | date (défaut: text)
//   placeholder
//   error      : message d'erreur (affiche le champ en rouge)
//   hint       : texte d'aide sous le champ
//   disabled
//   required
//   icon       : classe boxicons à gauche dans le champ
// ============================================================

import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date'
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    icon?: string
  }>(),
  {
    type: 'text',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const hasError = computed(() => !!props.error)

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', props.type === 'number' ? Number(val) : val || null)
}
</script>

<template>
  <div class="field">
    <!-- Label -->
    <label v-if="label" class="field-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <i
        v-if="icon"
        :class="[
          icon,
          'absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-lg pointer-events-none',
        ]"
        aria-hidden="true"
      />
      <input
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="['field-input', icon && 'pl-9', hasError && 'border-red-400 focus:border-red-500']"
        v-bind="$attrs"
        @input="onInput"
      />
    </div>

    <!-- Erreur -->
    <p v-if="hasError" class="field-error">
      <i class="bx bx-error-circle mr-1" aria-hidden="true" />
      {{ error }}
    </p>

    <!-- Hint -->
    <p v-else-if="hint" class="text-xs text-neutral-400 mt-1">
      {{ hint }}
    </p>
  </div>
</template>
