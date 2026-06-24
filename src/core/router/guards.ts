import type { RouteLocationNormalized } from 'vue-router'
import { isAuthenticated } from '@/core/lib/storage'

// ============================================================
// GUARDS — protection des routes
// ============================================================

/**
 * authGuard — routes protégées (requiresAuth: true)
 * Redirige vers /auth/login si l'utilisateur n'est pas authentifié
 */
export function authGuard(to: RouteLocationNormalized) {
  if (!isAuthenticated()) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }
}

/**
 * guestGuard — routes publiques (guest: true)
 * Redirige vers /dashboard si l'utilisateur est déjà connecté
 */
export function guestGuard() {
  if (isAuthenticated()) {
    return { name: 'dashboard' }
  }
}
