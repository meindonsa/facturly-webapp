import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/core/lib/api'
import { useCompanyStore } from '@/core/stores/company'
import { computeInvoiceTotals, formatFCFA } from '@/shared/types'
import type { Invoice, InvoiceItem, InvoicePayload, InvoiceItemPayload } from '@/shared/types'

// ============================================================
// useInvoice — logique CRUD des factures
// ============================================================

export function useInvoice() {
  const router = useRouter()
  const companyStore = useCompanyStore()

  const invoices = ref<Invoice[]>([])
  const invoice = ref<Invoice | null>(null)
  const items = ref<InvoiceItem[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  // ── Filtres liste ─────────────────────────────────────────

  const statusFilter = ref<string>('all')

  const filteredInvoices = computed(() => {
    if (statusFilter.value === 'all') return invoices.value
    return invoices.value.filter((inv) => inv.status === statusFilter.value)
  })

  // ── Fetch liste ───────────────────────────────────────────

  async function fetchInvoices(): Promise<void> {
    if (!companyStore.company) return
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<{ data: Invoice[] }>('/api/db/invoices', {
        params: {
          company_id: companyStore.company.id,
          order: 'issued_at:desc',
          limit: 100,
        },
      })
      invoices.value = data.data
    } catch {
      error.value = 'Impossible de charger les factures.'
    } finally {
      loading.value = false
    }
  }

  // ── Fetch détail ──────────────────────────────────────────

  async function fetchInvoice(id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const [invRes, itemsRes] = await Promise.all([
        api.get<Invoice>(`/api/db/invoices/${id}`),
        api.get<{ data: InvoiceItem[] }>('/api/db/invoice_items', {
          params: { invoice_id: id, order: 'created_at:asc' },
        }),
      ])
      invoice.value = invRes.data
      items.value = itemsRes.data.data
    } catch {
      error.value = 'Impossible de charger la facture.'
    } finally {
      loading.value = false
    }
  }

  // ── Création ──────────────────────────────────────────────

  async function createInvoice(
    payload: Omit<
      InvoicePayload,
      'company_id' | 'total_product' | 'total_product_amount' | 'delivery_amount' | 'total'
    >,
    itemPayloads: InvoiceItemPayload[],
    deliveryAmount = 0,
  ): Promise<Invoice | null> {
    if (!companyStore.company) return null
    saving.value = true
    error.value = null
    try {
      const totals = computeInvoiceTotals(itemPayloads, deliveryAmount)

      // 1. Créer la facture
      const createRes = await api.post<Invoice[]>('/api/db/invoices', {
        ...payload,
        company_id: companyStore.company.id,
        ...totals,
      })
      const created = createRes.data[0]
      if (!created) throw new Error('Facture non créée.')

      // 2. Créer les lignes
      if (itemPayloads.length > 0) {
        await api.post(
          '/api/db/invoice_items',
          itemPayloads.map((item) => ({ ...item, invoice_id: created.id })),
        )
      }

      return created
    } catch {
      error.value = 'Impossible de créer la facture.'
      return null
    } finally {
      saving.value = false
    }
  }

  // ── Mise à jour statut ────────────────────────────────────

  async function updateStatus(id: string, status: Invoice['status']): Promise<void> {
    saving.value = true
    error.value = null
    try {
      const patchRes = await api.patch<Invoice>(`/api/db/invoices/${id}`, { status })
      const updated = patchRes.data
      if (invoice.value?.id === id) invoice.value = updated
      const idx = invoices.value.findIndex((inv) => inv.id === id)
      if (idx !== -1) invoices.value[idx] = updated
    } catch {
      error.value = 'Impossible de mettre à jour le statut.'
    } finally {
      saving.value = false
    }
  }

  // ── Suppression ───────────────────────────────────────────

  async function deleteInvoice(id: string): Promise<void> {
    saving.value = true
    error.value = null
    try {
      await api.delete(`/api/db/invoices/${id}`)
      invoices.value = invoices.value.filter((inv) => inv.id !== id)
      await router.push('/invoices')
    } catch {
      error.value = 'Impossible de supprimer la facture.'
    } finally {
      saving.value = false
    }
  }

  return {
    invoices,
    invoice,
    items,
    loading,
    saving,
    error,
    statusFilter,
    filteredInvoices,
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    updateStatus,
    deleteInvoice,
    formatFCFA,
  }
}
