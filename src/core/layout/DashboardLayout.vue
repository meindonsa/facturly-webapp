<script setup lang="ts">
import { useAuthStore } from '@/core/stores/auth'
import { useCompanyStore } from '@/core/stores/company'
import { onMounted } from 'vue'
import AppNav from '@/shared/components/AppNav.vue'

const authStore = useAuthStore()
const companyStore = useCompanyStore()

onMounted(async () => {
  await authStore.fetchMe()
  await companyStore.fetchCompany()
})
</script>

<template>
  <div class="app-shell">
    <main class="app-content">
      <RouterView />
    </main>
    <AppNav />
  </div>
</template>
