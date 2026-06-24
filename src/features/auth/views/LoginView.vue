<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'

const { loginForm, showPassword, loading, error, submitLogin } = useAuth()
</script>

<template>
  <div class="min-h-dvh bg-white flex flex-col">
    <!-- En-tête -->
    <div class="px-6 pt-16 pb-8">
      <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
        <i class="bx bx-file text-white text-xl" aria-hidden="true" />
      </div>
      <h1 class="text-2xl font-medium text-neutral-900">Connexion</h1>
      <p class="text-sm text-neutral-400 mt-1">Bienvenue sur Facturly</p>
    </div>

    <!-- Formulaire -->
    <form class="flex-1 px-6 flex flex-col gap-4" @submit.prevent="submitLogin">
      <!-- Erreur globale -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
      >
        <i class="bx bx-error-circle text-red-500 text-lg shrink-0 mt-0.5" aria-hidden="true" />
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <AppInput
        v-model="loginForm.email"
        label="Email"
        type="email"
        placeholder="vous@exemple.com"
        icon="bx bx-envelope"
        required
        autocomplete="email"
      />

      <div class="field">
        <AppInput
          v-model="loginForm.password"
          label="Mot de passe"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          icon="bx bx-lock-alt"
          required
          autocomplete="current-password"
        />
        <button
          type="button"
          class="text-xs text-primary-600 self-end mt-1"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? 'Masquer' : 'Afficher' }}
        </button>
      </div>

      <!-- Mot de passe oublié -->
      <div class="text-right -mt-2">
        <RouterLink to="/auth/forgot-password" class="text-xs text-primary-600">
          Mot de passe oublié ?
        </RouterLink>
      </div>

      <AppButton type="submit" :loading="loading" full class="mt-2"> Se connecter </AppButton>
    </form>

    <!-- Footer -->
    <p class="text-center text-sm text-neutral-400 px-6 py-8">
      Pas encore de compte ?
      <RouterLink to="/auth/register" class="text-primary-600 font-medium"> S'inscrire </RouterLink>
    </p>
  </div>
</template>
