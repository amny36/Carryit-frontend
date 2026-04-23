<template>
  <div class="profile-setup-page">
    <!-- Back Arrow -->
    <button class="back-btn" @click="router.push('/auth/verify')" aria-label="Go back">
      <v-icon color="#0A0A0A">mdi-arrow-left</v-icon>
    </button>

    <!-- Progress Chips -->
    <div class="progress-chips">
      <div class="progress-chip done">
        <span>1</span>
        <v-icon size="12" color="white">mdi-check</v-icon>
      </div>
      <div class="progress-line done"></div>
      <div class="progress-chip done">
        <span>2</span>
        <v-icon size="12" color="white">mdi-check</v-icon>
      </div>
      <div class="progress-line"></div>
      <div class="progress-chip active">
        <span>3</span>
      </div>
    </div>

    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Complete Your Profile</h1>
      <p class="page-subtitle">One last step!</p>
    </div>

    <!-- Avatar -->
    <div class="avatar-section">
      <div class="avatar-circle">
        <span class="avatar-initials">{{ userInitials }}</span>
      </div>
      <button class="change-photo-btn" @click="triggerPhotoUpload">Change Photo</button>
      <input ref="photoInput" type="file" accept="image/*" style="display:none" @change="onPhotoChange" />
    </div>

    <!-- Form -->
    <div class="form-container">
      <v-form ref="profileForm" @submit.prevent="save">

        <!-- Bio -->
        <div class="field-group">
          <label class="field-label">Bio / About Me</label>
          <v-textarea
            v-model="formData.bio"
            variant="outlined"
            placeholder="Tell travelers a bit about yourself..."
            rows="3"
            maxlength="200"
            counter
            class="retro-field"
            :rules="[v => v.length <= 200 || 'Max 200 characters']"
          />
        </div>

        <!-- City -->
        <div class="field-group">
          <label class="field-label">City</label>
          <v-text-field
            v-model="formData.city"
            variant="outlined"
            placeholder="Your city"
            prepend-inner-icon="mdi-map-marker"
            class="retro-field"
          />
        </div>

        <!-- Language -->
        <div class="field-group">
          <label class="field-label">Language</label>
          <v-select
            v-model="formData.language"
            variant="outlined"
            :items="['English', 'French', 'Arabic', 'Spanish']"
            placeholder="Select language"
            class="retro-field"
          />
        </div>

        <!-- WhatsApp -->
        <div class="field-group">
          <label class="field-label">WhatsApp Number</label>
          <v-text-field
            v-model="formData.whatsapp"
            variant="outlined"
            placeholder="+216 XX XXX XXX"
            prepend-inner-icon="mdi-whatsapp"
            class="retro-field"
          />
        </div>

        <!-- Traveler Preferences -->
        <template v-if="isTraveler">
          <v-divider class="my-4" />
          <p class="section-subtitle">Traveler Preferences</p>

          <!-- Transport Modes -->
          <div class="field-group">
            <label class="field-label">Transport Modes</label>
            <div class="transport-chips">
              <button
                v-for="mode in transportModes"
                :key="mode.value"
                type="button"
                class="transport-chip"
                :class="{ selected: formData.selectedModes.includes(mode.value) }"
                @click="toggleMode(mode.value)"
              >
                {{ mode.emoji }} {{ mode.label }}
              </button>
            </div>
          </div>

          <!-- Trip Frequency -->
          <div class="field-group">
            <label class="field-label">Trip Frequency</label>
            <v-select
              v-model="formData.tripFrequency"
              variant="outlined"
              :items="['Weekly', 'Monthly', 'Occasionally']"
              placeholder="How often do you travel?"
              class="retro-field"
            />
          </div>
        </template>

        <!-- Save Button -->
        <button
          type="submit"
          class="retro-btn-primary save-btn"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" size="20" color="white" />
          <span v-else>Save Profile</span>
        </button>

        <!-- Skip -->
        <div class="skip-link-wrapper">
          <button type="button" class="skip-link" @click="skipForNow">Skip for now</button>
        </div>

      </v-form>
    </div>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="3000"
      rounded="lg"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const profileForm = ref(null)
const photoInput = ref(null)
const loading = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const formData = ref({
  bio: '',
  city: '',
  language: '',
  whatsapp: '',
  selectedModes: [],
  tripFrequency: ''
})

