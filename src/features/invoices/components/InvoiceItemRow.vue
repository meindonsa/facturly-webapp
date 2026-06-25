<script setup lang="ts">
// ============================================================
// InvoiceItemRow — ligne de facture dans le formulaire
// ============================================================

import { computed } from 'vue'
import { formatFCFA } from '@/shared/types'
import type { InvoiceItemPayload } from '@/shared/types'
import AppInput from '@/shared/components/AppInput.vue'

const props = defineProps<{
  modelValue: InvoiceItemPayload
  index: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: InvoiceItemPayload]
  remove: []
}>()

function update(field: keyof InvoiceItemPayload, value: string | number | null) {
  const updated = { ...props.modelValue, [field]: value ?? 0 }
  // Recalcul du total de la ligne
  updated.total = Number(updated.quantity) * Number(updated.unit_price)
  emit('update:modelValue', updated)
}

const lineTotal = computed(() => props.modelValue.quantity * props.modelValue.unit_price)
</script>

<template>
  <div class="card flex flex-col gap-3">
    <!-- En-tête ligne -->
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-neutral-400">Ligne {{ index + 1 }}</span>
      <button
        class="text-xs text-red-500 flex items-center gap-1"
        type="button"
        @click="$emit('remove')"
      >
        <i class="bx bx-trash text-sm" aria-hidden="true" />
        Supprimer
      </button>
    </div>

    <!-- Description -->
    <AppInput
      :model-value="modelValue.description"
      label="Description"
      placeholder="Prestation ou produit"
      required
      @update:model-value="update('description', $event)"
    />

    <!-- Quantité + Prix unitaire -->
    <div class="grid grid-cols-2 gap-3">
      <AppInput
        :model-value="modelValue.quantity"
        label="Quantité"
        type="number"
        placeholder="1"
        required
        @update:model-value="update('quantity', $event)"
      />
      <AppInput
        :model-value="modelValue.unit_price"
        label="Prix unitaire"
        type="number"
        placeholder="0"
        required
        hint="En centimes"
        @update:model-value="update('unit_price', $event)"
      />
    </div>

    <!-- Total ligne -->
    <div class="flex justify-end">
      <span class="text-sm font-medium text-neutral-900">
        Total : {{ formatFCFA(lineTotal) }}
      </span>
    </div>
  </div>
</template>
