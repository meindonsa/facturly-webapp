<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '@/core/layout/AppTopbar.vue'
import { useInvoice } from '../composables/useInvoice'
import InvoiceCard from '../components/InvoiceCard.vue'
import AppLoader from '@/shared/components/AppLoader.vue'
import AppEmpty from '@/shared/components/AppEmpty.vue'

const router = useRouter()
const { loading, error, statusFilter, filteredInvoices, fetchInvoices } = useInvoice()

onMounted(fetchInvoices)

const filters: { label: string; value: string }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Brouillon', value: 'draft' },
  { label: 'Envoyées', value: 'sent' },
  { label: 'Payées', value: 'paid' },
  { label: 'Annulées', value: 'cancelled' },
]
</script>

<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <AppTopbar title="Factures">
      <template #actions>
        <button
          class="icon-btn"
          aria-label="Nouvelle facture"
          @click="router.push('/invoices/create')"
        >
          <i class="bx bx-plus text-lg" aria-hidden="true" />
        </button>
      </template>
    </AppTopbar>

    <!-- Filtres statut -->
    <div class="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar border-b border-neutral-200">
      <button
        v-for="f in filters"
        :key="f.value"
        class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
        :class="
          statusFilter === f.value ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-500'
        "
        @click="statusFilter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

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

    <!-- Liste -->
    <div v-else class="flex-1 p-4 flex flex-col gap-3">
      <AppEmpty
        v-if="filteredInvoices.length === 0"
        icon="bx bx-file"
        title="Aucune facture"
        :message="
          statusFilter === 'all'
            ? 'Créez votre première facture.'
            : 'Aucune facture avec ce statut.'
        "
      >
        <template v-if="statusFilter === 'all'" #action>
          <button class="btn btn-primary text-sm" @click="router.push('/invoices/create')">
            <i class="bx bx-plus" aria-hidden="true" />
            Nouvelle facture
          </button>
        </template>
      </AppEmpty>

      <InvoiceCard
        v-for="inv in filteredInvoices"
        :key="inv.id"
        :invoice="inv"
        @click="router.push(`/invoices/${inv.id}`)"
      />
    </div>
  </div>
</template>
