<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '@/core/layout/AppTopbar.vue'
import { useInvoice } from '../composables/useInvoice'
import InvoiceItemRow from '../components/InvoiceItemRow.vue'
import { computeInvoiceTotals, formatFCFA, type InvoiceStatus } from '@/shared/types'
import type { InvoiceItemPayload } from '@/shared/types'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'

const props = defineProps<{ id?: string; isEdit?: boolean }>()
const router = useRouter()
const { invoice, fetchInvoice, createInvoice, saving, error } = useInvoice()

function generateInvoiceNumber(): string {
  const today = new Date()
  const date = today.toISOString().split('T')[0]?.replace(/-/g, '') ?? ''
  const random = Math.floor(1000 + Math.random() * 9000)
  return `FAC-${date}-${random}`
}

// ── Formulaire facture ────────────────────────────────────────

const form = ref({
  invoice_number: generateInvoiceNumber(),
  status: 'draft' as InvoiceStatus,
  client_name: '',
  client_email: '',
  client_phone: '',
  client_address: '',
  issued_at: new Date().toISOString().split('T')[0] as string,
  delivery_amount: 0,
  notes: '',
})

// ── Lignes ────────────────────────────────────────────────────

const itemRows = ref<InvoiceItemPayload[]>([
  { description: '', quantity: 1, unit_price: 0, total: 0 },
])

function addItem() {
  itemRows.value.push({ description: '', quantity: 1, unit_price: 0, total: 0 })
}

function removeItem(index: number) {
  if (itemRows.value.length > 1) itemRows.value.splice(index, 1)
}

function updateItem(index: number, value: InvoiceItemPayload) {
  itemRows.value[index] = value
}

// ── Totaux calculés ───────────────────────────────────────────

const totals = computed(() => computeInvoiceTotals(itemRows.value, form.value.delivery_amount))

// ── Mode édition ──────────────────────────────────────────────

onMounted(async () => {
  if (props.isEdit && props.id) {
    await fetchInvoice(props.id)
    if (invoice.value) {
      form.value = {
        invoice_number: invoice.value.invoice_number,
        status: invoice.value.status,
        client_name: invoice.value.client_name,
        client_email: invoice.value.client_email ?? '',
        client_phone: invoice.value.client_phone,
        client_address: invoice.value.client_address ?? '',
        issued_at: invoice.value.issued_at,
        delivery_amount: invoice.value.delivery_amount,
        notes: invoice.value.notes ?? '',
      }
    }
  }
})

// ── Soumission ────────────────────────────────────────────────

async function submit() {
  const created = await createInvoice(
    {
      invoice_number: form.value.invoice_number,
      status: form.value.status,
      client_name: form.value.client_name,
      client_email: form.value.client_email || null,
      client_phone: form.value.client_phone,
      client_address: form.value.client_address || null,
      issued_at: form.value.issued_at,
      notes: form.value.notes || null,
    },
    itemRows.value,
    form.value.delivery_amount,
  )
  if (created) await router.push(`/invoices/${created.id}`)
}
</script>

<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <AppTopbar :title="isEdit ? 'Modifier la facture' : 'Nouvelle facture'" show-back />

    <form class="flex-1 flex flex-col gap-5 p-4" @submit.prevent="submit">
      <!-- Erreur -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
      >
        <i class="bx bx-error-circle text-red-500" aria-hidden="true" />
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Infos facture -->
      <section>
        <p class="section-label">Facture</p>
        <div class="flex flex-col gap-3">
          <AppInput
            v-model="form.invoice_number"
            label="Numéro de facture"
            placeholder="FAC-2024-001"
            icon="bx bx-hash"
            :hint="'Généré automatiquement'"
            disabled
          />
          <AppInput v-model="form.issued_at" label="Date d'émission" type="date" required />
        </div>
      </section>

      <!-- Client -->
      <section>
        <p class="section-label">Client</p>
        <div class="flex flex-col gap-3">
          <AppInput
            v-model="form.client_name"
            label="Nom du client"
            placeholder="Société ou particulier"
            icon="bx bx-user"
            required
          />
          <AppInput
            v-model="form.client_email"
            label="Email"
            type="email"
            placeholder="client@exemple.com"
            icon="bx bx-envelope"
          />
          <AppInput
            v-model="form.client_phone"
            label="Téléphone"
            type="tel"
            placeholder="+24177101010"
            icon="bx bx-phone"
            required
          />
          <AppInput
            v-model="form.client_address"
            label="Adresse"
            placeholder="Libreville, Gabon"
            icon="bx bx-map"
          />
        </div>
      </section>

      <!-- Lignes -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <p class="section-label mb-0!">Lignes</p>
          <button
            type="button"
            class="text-sm text-primary-600 font-medium flex items-center gap-1"
            @click="addItem"
          >
            <i class="bx bx-plus" aria-hidden="true" />
            Ajouter
          </button>
        </div>

        <div class="flex flex-col gap-3">
          <InvoiceItemRow
            v-for="(item, i) in itemRows"
            :key="i"
            :model-value="item"
            :index="i"
            @update:model-value="updateItem(i, $event)"
            @remove="removeItem(i)"
          />
        </div>
      </section>

      <!-- Livraison + Totaux -->
      <section>
        <p class="section-label">Totaux</p>
        <div class="flex flex-col gap-3">
          <AppInput
            v-model="form.delivery_amount"
            label="Frais de livraison"
            type="number"
            placeholder="0"
            icon="bx bx-package"
          />

          <div class="card flex flex-col gap-2">
            <div class="flex justify-between text-sm">
              <span class="text-neutral-400">{{ totals.total_product }} article(s)</span>
              <span>{{ formatFCFA(totals.total_product_amount) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-neutral-400">Livraison</span>
              <span>{{ formatFCFA(totals.delivery_amount) }}</span>
            </div>
            <div class="flex justify-between text-sm font-medium border-t border-neutral-100 pt-2">
              <span>Total</span>
              <span>{{ formatFCFA(totals.total) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Notes -->
      <section>
        <p class="section-label">Notes</p>
        <textarea
          v-model="form.notes"
          class="field-input resize-none"
          rows="3"
          placeholder="Conditions de paiement, mentions légales..."
        />
      </section>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-3 pb-4">
        <AppButton variant="secondary" type="button" @click="router.back()"> Annuler </AppButton>
        <AppButton type="submit" :loading="saving" icon="bx bx-save">
          {{ isEdit ? 'Enregistrer' : 'Créer' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>
