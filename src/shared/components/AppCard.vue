<script setup lang="ts">
withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md'
    clickable?: boolean
  }>(),
  {
    padding: 'md',
    clickable: false,
  },
)
</script>

<template>
  <div
    :class="[
      'card',
      padding === 'none' && '!p-0',
      padding === 'sm' && '!p-3',
      clickable && 'cursor-pointer active:scale-[0.99] transition-transform',
    ]"
  >
    <slot />
  </div>
</template>
