<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { onMounted } from 'vue'

const { registerForm, passwordMismatch, loading, error, submitRegister } = useAuth()
onMounted(() => {
  useAuth().clearError()
})
</script>

<template>
  <div class="min-h-dvh bg-white flex flex-col">
    <!-- En-tête -->
    <div class="px-6 pt-16 pb-8">
      <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
        <i class="bx bx-file text-white text-xl" aria-hidden="true" />
      </div>
      <h1 class="text-2xl font-medium text-neutral-900">Créer un compte</h1>
      <p class="text-sm text-neutral-400 mt-1">Commencez à facturer en quelques secondes</p>
    </div>

    <!-- Formulaire -->
    <form class="flex-1 px-6 flex flex-col gap-4" @submit.prevent="submitRegister">
      <!-- Erreur globale -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
      >
        <i class="bx bx-error-circle text-red-500 text-lg shrink-0 mt-0.5" aria-hidden="true" />
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <AppInput
        v-model="registerForm.full_name"
        label="Nom complet"
        type="text"
        placeholder="Boris Axel"
        icon="bx bx-user"
        autocomplete="name"
      />

      <AppInput
        v-model="registerForm.email"
        label="Email"
        type="email"
        placeholder="vous@exemple.com"
        icon="bx bx-envelope"
        required
        autocomplete="email"
      />

      <AppInput
        v-model="registerForm.password"
        label="Mot de passe"
        type="password"
        placeholder="8 caractères minimum"
        icon="bx bx-lock-alt"
        required
        autocomplete="new-password"
        hint="8 caractères minimum"
      />

      <AppInput
        v-model="registerForm.confirmPassword"
        label="Confirmer le mot de passe"
        type="password"
        placeholder="••••••••"
        icon="bx bx-lock-alt"
        required
        :error="passwordMismatch ? 'Les mots de passe ne correspondent pas.' : ''"
        autocomplete="new-password"
      />

      <AppButton type="submit" :loading="loading" :disabled="passwordMismatch" full class="mt-2">
        Créer mon compte
      </AppButton>
    </form>

    <!-- Footer -->
    <p class="text-center text-sm text-neutral-400 px-6 py-8">
      Déjà un compte ?
      <RouterLink to="/auth/login" class="text-primary-600 font-medium"> Se connecter </RouterLink>
    </p>
  </div>
</template>
