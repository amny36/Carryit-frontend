<template>
  <v-container class="pa-0" style="background: #E9DEEA; min-height: 100vh;">
    <!-- Top Bar -->
    <div class="top-bar px-4 pt-4 pb-2 d-flex align-center gap-3">
      <v-btn icon variant="text" class="retro-icon-btn" @click="router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="page-title">Confirm Pickup</h1>
    </div>

    <div class="px-4 pb-8">
      <!-- QR Success Banner -->
      <div class="success-banner mb-4">
        <v-icon size="18" color="white" class="mr-1">mdi-check-circle</v-icon>
        <span>QR Code Scanned Successfully</span>
      </div>

      <!-- Package Verification Card -->
      <div class="retro-card mb-4 position-relative overflow-hidden">
        <!-- Stamp -->
        <div class="stamp-overlay">VERIFIED</div>

        <div class="mono-label mb-1">PICKUP CODE VERIFIED</div>
        <div class="pickup-code mb-3">{{ booking.pickupCode }}</div>

        <v-divider class="mb-3" />

        <!-- Package Details -->
        <div class="d-flex align-center gap-2 mb-2">
          <v-icon size="20" color="#3D5B3E">{{ categoryIcon }}</v-icon>
          <div>
            <div class="detail-label">PACKAGE</div>
            <div class="detail-value">{{ booking.packageDescription }}</div>
          </div>
        </div>

        <div class="d-flex align-center gap-2 mb-2">
          <v-icon size="20" color="#3D5B3E">mdi-weight-kilogram</v-icon>
          <div>
            <div class="detail-label">WEIGHT</div>
            <div class="detail-value">{{ booking.weight || '2.5' }} kg</div>
          </div>
        </div>

        <div class="d-flex align-center gap-2">
          <v-icon size="20" color="#3D5B3E">mdi-account</v-icon>
          <div>
            <div class="detail-label">SENDER</div>
            <div class="detail-value">{{ booking.senderName }}</div>
          </div>
        </div>
      </div>

      <!-- Handoff Details Card -->
      <div class="retro-card mb-4">
        <div class="mono-label mb-3">HANDOFF RECORD</div>

        <div class="handoff-row mb-2">
          <v-icon size="16" color="#888" class="mr-2">mdi-clock-outline</v-icon>
          <span class="handoff-time">{{ currentTime }}</span>
        </div>

        <div class="handoff-row mb-2">
          <v-icon size="16" color="#888" class="mr-2">mdi-map-marker</v-icon>
          <span class="handoff-location">Demo Location — GPS: 48.8566° N, 2.3522° E</span>
        </div>

        <div class="handoff-row">
          <v-icon size="16" color="#888" class="mr-2">mdi-briefcase-account</v-icon>
          <span class="handoff-traveler">{{ travelerName }} (You)</span>
        </div>
      </div>

      <!-- Photo Capture -->
      <div class="retro-card mb-4">
        <div class="mono-label mb-3">HANDOFF PHOTO (Optional)</div>

        <div
          v-if="!photoPreview"
          class="photo-upload-zone"
          @click="triggerFileInput"
        >
          <v-icon size="36" color="#bbb" class="mb-2">mdi-camera</v-icon>
          <div class="upload-hint">Take handoff photo</div>
          <div class="upload-hint-sub">Tap to capture or upload</div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            capture="environment"
            class="hidden-input"
            @change="handlePhotoUpload"
          />
        </div>

        <div v-else class="photo-preview-wrapper">
          <img :src="photoPreview" class="photo-preview" alt="Handoff photo" />
          <v-btn
            icon
            size="small"
            class="remove-photo-btn"
            @click="removePhoto"
          >
            <v-icon size="16">mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Condition & Notes -->
      <div class="retro-card mb-5">
        <div class="mono-label mb-3">PACKAGE CONDITION</div>

        <div class="condition-options mb-4">
          <button
            v-for="opt in conditionOptions"
            :key="opt.value"
            class="condition-btn"
            :class="{ 'condition-btn--active': condition === opt.value, [`condition-btn--${opt.color}`]: condition === opt.value }"
            @click="condition = opt.value"
          >
            <v-icon size="16" class="mr-1">{{ opt.icon }}</v-icon>
            {{ opt.label }}
          </button>
        </div>

        <div class="mono-label mb-2">NOTES (Optional)</div>
        <v-textarea
          v-model="notes"
          placeholder="Any notes about the package condition..."
          variant="outlined"
          rows="3"
          no-details
          class="retro-textarea"
        />
      </div>

      <!-- Confirm Button -->
      <v-btn
        class="retro-btn-green"
        block
        size="large"
        :loading="confirming"
        prepend-icon="mdi-check"
        @click="confirmPickup"
      >
        CONFIRM PICKUP
      </v-btn>
    </div>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2500" location="top">
      {{ snackbarMsg }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockBookings, mockUsers } from '@/data/mock.js'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const bookingId = computed(() => route.params.id || 'b1')
