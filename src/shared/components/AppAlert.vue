<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?:        'warning' | 'success' | 'error' | 'info'
  title:        string
  message?:     string
  confirmText?: string
  cancelText?:  string
  showCancel?:  boolean
}>(), {
  type:        'info',
  confirmText: 'Confirmer',
  cancelText:  'Annuler',
  showCancel:  true,
})

const emit = defineEmits<{
  confirm: []
  cancel:  []
}>()

const config = computed(() => ({
  warning: {
    iconBg:    'bg-warning',
    iconColor: 'text-warning',
    btnBg:     'bg-amber-600 hover:bg-amber-700',
    icon:      'bx bx-error',
  },
  success: {
    iconBg:    'bg-success',
    iconColor: 'text-success',
    btnBg:     'bg-green-700 hover:bg-green-800',
    icon:      'bx bx-check',
  },
  error: {
    iconBg:    'bg-danger',
    iconColor: 'text-danger',
    btnBg:     'bg-red-700 hover:bg-red-800',
    icon:      'bx bx-x',
  },
  info: {
    iconBg:    'bg-accent',
    iconColor: 'text-accent',
    btnBg:     'bg-primary-600 hover:bg-primary-800',
    icon:      'bx bx-info-circle',
  },
}[props.type]))
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-6"
      style="background: rgba(0,0,0,0.45);"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'alert-title'"
      @click.self="emit('cancel')"
    >
      <div
        class="bg-white rounded-2xl border border-neutral-200 p-7 w-full max-w-xs flex flex-col items-center gap-3 text-center"
        style="max-width: 320px;"
      >
        <!-- Icône -->
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
          :class="[config.iconBg, config.iconColor]"
        >
          <i :class="config.icon" aria-hidden="true" />
        </div>

        <!-- Titre -->
        <p id="alert-title" class="text-base font-medium text-neutral-900 leading-snug">
          {{ title }}
        </p>

        <!-- Message -->
        <p v-if="message" class="text-sm text-neutral-500 leading-relaxed -mt-1">
          {{ message }}
        </p>

        <!-- Actions -->
        <div class="flex flex-col gap-2 w-full mt-1">
          <button
            class="w-full py-3 rounded-xl text-sm font-medium text-white transition-colors"
            :class="config.btnBg"
            @click="emit('confirm')"
          >
            {{ confirmText }}
          </button>
          <button
            v-if="showCancel"
            class="w-full py-3 rounded-xl text-sm font-medium text-neutral-500 border border-neutral-200 hover:bg-neutral-50 transition-colors"
            @click="emit('cancel')"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>