<script setup lang="ts">
import { onMounted } from 'vue'
import AppTopbar from '@/core/layout/AppTopbar.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useCompany } from '@/features/company/composables/useCompany..ts'

const { form, isDirty, success, loading, error, company, initForm, markDirty, submit } = useCompany()

onMounted(initForm)
</script>

<template>
  <div class="flex flex-col min-h-full">

    <!-- Topbar -->
    <AppTopbar title="Mon entreprise" />

    <form class="flex-1 flex flex-col gap-5 p-4" @submit.prevent="submit">

      <!-- Succès -->
      <div
        v-if="success"
        class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2"
      >
        <i class="bx bx-check-circle text-green-500 text-lg" aria-hidden="true" />
        <p class="text-sm text-green-700">Entreprise mise à jour avec succès.</p>
      </div>

      <!-- Erreur -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2"
      >
        <i class="bx bx-error-circle text-red-500 text-lg" aria-hidden="true" />
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Infos principales -->
      <section>
        <p class="section-label">Informations</p>
        <div class="flex flex-col gap-3">
          <AppInput
            v-model="form.name"
            label="Nom de l'entreprise"
            placeholder="Ma Société SARL"
            icon="bx bx-buildings"
            required
            @update:model-value="markDirty"
          />
          <AppInput
            v-model="form.email"
            label="Email professionnel"
            type="email"
            placeholder="contact@masociete.com"
            icon="bx bx-envelope"
            @update:model-value="markDirty"
          />
          <AppInput
            v-model="form.phone"
            label="Téléphone"
            type="tel"
            placeholder="+241 01 23 45 67"
            icon="bx bx-phone"
            required
            @update:model-value="markDirty"
          />
        </div>
      </section>

      <!-- Adresse -->
      <section>
        <p class="section-label">Adresse</p>
        <div class="flex flex-col gap-3">
          <AppInput
            v-model="form.address"
            label="Adresse"
            placeholder="Rue des Lilas"
            icon="bx bx-map"
            @update:model-value="markDirty"
          />
          <div class="grid grid-cols-2 gap-3">
            <AppInput
              v-model="form.city"
              label="Ville"
              placeholder="Libreville"
              @update:model-value="markDirty"
            />
            <AppInput
              v-model="form.country"
              label="Pays"
              placeholder="Gabon"
              @update:model-value="markDirty"
            />
          </div>
        </div>
      </section>

      <!-- Devise -->
      <section>
        <p class="section-label">Facturation</p>
        <div class="field">
          <label class="field-label">Devise</label>
          <select
            v-model="form.currency"
            class="field-input"
            @change="markDirty"
          >
            <option value="XAF">XAF — Franc CFA (BEAC)</option>
            <option value="XOF">XOF — Franc CFA (BCEAO)</option>
            <option value="EUR">EUR — Euro</option>
            <option value="USD">USD — Dollar américain</option>
          </select>
        </div>
      </section>

      <!-- Actions -->
      <div class="pb-4">
        <AppButton
          type="submit"
          :loading="loading"
          :disabled="!isDirty"
          icon="bx bx-save"
          full
        >
          {{ company ? 'Enregistrer les modifications' : 'Créer mon entreprise' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>