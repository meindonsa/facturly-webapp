// ============================================================
// TYPES API — structures de réponse génériques du proxy Hono
// ============================================================

/** Réponse standard pour un seul objet */
export interface ApiResponse<T> {
  data: T
}

/** Réponse paginée (GET /api/db/:table) */
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    limit: number
    offset: number
  }
}

/** Réponse d'erreur du proxy */
export interface ApiError {
  error: string
  message: string
}

/** Paramètres de requête pour les listes */
export interface ListParams {
  select?: string
  limit?: number
  offset?: number
  order?: string
  [key: string]: string | number | undefined
}
