<script setup lang="ts">
// ============================================================
// AppTopbar — barre supérieure contextuelle
//
// Props :
//   title        : titre affiché
//   showBack     : affiche le bouton retour (défaut false)
//   showGreeting : affiche "Bonjour, [prénom]" (défaut false)
//
// Slots :
//   #actions : icônes à droite (icon-btn)
// ============================================================

import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'

withDefaults(
  defineProps<{
    title?: string
    showBack?: boolean
    showGreeting?: boolean
  }>(),
  {
    title: '',
    showBack: false,
    showGreeting: false,
  },
)

const router = useRouter()
const authStore = useAuthStore()
</script>

<template>
  <header class="topbar">
    <!-- Gauche -->
    <div class="flex items-center gap-3 min-w-0">
      <button v-if="showBack" class="icon-btn shrink-0" aria-label="Retour" @click="router.back()">
        <i class="bx bx-chevron-left text-xl" aria-hidden="true" />
      </button>

      <div class="min-w-0">
        <p v-if="showGreeting" class="text-xs text-neutral-400 leading-none mb-0.5">Bonjour,</p>
        <h1 class="topbar-title truncate">
          {{ showGreeting ? authStore.displayName : title }}
        </h1>
      </div>
    </div>

    <!-- Droite : slot actions -->
    <div class="flex items-center gap-2 shrink-0">
      <slot name="actions" />
    </div>
  </header>
</template>