const transportModes = [
  { value: 'plane', label: 'Plane', emoji: '✈️' },
  { value: 'train', label: 'Train', emoji: '🚆' },
  { value: 'bus', label: 'Bus', emoji: '🚌' },
  { value: 'car', label: 'Car', emoji: '🚗' }
]

const isTraveler = computed(() => authStore.user?.role === 'traveler')

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
})

function toggleMode(value) {
  const idx = formData.value.selectedModes.indexOf(value)
  if (idx >= 0) {
    formData.value.selectedModes.splice(idx, 1)
  } else {
    formData.value.selectedModes.push(value)
  }
}

function triggerPhotoUpload() {
  photoInput.value?.click()
}

function onPhotoChange(e) {
  const file = e.target.files[0]
  if (file) {
    // In production this would upload the file
    console.log('Photo selected:', file.name)
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}

async function save() {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  authStore.user = { ...authStore.user, ...formData.value }
  loading.value = false
  showSnackbar('Profile saved!')
  await new Promise(resolve => setTimeout(resolve, 600))
  if (isTraveler.value) {
    router.push('/traveler/trips')
  } else {
    router.push('/sender/search')
  }
}

function skipForNow() {
  if (isTraveler.value) {
    router.push('/traveler/trips')
  } else {
    router.push('/sender/search')
  }
}

onMounted(() => {
  const user = authStore.user
  if (user) {
    formData.value.bio = user.bio || ''
    formData.value.city = user.city || ''
    formData.value.language = user.language || ''
    formData.value.whatsapp = user.whatsapp || ''
    formData.value.selectedModes = user.selectedModes || []
    formData.value.tripFrequency = user.tripFrequency || ''
  }
})
</script>

<style scoped>
.profile-setup-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #E9DEEA 100%);
  padding: 0 0 48px;
  font-family: 'Archivo', sans-serif;
}

/* Back Button */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #0A0A0A;
  box-shadow: 2px 2px 0 #0A0A0A;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  z-index: 10;
}
.back-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* Progress Chips */
.progress-chips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding-top: 72px;
  margin-bottom: 24px;
}

.progress-chip {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 13px;
  background: white;
  color: #0A0A0A;
  position: relative;
  z-index: 1;
}

.progress-chip.done {
  background: #3D5B3E;
  color: white;
  border-color: #3D5B3E;
}

.progress-chip.active {
  background: #FF4DA6;
  color: white;
  border-color: #FF4DA6;
  box-shadow: 0 0 0 4px rgba(255, 77, 166, 0.2);
}

.progress-chip span {
  line-height: 1;
}

.progress-line {
  width: 40px;
  height: 2px;
  background: #ccc;
  margin: 0 -2px;
  z-index: 0;
}

.progress-line.done {
  background: #3D5B3E;
}

/* Header */
.page-header {
  text-align: center;
  padding: 0 24px 16px;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 4px;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 15px;
  color: #666;
  margin: 0;
}

/* Avatar */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #FF4DA6;
  border: 3px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 36px;
  color: white;
  line-height: 1;
  letter-spacing: -1px;
}

.change-photo-btn {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #FF4DA6;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
}

/* Form */
.form-container {
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
}

.field-group {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #0A0A0A;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-subtitle {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #0A0A0A;
  margin: 0 0 16px;
}

/* Retro field overrides */
.retro-field :deep(.v-field__outline__start),
.retro-field :deep(.v-field__outline__end),
.retro-field :deep(.v-field__outline__notch) {
  border-color: #0A0A0A !important;
  border-width: 2px !important;
}

.retro-field :deep(.v-field) {
  border-radius: 8px;
  box-shadow: 3px 3px 0 #0A0A0A;
  background: #FAFAF7 !important;
}

/* Transport Chips */
.transport-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.transport-chip {
  padding: 8px 14px;
  border: 2px solid #0A0A0A;
  border-radius: 20px;
  background: #FAFAF7;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 2px 2px 0 #0A0A0A;
  transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
}

.transport-chip:active,
.transport-chip.selected {
  transform: translate(2px, 2px);
  box-shadow: none;
  background: #FF4DA6;
  color: white;
}

/* Save Button */
.retro-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  background: #FF4DA6;
  color: white;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  border-radius: 8px;
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  margin-top: 24px;
  letter-spacing: 0.5px;
}

.retro-btn-primary:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.retro-btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.save-btn {
  min-height: 52px;
}

/* Skip Link */
.skip-link-wrapper {
  text-align: center;
  margin-top: 16px;
}

.skip-link {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}
</style>
