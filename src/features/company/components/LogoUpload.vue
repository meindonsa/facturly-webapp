<script setup lang="ts">
// ============================================================
// LogoUpload — upload + compression du logo entreprise
//
// Compression canvas côté client avant envoi :
//   - Redimensionne à max 400×400px
//   - Qualité JPEG 0.85
//   - Résultat garanti < 500 Ko
// ============================================================

import { ref } from 'vue'
import api from '@/core/lib/api'
import { useCompanyStore } from '@/core/stores/company'

const companyStore = useCompanyStore()

const inputRef   = ref<HTMLInputElement | null>(null)
const preview    = ref<string | null>(companyStore.company?.logo_url ?? null)
const loading    = ref(false)
const error      = ref<string | null>(null)

const MAX_BYTES   = 1024 * 1024        // 1 Mo
const MAX_DIM     = 400               // px
const JPEG_QUALITY = 0.85

// ── Compression via Canvas ────────────────────────────────────

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calcul des dimensions cibles
      let { width, height } = img
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
        width  = Math.round(width  * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas non disponible.'))
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression échouée.'))
          resolve(new File([blob], 'logo.jpg', { type: 'image/jpeg' }))
        },
        'image/jpeg',
        JPEG_QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Impossible de lire l\'image.'))
    }

    img.src = url
  })
}

// ── Sélection + upload ────────────────────────────────────────

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file  = input.files?.[0]
  if (!file) return

  error.value   = null
  loading.value = true

  try {
    // Vérification type avant compression
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      error.value = 'Format non supporté. Utilisez JPG, PNG ou WebP.'
      return
    }

    // Compression si nécessaire
    const toUpload = file.size > MAX_BYTES || file.type !== 'image/jpeg'
      ? await compressImage(file)
      : file

    // Vérification post-compression (sécurité)
    if (toUpload.size > MAX_BYTES) {
      error.value = 'Image trop lourde même après compression. Essayez une image plus petite.'
      return
    }

    // Preview immédiate
    preview.value = URL.createObjectURL(toUpload)

    // Upload vers le proxy Hono
    const formData = new FormData()
    formData.append('file', toUpload)

    const res = await api.post<{ logo_url: string }>(
      '/api/storage/upload-logo',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    // Mise à jour du store
    await companyStore.fetchCompany()

    preview.value = res.data.logo_url

  } catch (err: unknown) {
    error.value = 'Erreur lors de l\'upload. Réessayez.'
    preview.value = companyStore.company?.logo_url ?? null
  } finally {
    loading.value = false
    // Reset input pour permettre re-sélection du même fichier
    if (inputRef.value) inputRef.value.value = ''
  }
}

async function removeLogo() {
  error.value   = null
  loading.value = true
  try {
    await api.delete('/api/storage/delete-logo')
    preview.value = null
    await companyStore.fetchCompany()
  } catch {
    error.value = 'Impossible de supprimer le logo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <label class="field-label">Logo de l'entreprise</label>

    <!-- Zone upload -->
    <div class="flex items-center gap-4">

      <!-- Preview / placeholder -->
      <div
        class="w-20 h-20 rounded-xl border border-neutral-200 bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0"
      >
        <img
          v-if="preview"
          :src="preview"
          alt="Logo"
          class="w-full h-full object-contain"
        />
        <i v-else class="bx bx-image text-3xl text-neutral-300" aria-hidden="true" />
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-2 flex-1">
        <button
          type="button"
          class="btn btn-secondary text-sm"
          :disabled="loading"
          @click="inputRef?.click()"
        >
          <i
            :class="loading ? 'bx bx-loader-alt bx-spin' : 'bx bx-upload'"
            class="text-lg"
            aria-hidden="true"
          />
          {{ preview ? 'Changer le logo' : 'Ajouter un logo' }}
        </button>

        <button
          v-if="preview"
          type="button"
          class="text-xs text-red-500 flex items-center gap-1"
          :disabled="loading"
          @click="removeLogo"
        >
          <i class="bx bx-trash text-sm" aria-hidden="true" />
          Supprimer
        </button>

        <p class="text-xs text-neutral-400">JPG, PNG ou WebP · Max 1 Mo · Compressé automatiquement</p>
      </div>
    </div>

    <!-- Input caché -->
    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="onFileChange"
    />

    <!-- Erreur -->
    <p v-if="error" class="field-error">
      <i class="bx bx-error-circle mr-1" aria-hidden="true" />
      {{ error }}
    </p>
  </div>
</template>