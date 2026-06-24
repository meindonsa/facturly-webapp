<script setup lang="ts">
defineProps<{
  label: string
  value: string
  sub?: string
  accent?: boolean
}>()
</script>

<template>
  <div class="metric-card">
    <p class="text-xs text-neutral-400 mb-1">{{ label }}</p>
    <p
      class="text-xl font-medium leading-tight"
      :class="accent ? 'text-primary-600' : 'text-neutral-900'"
    >
      {{ value }}
    </p>
    <p v-if="sub" class="text-xs text-neutral-400 mt-0.5">{{ sub }}</p>
  </div>
</template>
