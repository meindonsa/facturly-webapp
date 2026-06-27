<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { onMounted } from 'vue'

const router = useRouter()
const { forgotEmail, forgotSent, loading, submitForgotPassword } = useAuth()
onMounted(() => {
  useAuth().clearError()
})
</script>

<template>
  <div class="min-h-dvh bg-white flex flex-col">
    <!-- En-tête -->
    <div class="px-6 pt-12 pb-6">
      <button class="icon-btn mb-6" aria-label="Retour" @click="router.back()">
        <i class="bx bx-chevron-left text-xl" aria-hidden="true" />
      </button>
      <h1 class="text-2xl font-medium text-neutral-900">Mot de passe oublié</h1>
      <p class="text-sm text-neutral-400 mt-1">
        Saisissez votre email pour recevoir un lien de réinitialisation.
      </p>
    </div>

    <!-- Confirmation envoi -->
    <div
      v-if="forgotSent"
      class="flex-1 px-6 flex flex-col items-center justify-center gap-4 text-center"
    >
      <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
        <i class="bx bx-check text-green-500 text-4xl" aria-hidden="true" />
      </div>
      <div>
        <p class="font-medium text-neutral-900">Email envoyé !</p>
        <p class="text-sm text-neutral-400 mt-1">
          Vérifiez votre boîte mail et suivez le lien pour réinitialiser votre mot de passe.
        </p>
      </div>
      <RouterLink to="/auth/login" class="text-primary-600 text-sm font-medium">
        Retour à la connexion
      </RouterLink>
    </div>

    <!-- Formulaire -->
    <form v-else class="flex-1 px-6 flex flex-col gap-4" @submit.prevent="submitForgotPassword">
      <AppInput
        v-model="forgotEmail"
        label="Email"
        type="email"
        placeholder="vous@exemple.com"
        icon="bx bx-envelope"
        required
        autocomplete="email"
      />

      <AppButton type="submit" :loading="loading" full class="mt-2"> Envoyer le lien </AppButton>
    </form>
  </div>
</template>
