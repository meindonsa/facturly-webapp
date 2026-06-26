<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '@/core/layout/AppTopbar.vue'
import { useInvoice } from '../composables/useInvoice'
import AppLoader from '@/shared/components/AppLoader.vue'
import AppBadge from '@/shared/components/AppBadge.vue'
import api from '@/core/lib/api.ts'

const props = defineProps<{ id: string }>()
const router = useRouter()
const {
  invoice,
  items,
  loading,
  saving,
  error,
  fetchInvoice,
  updateStatus,
  deleteInvoice,
  formatFCFA,
} = useInvoice()

const downloading = ref(false)

async function downloadPdf(): Promise<void> {
  downloading.value = true
  try {
    const res = await api.get(`/api/invoices/${props.id}/pdf`, {
      responseType: 'blob',
      timeout: 60_000, // 60s pour la génération PDF
    })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.value?.invoice_number ?? 'facture'}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  } finally {
    downloading.value = false
  }
}

onMounted(() => fetchInvoice(props.id))

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <AppTopbar :title="invoice?.invoice_number ?? '...'" show-back>
      <template #actions>
        <button
          v-if="invoice"
          class="icon-btn"
          aria-label="Télécharger PDF"
          :disabled="downloading"
          @click="downloadPdf"
        >
          <i
            :class="downloading ? 'bx bx-loader-alt bx-spin' : 'bx bx-download'"
            class="text-lg"
            aria-hidden="true"
          />
        </button>
        <button
          v-if="invoice"
          class="icon-btn"
          aria-label="Modifier"
          @click="router.push(`/invoices/${id}/edit`)"
        >
          <i class="bx bx-edit text-lg" aria-hidden="true" />
        </button>
      </template>
    </AppTopbar>

    <!-- Loader -->
    <AppLoader v-if="loading" full text="Chargement..." />

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="m-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
    >
      <i class="bx bx-error-circle text-red-500" aria-hidden="true" />
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <template v-else-if="invoice">
      <div class="flex flex-col gap-4 p-4 flex-1">
        <!-- En-tête montant + statut -->
        <div class="flex items-start justify-between">
          <div>
            <p class="text-3xl font-medium text-neutral-900">{{ formatFCFA(invoice.total) }}</p>
            <p class="text-sm text-neutral-400 mt-1">{{ invoice.client_name }}</p>
          </div>
          <AppBadge :status="invoice.status" />
        </div>

        <!-- Infos facture -->
        <div class="card flex flex-col gap-3">
          <div class="flex justify-between text-sm">
            <span class="text-neutral-400">N° facture</span>
            <span class="font-medium text-neutral-900">{{ invoice.invoice_number }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-neutral-400">Émise le</span>
            <span class="text-neutral-900">{{ formatDate(invoice.issued_at) }}</span>
          </div>
          <div v-if="invoice.client_email" class="flex justify-between text-sm">
            <span class="text-neutral-400">Email client</span>
            <span class="text-neutral-900">{{ invoice.client_email }}</span>
          </div>
        </div>

        <!-- Lignes -->
        <div>
          <p class="section-label">Lignes</p>
          <div class="flex flex-col gap-2">
            <div
              v-for="item in items"
              :key="item.id"
              class="card flex justify-between items-start gap-3"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium text-neutral-900">{{ item.description }}</p>
                <p class="text-xs text-neutral-400 mt-0.5">
                  {{ item.quantity }} × {{ formatFCFA(item.unit_price) }}
                </p>
              </div>
              <span class="text-sm font-medium text-neutral-900 shrink-0">
                {{ formatFCFA(item.total) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Totaux -->
        <div class="card flex flex-col gap-3">
          <div class="flex justify-between text-sm">
            <span class="text-neutral-400">{{ invoice.total_product }} article(s)</span>
            <span class="text-neutral-900">{{ formatFCFA(invoice.total_product_amount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-neutral-400">Livraison</span>
            <span class="text-neutral-900">{{ formatFCFA(invoice.delivery_amount) }}</span>
          </div>
          <div class="flex justify-between text-sm font-medium border-t border-neutral-100 pt-3">
            <span class="text-neutral-900">Total</span>
            <span class="text-neutral-900">{{ formatFCFA(invoice.total) }}</span>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="invoice.notes" class="card">
          <p class="section-label">Notes</p>
          <p class="text-sm text-neutral-600">{{ invoice.notes }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2">
          <!-- Marquer payée -->
          <button
            v-if="invoice.status === 'sent'"
            class="btn btn-primary"
            :disabled="saving"
            @click="updateStatus(invoice!.id, 'paid')"
          >
            <i class="bx bx-check" aria-hidden="true" />
            Marquer payée
          </button>

          <!-- Renvoyer -->
          <button
            v-if="invoice.status === 'draft'"
            class="btn btn-primary"
            :disabled="saving"
            @click="updateStatus(invoice!.id, 'sent')"
          >
            <i class="bx bx-send" aria-hidden="true" />
            Envoyer
          </button>

          <!-- Annuler -->
          <button
            v-if="['draft', 'sent'].includes(invoice.status)"
            class="btn btn-secondary"
            :disabled="saving"
            @click="updateStatus(invoice!.id, 'cancelled')"
          >
            <i class="bx bx-x" aria-hidden="true" />
            Annuler
          </button>

          <!-- Supprimer -->
          <button
            v-if="invoice.status === 'cancelled'"
            class="btn btn-secondary text-red-500"
            :disabled="saving"
            @click="deleteInvoice(invoice!.id)"
          >
            <i class="bx bx-trash" aria-hidden="true" />
            Supprimer
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
