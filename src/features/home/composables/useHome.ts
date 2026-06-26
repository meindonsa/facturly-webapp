import { ref, onMounted } from 'vue'
import api from '@/core/lib/api'
import { formatFCFA } from '@/shared/types'
import type { Invoice } from '@/shared/types'

// ============================================================
// useHome — statistiques et factures récentes du dashboard
// Les calculs sont effectués côté Hono, pas côté client
// ============================================================

interface Statistics {
  totalPaidMonth: number
  totalPending:   number
  countMonth:     number
  countOverdue:   number
  countTotal:     number
}

interface DashboardResponse {
  statistics: Statistics
  invoices:   any | Pick<Invoice, 'id' | 'invoice_number' | 'status' | 'client_name' | 'total' | 'issued_at'>[]
}

export function useHome() {
  const statistics     = ref<Statistics>({
    totalPaidMonth: 0,
    totalPending:   0,
    countMonth:     0,
    countOverdue:   0,
    countTotal:     0,
  })
  const recentInvoices = ref<DashboardResponse['invoices']>([])
  const loading        = ref(false)
  const error          = ref<string | null>(null)

  async function fetchDashboard(): Promise<void> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get<DashboardResponse>('/api/dashboard')
      statistics.value     = data.statistics
      recentInvoices.value = data.invoices
    } catch {
      error.value = 'Impossible de charger le tableau de bord.'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchDashboard)

  return {
    loading,
    error,
    statistics,
    recentInvoices,
    formatFCFA,
  }
}