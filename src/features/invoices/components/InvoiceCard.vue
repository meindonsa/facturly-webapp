<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import { formatFCFA } from '@/shared/types'
import type { Invoice } from '@/shared/types'

defineProps<{ invoice: Invoice }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    class="w-full card flex items-center justify-between gap-3 text-left active:scale-[0.99] transition-transform"
    @click="$emit('click')"
  >
    <!-- Gauche -->
    <div class="min-w-0 flex-1">
      <p class="font-medium text-neutral-900 truncate text-sm">
        {{ invoice.client_name }}
      </p>
      <p class="text-xs text-neutral-400 mt-0.5">
        {{ invoice.invoice_number }} · {{ new Date(invoice.issued_at).toLocaleDateString('fr-FR') }}
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
</template>
