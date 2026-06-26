import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/core/lib/api'
import { useAuthStore } from '@/core/stores/auth'

// ============================================================
// useProfile — logique du formulaire profil utilisateur
// ============================================================

export function useProfile() {
  const router = useRouter()
  const authStore = useAuthStore()

  const form = ref({
    full_name: '',
  })

  const passwordForm = ref({
    password: '',
    confirmPassword: '',
  })

  const loadingProfile = ref(false)
  const loadingPassword = ref(false)
  const loadingLogout = ref(false)
  const successProfile = ref(false)
  const successPassword = ref(false)
  const errorProfile = ref<string | null>(null)
  const errorPassword = ref<string | null>(null)

  const passwordMismatch = computed(
    () =>
      !!passwordForm.value.confirmPassword &&
      passwordForm.value.password !== passwordForm.value.confirmPassword,
  )

  function initForm() {
    form.value.full_name = (authStore.user?.metadata?.display_name as string) || ''
  }

  async function submitProfile(): Promise<void> {
    loadingProfile.value = true
    errorProfile.value = null
    successProfile.value = false
    try {
      await api.patch('/api/auth/me', { full_name: form.value.full_name })
      await authStore.fetchMe()
      successProfile.value = true
    } catch {
      errorProfile.value = 'Impossible de mettre à jour le profil.'
    } finally {
      loadingProfile.value = false
    }
  }

  async function submitPassword(): Promise<void> {
    if (passwordMismatch.value) return
    loadingPassword.value = true
    errorPassword.value = null
    successPassword.value = false
    try {
      await api.post('/api/auth/reset-password', {
        password: passwordForm.value.password,
      })
      passwordForm.value = { password: '', confirmPassword: '' }
      successPassword.value = true
    } catch {
      errorPassword.value = 'Impossible de modifier le mot de passe.'
    } finally {
      loadingPassword.value = false
    }
  }

  async function logout(): Promise<void> {
    loadingLogout.value = true
    await authStore.logout()
    await router.push('/auth/login')
  }

  return {
    form,
    passwordForm,
    passwordMismatch,
    loadingProfile,
    loadingPassword,
    loadingLogout,
    successProfile,
    successPassword,
    errorProfile,
    errorPassword,
    user: computed(() => authStore.user),
    isAdmin: computed(() => authStore.isAdmin),
    initForm,
    submitProfile,
    submitPassword,
    logout,
  }
}
