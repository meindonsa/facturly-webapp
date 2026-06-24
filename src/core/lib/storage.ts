import { SecurityStorage } from '@meindonsa/security-storage'

// ============================================================
// STORAGE — gestion des tokens via @meindonsa/security-storage
// Les données sont chiffrées + compressées avant d'être
// stockées en localStorage. Point d'entrée unique pour les tokens.
// ============================================================

const storage = new SecurityStorage(import.meta.env.VITE_STORAGE_KEY as string)

const KEYS = {
  ACCESS_TOKEN: 'fct_access_token',
  REFRESH_TOKEN: 'fct_refresh_token',
  EXPIRES_AT: 'fct_expires_at',
} as const

// ── Getters ──────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return storage.getItem(KEYS.ACCESS_TOKEN) ?? null
}

export function getRefreshToken(): string | null {
  return storage.getItem(KEYS.REFRESH_TOKEN) ?? null
}

export function getExpiresAt(): number | null {
  const val = storage.getItem(KEYS.EXPIRES_AT)
  return val ? Number(val) : null
}

// ── Setters ──────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number // timestamp UNIX (secondes)
}

export function saveTokens(tokens: AuthTokens): void {
  storage.setItem(KEYS.ACCESS_TOKEN, tokens.accessToken)
  storage.setItem(KEYS.REFRESH_TOKEN, tokens.refreshToken)
  storage.setItem(KEYS.EXPIRES_AT, tokens.expiresAt)
}

export function clearTokens(): void {
  storage.removeItem(KEYS.ACCESS_TOKEN)
  storage.removeItem(KEYS.REFRESH_TOKEN)
  storage.removeItem(KEYS.EXPIRES_AT)
}

// ── Helpers ──────────────────────────────────────────────────

/** Retourne true si le access token est expiré ou absent */
export function isTokenExpired(): boolean {
  const expiresAt = getExpiresAt()
  if (!expiresAt) return true
  // Marge de 30s pour anticiper l'expiration réseau
  return Date.now() / 1000 >= expiresAt - 30
}

export function isAuthenticated(): boolean {
  return !!getAccessToken() && !isTokenExpired()
}
