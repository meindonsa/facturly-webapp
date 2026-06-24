<script setup lang="ts">
// ============================================================
// AppNav — navigation bottom fixe
// ============================================================

import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'dashboard', label: 'Accueil', to: '/dashboard', icon: 'bx bx-home-alt' },
  { name: 'invoices', label: 'Factures', to: '/invoices', icon: 'bx bx-file' },
  { name: 'company', label: 'Entreprise', to: '/company', icon: 'bx bx-buildings' },
  { name: 'profile', label: 'Profil', to: '/profile', icon: 'bx bx-user' },
] as const

function isActive(itemName: string): boolean {
  return (
    route.name === itemName ||
    (itemName === 'invoices' && String(route.name ?? '').startsWith('invoices'))
  )
}
</script>

<template>
  <nav class="bottom-nav" aria-label="Navigation principale">
    <RouterLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.to"
      class="nav-item"
      :class="{ active: isActive(item.name) }"
      :aria-current="isActive(item.name) ? 'page' : undefined"
    >
      <i :class="[item.icon, 'text-2xl leading-none']" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
