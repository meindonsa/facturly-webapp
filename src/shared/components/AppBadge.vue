<script setup lang="ts">
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_BADGE } from '@/shared/types'
import type { InvoiceStatus } from '@/shared/types'

defineProps<{
  status: InvoiceStatus
}>()
</script>

<template>
  <span :class="['badge', INVOICE_STATUS_BADGE[status]]">
    {{ INVOICE_STATUS_LABELS[status] }}
  </span>
</template>
