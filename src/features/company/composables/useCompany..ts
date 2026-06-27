import { ref, computed } from 'vue'
import { useCompanyStore } from '@/core/stores/company'

// ============================================================
// useCompany — logique du formulaire entreprise
// ============================================================

interface CompanyForm {
  name: string
  email: string | null
  phone: string
  address: string | null
  city: string
  country: string
  currency: string
}

export function useCompany() {
  const companyStore = useCompanyStore()
  const created = ref<boolean>(false)

  const form = ref<CompanyForm>({
    name: '',
    email: null,
    phone: '',
    address: null,
    city: '',
    country: '',
    currency: 'XAF',
  })

  const isDirty = ref(false)
  const success = ref(false)

  // Hydrate le formulaire depuis le store
  function initForm() {
    const c = companyStore.company
    if (!c) return
    form.value = {
      name: c.name ?? '',
      email: c.email ?? null,
      phone: c.phone ?? '',
      address: c.address ?? null,
      city: c.city ?? '',
      country: c.country ?? '',
      currency: c.currency ?? 'XAF',
    }
  }

  function markDirty() {
    isDirty.value = true
    success.value = false
  }

  async function submit(): Promise<void> {
    if (companyStore.company) {
      await companyStore.updateCompany(form.value)
    } else {
      await companyStore.createCompany(form.value)
      setActionDid(true)
    }
    if (!companyStore.error) {
      isDirty.value = false
      success.value = true
    }
  }

  function setActionDid(data: boolean = false) {
    created.value = data
  }

  return {
    form,
    isDirty,
    success,
    created,
    loading: computed(() => companyStore.loading),
    error: computed(() => companyStore.error),
    company: computed(() => companyStore.company),
    initForm,
    markDirty,
    submit,
    setActionDid,
  }
}
