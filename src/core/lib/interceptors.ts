import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import api from './api'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens, isTokenExpired } from './storage'

// ============================================================
// INTERCEPTORS
// Appelé une seule fois dans main.ts via setupInterceptors()
// ============================================================

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processPendingQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else if (token) resolve(token)
  })
  pendingQueue = []
}

export function setupInterceptors(onLogout: () => void): void {
  // ── Request : injection du Bearer ──────────────────────────
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      let token = getAccessToken()

      // Si le token est expiré, on tente un refresh avant d'envoyer
      if (token && isTokenExpired()) {
        token = await attemptRefresh(onLogout)
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  // ── Response : gestion du 401 ──────────────────────────────
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        if (isRefreshing) {
          // Une autre requête est déjà en train de refresher —
          // on met celle-ci en file d'attente
          return new Promise((resolve, reject) => {
            pendingQueue.push({ resolve, reject })
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
        }

        const newToken = await attemptRefresh(onLogout)
        if (newToken) {
          processPendingQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }

        processPendingQueue(error, null)
      }

      return Promise.reject(error)
    },
  )
}

// ── Refresh interne ───────────────────────────────────────────

async function attemptRefresh(onLogout: () => void): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    onLogout()
    return null
  }

  isRefreshing = true

  try {
    const { data } = await api.post<{
      accessToken: string
      refreshToken: string
      expiresAt: number
    }>('/api/auth/refresh', { refreshToken })

    saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
    })

    return data.accessToken
  } catch {
    clearTokens()
    onLogout()
    return null
  } finally {
    isRefreshing = false
  }
}
