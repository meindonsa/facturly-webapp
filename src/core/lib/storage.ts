import { SecurityStorage } from '@meindonsa/security-storage'
const storage = new SecurityStorage()

export const USER_CACHE_KEY = 'fct_user'
export const COMPANY_CACHE_KEY = 'fct_company'
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
  storage.removeItem(USER_CACHE_KEY)
  storage.removeItem(COMPANY_CACHE_KEY)
}


export function removeItem(key: string): void {
  storage.removeItem(key)
}

export function saveItem(key: string, data: any): void {
  storage.setItem(key, data);
}

export function getItem(key: string) {
  return storage.getItem(key);
}

export function clear(){
  storage.clear();
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