const booking = ref({ ...mockBookings[0] })

const currentTime = ref('')
const condition = ref('Good')
const notes = ref('')
const photo = ref(null)
const photoPreview = ref(null)
const confirming = ref(false)
const fileInput = ref(null)
const snackbar = ref(false)
const snackbarMsg = ref('')
const snackbarColor = ref('success')

const conditionOptions = [
  { value: 'Good', label: 'Good', icon: 'mdi-check-circle', color: 'green' },
  { value: 'Slightly Damaged', label: 'Slightly Damaged', icon: 'mdi-alert-circle', color: 'amber' },
  { value: 'Damaged', label: 'Damaged', icon: 'mdi-close-circle', color: 'red' }
]

const categoryIcon = computed(() => {
  const icons = {
    electronics: 'mdi-laptop',
    documents: 'mdi-file-document',
    clothing: 'mdi-tshirt-crew',
    food: 'mdi-food',
    default: 'mdi-package-variant'
  }
  return icons[booking.value.packageCategory] || icons.default
})

const travelerName = computed(() => {
  return authStore.user?.name || 'You'
})

function formatDateTime(date) {
  const pad = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} // ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  photo.value = file
  const reader = new FileReader()
  reader.onload = (e) => { photoPreview.value = e.target.result }
  reader.readAsDataURL(file)
}

function removePhoto() {
  photo.value = null
  photoPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function showSnackbar(msg, color = 'success') {
  snackbarMsg.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

async function confirmPickup() {
  confirming.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  confirming.value = false
  showSnackbar('Pickup confirmed! Package is now in transit.')
  setTimeout(() => {
    router.push('/delivery/active/' + bookingId.value)
  }, 1200)
}

onMounted(() => {
  currentTime.value = formatDateTime(new Date())
  // Update every second
  setInterval(() => {
    currentTime.value = formatDateTime(new Date())
  }, 1000)
})
</script>

<style scoped>
.top-bar {
  background: #E9DEEA;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0;
}

.retro-icon-btn {
  border: 2px solid #0A0A0A !important;
  background: #FAFAF7 !important;
  box-shadow: 2px 2px 0 #0A0A0A;
  flex-shrink: 0;
}

.success-banner {
  background: #3D5B3E;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.stamp-overlay {
  position: absolute;
  top: 16px;
  right: 12px;
  font-family: 'VT323', monospace;
  font-size: 32px;
  color: #A3D977;
  letter-spacing: 3px;
  transform: rotate(-12deg);
  opacity: 0.6;
  border: 3px solid #A3D977;
  padding: 0 8px;
  border-radius: 4px;
  pointer-events: none;
}

.mono-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #888;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.pickup-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  color: #0A0A0A;
  letter-spacing: 4px;
}

.detail-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #aaa;
  letter-spacing: 2px;
}

.detail-value {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #0A0A0A;
}

.handoff-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.handoff-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #0A0A0A;
  letter-spacing: 1px;
}

.handoff-location {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #444;
}

.handoff-traveler {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0A0A0A;
}

/* Photo Upload */
.photo-upload-zone {
  border: 2px dashed #bbb;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.photo-upload-zone:hover {
  border-color: #FF4DA6;
  background: rgba(255, 77, 166, 0.04);
}

.upload-hint {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.upload-hint-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #aaa;
}

.hidden-input {
  display: none;
}

.photo-preview-wrapper {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #0A0A0A;
}

.photo-preview {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
}

.remove-photo-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9) !important;
  border: 2px solid #0A0A0A !important;
}

/* Condition buttons */
.condition-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.condition-btn {
  flex: 1;
  min-width: 90px;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: #FAFAF7;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.condition-btn--active {
  border-color: #0A0A0A;
  box-shadow: 2px 2px 0 #0A0A0A;
  color: #0A0A0A;
}

.condition-btn--green { background: #e8f5e9; border-color: #3D5B3E; color: #3D5B3E; }
.condition-btn--amber { background: #fff8e1; border-color: #E8A94A; color: #9a6900; }
.condition-btn--red { background: #ffebee; border-color: #C23B3B; color: #C23B3B; }

/* Textarea */
.retro-textarea :deep(.v-field) {
  border: 2px solid #ddd;
  border-radius: 6px;
  background: #FAFAF7;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
}

/* Buttons */
.retro-btn-green {
  background: #3D5B3E !important;
  color: white !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 6px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.retro-btn-green:active {
  box-shadow: 1px 1px 0 #0A0A0A !important;
  transform: translate(2px, 2px);
}
</style>
