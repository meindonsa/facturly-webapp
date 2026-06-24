<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md'
    full?: boolean
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    icon?: string
    iconRight?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    full: false,
    loading: false,
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['btn', `btn-${variant}`, size === 'sm' && 'text-sm px-3 py-2', full && 'btn-full']"
  >
    <!-- Spinner loading -->
    <i v-if="loading" class="bx bx-loader-alt bx-spin text-lg" aria-hidden="true" />

    <!-- Icon gauche -->
    <i v-else-if="icon" :class="[icon, 'text-lg']" aria-hidden="true" />

    <!-- Label -->
    <slot />

    <!-- Icon droite -->
    <i v-if="iconRight && !loading" :class="[iconRight, 'text-lg']" aria-hidden="true" />
  </button>
</template>
