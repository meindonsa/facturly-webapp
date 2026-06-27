<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppTopbar from '@/core/layout/AppTopbar.vue'
import { useHome } from '../composables/useHome'
import MetricCard from '../components/MetricCard.vue'
import RecentInvoiceList from '../components/RecentInvoiceList.vue'
import AppLoader from '@/shared/components/AppLoader.vue'
import AppAlert from '@/shared/components/AppAlert.vue'

const router = useRouter()
const { loading, error, statistics, recentInvoices, formatFCFA, company } = useHome()
</script>

<template>
  <AppAlert
    v-if="!company"
    type="warning"
    title="Entreprise non configurée "
    message="Enregistrez vos informations d'entreprise avant de créer une facture."
    confirm-text="Configurer mon entreprise"
    :show-cancel="false"
    @confirm="router.push('/company')"
  />
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <AppTopbar show-greeting>
      <template #actions>
        <button v-if="false" class="icon-btn" aria-label="Notifications">
          <i class="bx bx-bell text-lg" aria-hidden="true" />
        </button>

        <button class="icon-btn" aria-label="Paramètres" @click="router.push('/profile')">
          <i class="bx bx-cog text-lg" aria-hidden="true" />
        </button>
      </template>
    </AppTopbar>

    <!-- Loader -->
    <AppLoader v-if="loading" full text="Chargement..." />

    <!-- Contenu -->
    <div v-else class="flex flex-col gap-5 p-4">
      <!-- Métriques -->
      <section aria-label="Métriques du mois">
        <p class="section-label">Ce mois</p>
        <div class="grid grid-cols-2 gap-3">
          <MetricCard
            label="Encaissé"
            :value="formatFCFA(statistics.totalPaidMonth)"
            sub="FCFA ce mois"
            accent
          />
          <MetricCard
            label="En attente"
            :value="formatFCFA(statistics.totalPending)"
            sub="FCFA à recevoir"
          />
          <MetricCard label="Factures" :value="String(statistics.countMonth)" sub="ce mois" />
          <MetricCard label="Impayées" :value="String(statistics.countOverdue)" sub="en retard" />
        </div>
      </section>

      <!-- Erreur -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
      >
        <i class="bx bx-error-circle text-red-500" aria-hidden="true" />
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Factures récentes -->
      <section aria-label="Factures récentes">
        <div class="flex items-center justify-between mb-3">
          <p class="section-label !mb-0">Récentes</p>
          <button class="text-xs text-primary-600 font-medium" @click="router.push('/invoices')">
            Voir tout
          </button>
        </div>
        <RecentInvoiceList :invoices="recentInvoices" />
      </section>
    </div>
  </div>
</template>
