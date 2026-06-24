import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'
import type { LoginPayload, RegisterPayload } from '@/shared/types'

export function useAuth() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  // ── Login ──────────────────────────────────────────────────

  const loginForm = ref<LoginPayload>({ email: '', password: '' })
  const showPassword = ref(false)

  async function submitLogin(): Promise<void> {
    await authStore.login(loginForm.value)
    const redirect = route.query.redirect as string | undefined
    await router.push(redirect ?? '/dashboard')
  }

  // ── Register ───────────────────────────────────────────────

  const registerForm = ref<{
    email: string
    password: string
    confirmPassword: string
    full_name: string
  }>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  })

  const passwordMismatch = computed(
    () =>
      !!registerForm.value.confirmPassword &&
      registerForm.value.password !== registerForm.value.confirmPassword,
  )

  async function submitRegister(): Promise<void> {
    if (passwordMismatch.value) return
    await authStore.register({
      email: registerForm.value.email,
      password: registerForm.value.password,
      full_name: registerForm.value.full_name,
    })
    // Après inscription → login automatique
    await authStore.login({
      email: registerForm.value.email,
      password: registerForm.value.password,
    })
    await router.push('/dashboard')
  }

  // ── Forgot password ────────────────────────────────────────

  const forgotEmail = ref('')
  const forgotSent = ref(false)

  async function submitForgotPassword(): Promise<void> {
    // Appel à implémenter côté proxy Hono / Supabase resetPasswordForEmail
    forgotSent.value = true
  }

  // ── Reset password ─────────────────────────────────────────

  const resetForm = ref({ password: '', confirmPassword: '' })

  const resetMismatch = computed(
    () =>
      !!resetForm.value.confirmPassword &&
      resetForm.value.password !== resetForm.value.confirmPassword,
  )

  async function submitResetPassword(): Promise<void> {
    if (resetMismatch.value) return
    // Appel à implémenter côté proxy Hono / Supabase updateUser
    await router.push('/auth/login')
  }

  return {
    // State store
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),

    // Login
    loginForm,
    showPassword,
    submitLogin,

    // Register
    registerForm,
    passwordMismatch,
    submitRegister,

    // Forgot password
    forgotEmail,
    forgotSent,
    submitForgotPassword,

    // Reset password
    resetForm,
    resetMismatch,
    submitResetPassword,
  }
}
