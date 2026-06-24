<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatFCFA } from '@/shared/types'
import type { Invoice } from '@/shared/types'
import AppEmpty from '@/shared/components/AppEmpty.vue'
import AppBadge from '@/shared/components/AppBadge.vue'

defineProps<{
  invoices: Invoice[]
}>()

const router = useRouter()
</script>

<template>
  <div>
    <AppEmpty
      v-if="invoices.length === 0"
      icon="bx bx-file"
      title="Aucune facture"
      message="Créez votre première facture."
    />

    <ul v-else class="flex flex-col gap-2">
      <li v-for="invoice in invoices" :key="invoice.id">
        <button
          class="w-full card flex items-center justify-between gap-3 text-left active:scale-[0.99] transition-transform"
          @click="router.push(`/invoices/${invoice.id}`)"
        >
          <!-- Gauche -->
          <div class="min-w-0">
            <p class="font-medium text-neutral-900 truncate text-sm">
              {{ invoice.client_name }}
            </p>
            <p class="text-xs text-neutral-400 mt-0.5">
              {{ invoice.invoice_number }}
            </p>
          </div>

          <!-- Droite -->
          <div class="text-right shrink-0">
            <p class="text-sm font-medium text-neutral-900">
              {{ formatFCFA(invoice.total) }}
            </p>
            <AppBadge :status="invoice.status" class="mt-1" />
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>
