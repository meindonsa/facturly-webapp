import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, companyGuard, guestGuard } from '@/core/router/guards.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Redirection racine ──────────────────────────────────
    {
      path: '/',
      redirect: '/dashboard',
    },

    {
      path: '/auth',
      meta: { guest: true },
      beforeEnter: guestGuard,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/features/auth/views/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/features/auth/views/RegisterView.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/features/auth/views/ForgotPasswordView.vue'),
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('@/features/auth/views/ResetPasswordView.vue'),
        },
      ],
    },

    {
      path: '/',
      meta: { requiresAuth: true },
      beforeEnter: authGuard,
      component: () => import('@/core/layout/DashboardLayout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          beforeEnter: companyGuard,
          component: () => import('@/features/home/views/HomeView.vue'),
        },

        // Factures
        {
          path: 'invoices',
          name: 'invoices',
          beforeEnter: companyGuard,
          component: () => import('@/features/invoices/views/InvoiceListView.vue'),
        },
        {
          path: 'invoices/create',
          name: 'invoices-create',
          beforeEnter: companyGuard,
          component: () => import('@/features/invoices/views/InvoiceCreateView.vue'),
        },
        {
          path: 'invoices/:id',
          name: 'invoices-detail',
          beforeEnter: companyGuard,
          component: () => import('@/features/invoices/views/InvoiceDetailView.vue'),
          props: true,
        },
        {
          path: 'invoices/:id/edit',
          name: 'invoices-edit',
          beforeEnter: companyGuard,
          component: () => import('@/features/invoices/views/InvoiceCreateView.vue'),
          props: (route) => ({ id: route.params.id, isEdit: true }),
        },

        // Entreprise
        {
          path: 'company',
          name: 'company',
          component: () => import('@/features/company/views/CompanyView.vue'),
        },

        // Profil
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/features/profile/views/ProfileView.vue'),
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/dashboard',
    },
  ],

  scrollBehavior: () => ({ top: 0 }),
})

export default router
