// ============================================================
// TYPES INVOICE — alignés sur public.invoices + invoice_items
// ============================================================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'cancelled'

/** Libellés FR des statuts pour l'affichage */
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  paid: 'Payée',
  cancelled: 'Annulée',
}

/** Classes CSS badge correspondantes (définies dans main.css) */
export const INVOICE_STATUS_BADGE: Record<InvoiceStatus, string> = {
  draft: 'badge-draft',
  sent: 'badge-sent',
  paid: 'badge-paid',
  cancelled: 'badge-cancelled',
}

// ── Invoice Item ─────────────────────────────────────────────

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number // en centimes
  total: number // quantity * unit_price en centimes
  created_at: string
}

export type InvoiceItemPayload = Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>

// ── Invoice ──────────────────────────────────────────────────

export interface Invoice {
  id: string
  company_id: string
  invoice_number: string
  status: InvoiceStatus

  // Destinataire
  client_name: string
  client_phone: string
  client_email: string | null
  client_address: string | null

  // Dates
  issued_at: string

  // Montants (en centimes)
  total_product: number // SUM(items.quantity)
  total_product_amount: number // SUM(items.total)
  delivery_amount: number // frais de livraison
  total: number // total_product_amount + delivery_amount

  notes: string | null
  created_at: string
  updated_at: string

  // Relation chargée optionnellement
  invoice_items?: InvoiceItem[]
}

export type InvoicePayload = Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'invoice_items'>

export type InvoiceUpdatePayload = Partial<InvoicePayload>

// ── Helpers ──────────────────────────────────────────────────

/** Formate un montant en centimes vers un affichage FCFA */
export function formatFCFA(amount: number): string {
  return (
    amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ' F'
  )
}

/** Calcule les totaux d'une facture à partir de ses lignes */
export function computeInvoiceTotals(
  items: InvoiceItemPayload[],
  deliveryAmount = 0,
): Pick<Invoice, 'total_product' | 'total_product_amount' | 'delivery_amount' | 'total'> {
  const total_product = items.reduce((sum, i) => sum + Number(i.quantity), 0)
  const total_product_amount = items.reduce((sum, i) => sum + i.total, 0)
  const total = total_product_amount + deliveryAmount

  return {
    total_product,
    total_product_amount,
    delivery_amount: deliveryAmount,
    total,
  }
}
