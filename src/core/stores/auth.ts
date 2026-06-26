import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/core/lib/api'
import {
  saveTokens,
  clearTokens,
  getAccessToken,
  removeItem,
  USER_CACHE_KEY,
  saveItem,
  getItem,
} from '@/core/lib/storage'
import { extractMessage } from '@/core/lib/error'
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
} from '@/shared/types'

// ============================================================
// STORE AUTH — session utilisateur
// ============================================================

export const useAuthStore = defineStore('auth', () => {
  // ── State ─────────────────────────────────────────────────
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ───────────────────────────────────────────────
  const isLoggedIn = computed(() => !!user.value && !!getAccessToken())
  const isAdmin = computed(() => user.value?.role === 'admin')
  const displayName = computed(
    () => (user.value?.metadata?.display_name as string | null) ?? user.value?.email ?? 'Utilisateur',
  )

  // ── Actions ───────────────────────────────────────────────

  async function login(payload: LoginPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post<LoginResponse>('/api/auth/login', payload)
      saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      })
      user.value = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        metadata: {},
      }
    } catch (err: unknown) {
      error.value = extractMessage(err) ?? 'Identifiants invalides.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await api.post('/api/auth/register', payload)
    } catch (err: unknown) {
      error.value = extractMessage(err) ?? "Erreur lors de l'inscription."
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout')
    } finally {
      user.value = null
      clearTokens()
      removeItem(USER_CACHE_KEY)
    }
  }

  async function fetchMe(force = false): Promise<void> {
    // Lire depuis le cache d'abord
    if (!force) {
      const cached = getItem(USER_CACHE_KEY) as AuthUser | null
      if (cached) {
        user.value = cached
        return
      }
    }
    try {
      const { data } = await api.get<AuthUser>('/api/auth/me')
      user.value = data
      saveItem(USER_CACHE_KEY, data)
    } catch {
      user.value = null
      clearTokens()
      removeItem(USER_CACHE_KEY)
    }
  }

  function clearError(): void {
    error.value = null
  }

  // ── Return ────────────────────────────────────────────────
  return {
    user,
    loading,
    error,
    isLoggedIn,
    isAdmin,
    displayName,
    login,
    register,
    logout,
    fetchMe,
    clearError,
  }
})
