<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import AppButton from '@/shared/components/AppButton.vue'
import AppInput from '@/shared/components/AppInput.vue'

const { resetForm, resetMismatch, loading, error, submitResetPassword } = useAuth()
</script>

<template>
  <div class="min-h-dvh bg-white flex flex-col">
    <!-- En-tête -->
    <div class="px-6 pt-16 pb-8">
      <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
        <i class="bx bx-lock-open-alt text-white text-xl" aria-hidden="true" />
      </div>
      <h1 class="text-2xl font-medium text-neutral-900">Nouveau mot de passe</h1>
      <p class="text-sm text-neutral-400 mt-1">Choisissez un nouveau mot de passe sécurisé.</p>
    </div>

    <!-- Formulaire -->
    <form class="flex-1 px-6 flex flex-col gap-4" @submit.prevent="submitResetPassword">
      <!-- Erreur globale -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
      >
        <i class="bx bx-error-circle text-red-500 text-lg shrink-0 mt-0.5" aria-hidden="true" />
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <AppInput
        v-model="resetForm.password"
        label="Nouveau mot de passe"
        type="password"
        placeholder="8 caractères minimum"
        icon="bx bx-lock-alt"
        required
        hint="8 caractères minimum"
        autocomplete="new-password"
      />

      <AppInput
        v-model="resetForm.confirmPassword"
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        icon="bx bx-lock-alt"
        required
        :error="resetMismatch ? 'Les mots de passe ne correspondent pas.' : ''"
        autocomplete="new-password"
      />

      <AppButton type="submit" :loading="loading" :disabled="resetMismatch" full class="mt-2">
        Réinitialiser le mot de passe
      </AppButton>
    </form>
  </div>
</template>
