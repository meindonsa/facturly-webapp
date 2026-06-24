<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title?: string
    message?: string
  }>(),
  {
    icon: 'bx bx-inbox',
    title: 'Aucun résultat',
    message: '',
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
    <i :class="[icon, 'text-5xl text-neutral-300']" aria-hidden="true" />
    <div>
      <p class="font-medium text-neutral-600">{{ title }}</p>
      <p v-if="message" class="text-sm text-neutral-400 mt-1">{{ message }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
