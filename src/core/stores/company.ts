import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/core/lib/api'
import { extractMessage } from '@/core/lib/error'
import type { Company, CompanyPayload, CompanyUpdatePayload } from '@/shared/types'

// ============================================================
// STORE COMPANY — entreprise de l'utilisateur courant
// ============================================================

export const useCompanyStore = defineStore('company', () => {
  // ── State ─────────────────────────────────────────────────
  const company = ref<Company | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ───────────────────────────────────────────────
  const hasCompany = computed(() => !!company.value)
  const currency = computed(() => company.value?.currency ?? 'XAF')

  // ── Actions ───────────────────────────────────────────────

  async function fetchCompany(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<{ data: Company[] }>('/api/db/companies')
      // Un user = une company (contrainte unique owner_id)
      company.value = data.data[0] ?? null
    } catch (err: unknown) {
      error.value = extractMessage(err) ?? "Impossible de charger l'entreprise."
    } finally {
      loading.value = false
    }
  }

  async function createCompany(payload: CompanyPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post<Company[]>('/api/db/companies', payload)
      company.value = data[0] ?? null
    } catch (err: unknown) {
      error.value = extractMessage(err) ?? "Impossible de créer l'entreprise."
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCompany(payload: CompanyUpdatePayload): Promise<void> {
    if (!company.value) return
    loading.value = true
    error.value = null
    try {
      const { data } = await api.patch<Company>(`/api/db/companies/${company.value.id}`, payload)
      company.value = data
    } catch (err: unknown) {
      error.value = extractMessage(err) ?? "Impossible de mettre à jour l'entreprise."
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  // ── Return ────────────────────────────────────────────────
  return {
    company,
    loading,
    error,
    hasCompany,
    currency,
    fetchCompany,
    createCompany,
    updateCompany,
    clearError,
  }
})
