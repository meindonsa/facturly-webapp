<script setup lang="ts">
withDefaults(
  defineProps<{
    full?: boolean
    text?: string
  }>(),
  {
    full: false,
  },
)
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center gap-3',
      full ? 'flex-1 min-h-[200px]' : 'py-8',
    ]"
    role="status"
    aria-live="polite"
  >
    <i class="bx bx-loader-alt bx-spin text-3xl text-primary-600" aria-hidden="true" />
    <p v-if="text" class="text-sm text-neutral-400">{{ text }}</p>
    <span class="sr-only">Chargement...</span>
  </div>
</template>
