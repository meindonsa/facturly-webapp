import { ref, computed, onMounted } from 'vue'
import api from '@/core/lib/api'
import { useCompanyStore } from '@/core/stores/company'
import { formatFCFA } from '@/shared/types'
import type { Invoice, InvoiceStatus } from '@/shared/types'

// ============================================================
// useHome — métriques et factures récentes du dashboard
// ============================================================

interface Metrics {
  totalPaidMonth: number // montant encaissé ce mois (centimes)
  totalPendingMonth: number // montant en attente (centimes)
  countMonth: number // nb factures ce mois
  countOverdue: number // nb factures impayées en retard
}

export function useHome() {
  const companyStore = useCompanyStore()

  const invoices = ref<Invoice[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Métriques calculées depuis les factures ───────────────

  const metrics = computed<Metrics>(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const today = now.toISOString().split('T')[0] as string

    const monthInvoices = invoices.value.filter((inv) => {
      const d = new Date(inv.issued_at)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    })

    return {
      totalPaidMonth: monthInvoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0),

      totalPendingMonth: invoices.value
        .filter((inv) => inv.status === 'sent')
        .reduce((sum, inv) => sum + inv.total, 0),

      countMonth: monthInvoices.length,

      countOverdue: invoices.value.filter(
        (inv) => inv.status === 'sent' && !!inv.due_at && inv.due_at < today,
      ).length,
    }
  })

  // ── Factures récentes (5 dernières) ──────────────────────

  const recentInvoices = computed(() =>
    [...invoices.value].sort((a, b) => b.issued_at.localeCompare(a.issued_at)).slice(0, 5),
  )

  // ── Fetch ─────────────────────────────────────────────────

  async function fetchInvoices(): Promise<void> {
    if (!companyStore.company) return
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<{ data: Invoice[] }>('/api/db/invoices', {
        params: { company_id: companyStore.company.id, limit: 50, order: 'issued_at:desc' },
      })
      invoices.value = data.data
    } catch {
      error.value = 'Impossible de charger les factures.'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchInvoices)

  return {
    loading,
    error,
    metrics,
    recentInvoices,
    formatFCFA,
  }
}
