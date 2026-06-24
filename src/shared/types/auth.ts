// ============================================================
// TYPES AUTH — utilisateur et session
// Alignés sur le schéma Supabase + proxy Hono
// ============================================================

export type AppRole = 'user' | 'admin'

/** Profil métier (table public.profiles) */
export interface Profile {
  id: string
  role: AppRole
  full_name: string | null
  created_at: string
  updated_at: string
}

/** Réponse de /api/auth/me */
export interface AuthUser {
  id: string
  email: string | null
  role: string
  metadata: Record<string, unknown>
}

/** Payload de connexion */
export interface LoginPayload {
  email: string
  password: string
}

/** Payload d'inscription */
export interface RegisterPayload {
  email: string
  password: string
  full_name?: string
}

/** Tokens retournés par login / refresh */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

/** Réponse complète du login */
export interface LoginResponse extends AuthTokens {
  user: {
    id: string
    email: string | null
    role: string
  }
}
