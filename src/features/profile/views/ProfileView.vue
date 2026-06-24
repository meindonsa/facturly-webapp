<script setup lang="ts">
import { onMounted } from 'vue'
import AppTopbar from '@/core/layout/AppTopbar.vue'
import { useProfile } from '../composables/useProfile'
import AppButton from '@/shared/components/AppButton.vue'
import AppInput from '@/shared/components/AppInput.vue'

const {
  form,
  passwordForm,
  passwordMismatch,
  loadingProfile,
  loadingPassword,
  loadingLogout,
  successProfile,
  successPassword,
  errorProfile,
  errorPassword,
  user,
  isAdmin,
  initForm,
  submitProfile,
  submitPassword,
  logout,
} = useProfile()

onMounted(initForm)
</script>

<template>
  <div class="flex flex-col min-h-full">
    <!-- Topbar -->
    <AppTopbar title="Profil" />

    <div class="flex-1 flex flex-col gap-5 p-4">
      <!-- Avatar + infos -->
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0"
        >
          <i class="bx bx-user text-primary-600 text-2xl" aria-hidden="true" />
        </div>
        <div class="min-w-0">
          <p class="font-medium text-neutral-900 truncate">{{ user?.email }}</p>
          <span class="badge mt-1" :class="isAdmin ? 'badge-sent' : 'badge-draft'">
            {{ isAdmin ? 'Administrateur' : 'Utilisateur' }}
          </span>
        </div>
      </div>

      <div class="divider" />

      <!-- Formulaire profil -->
      <section>
        <p class="section-label">Informations personnelles</p>

        <div
          v-if="successProfile"
          class="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
        >
          <i class="bx bx-check-circle text-green-500" aria-hidden="true" />
          <p class="text-sm text-green-700">Profil mis à jour.</p>
        </div>

        <div
          v-if="errorProfile"
          class="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
        >
          <i class="bx bx-error-circle text-red-500" aria-hidden="true" />
          <p class="text-sm text-red-600">{{ errorProfile }}</p>
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="submitProfile">
          <AppInput
            v-model="form.full_name"
            label="Nom complet"
            placeholder="Boris Axel"
            icon="bx bx-user"
          />
          <AppButton type="submit" variant="secondary" :loading="loadingProfile">
            Mettre à jour
          </AppButton>
        </form>
      </section>

      <div class="divider" />

      <!-- Modifier mot de passe -->
      <section>
        <p class="section-label">Modifier le mot de passe</p>

        <div
          v-if="successPassword"
          class="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
        >
          <i class="bx bx-check-circle text-green-500" aria-hidden="true" />
          <p class="text-sm text-green-700">Mot de passe modifié.</p>
        </div>

        <div
          v-if="errorPassword"
          class="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
        >
          <i class="bx bx-error-circle text-red-500" aria-hidden="true" />
          <p class="text-sm text-red-600">{{ errorPassword }}</p>
        </div>

        <form class="flex flex-col gap-3" @submit.prevent="submitPassword">
          <AppInput
            v-model="passwordForm.password"
            label="Nouveau mot de passe"
            type="password"
            placeholder="8 caractères minimum"
            icon="bx bx-lock-alt"
            required
          />
          <AppInput
            v-model="passwordForm.confirmPassword"
            label="Confirmer"
            type="password"
            placeholder="••••••••"
            icon="bx bx-lock-alt"
            required
            :error="passwordMismatch ? 'Les mots de passe ne correspondent pas.' : ''"
          />
          <AppButton
            type="submit"
            variant="secondary"
            :loading="loadingPassword"
            :disabled="passwordMismatch"
          >
            Changer le mot de passe
          </AppButton>
        </form>
      </section>

      <div class="divider" />

      <!-- Déconnexion -->
      <section class="pb-4">
        <AppButton
          variant="secondary"
          :loading="loadingLogout"
          icon="bx bx-log-out"
          full
          class="text-red-500! border-red-200!"
          @click="logout"
        >
          Se déconnecter
        </AppButton>
      </section>
    </div>
  </div>
</template>
