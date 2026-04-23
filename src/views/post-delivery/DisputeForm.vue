<template>
  <v-container class="dispute-form pa-4" max-width="620">
    <!-- Back Button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 back-btn"
      @click="$router.back()"
    >
      Back
    </v-btn>

    <!-- Success State -->
    <div v-if="submitted" class="success-state">
      <div class="success-card pa-6 text-center">
        <v-icon size="56" color="#3D5B3E" class="mb-4">mdi-check-circle</v-icon>
        <h2 class="success-title mb-2">Dispute Filed Successfully</h2>
        <div class="case-id mb-4">
          <span class="case-label">Case ID:</span>
          <span class="case-value">{{ caseId }}</span>
        </div>
        <p class="success-detail mb-2">Our team will review within 24–48 business hours.</p>
        <p class="success-detail mb-6">You'll receive a notification with our decision.</p>
        <v-btn class="retro-btn" block size="large" @click="$router.push('/my-bookings')">
          Back to Bookings
        </v-btn>
      </div>
    </div>

    <!-- Expired State -->
    <div v-else-if="isExpired" class="expired-state">
      <div class="expired-banner pa-5 text-center mb-4">
        <v-icon size="40" color="white" class="mb-2">mdi-lock</v-icon>
        <h2 class="expired-title">Dispute Window Closed</h2>
        <p class="expired-sub">You had 48 hours after delivery to file a dispute.</p>
        <div class="expired-dates mt-3">
          <div>Delivery confirmed: <strong>{{ booking.date }}</strong></div>
          <div>Deadline was: <strong>{{ deadlineDate }}</strong></div>
        </div>
      </div>
      <div class="d-flex gap-3 mt-4">
        <v-btn disabled block variant="outlined">Contact Support</v-btn>
        <v-btn disabled block variant="outlined">View Booking</v-btn>
      </div>
    </div>

    <!-- Main Form -->
    <div v-else>
      <!-- Title -->
      <h1 class="page-title mb-4">Open a Dispute</h1>

      <!-- Time Remaining Banner -->
      <div class="amber-banner mb-5 pa-3 d-flex align-center gap-2">
        <v-icon color="#0A0A0A">mdi-alert</v-icon>
        <span>
          Dispute window: <strong>{{ timeRemaining.hours }}h {{ timeRemaining.minutes }}m remaining</strong>
        </span>
      </div>

      <!-- Booking Summary Card -->
      <div class="retro-card mb-5 pa-4">
        <div class="section-label mb-3">Booking Summary</div>
        <div class="route-display mb-2">
          <span class="route-city">{{ booking.origin }}</span>
          <v-icon class="mx-2" color="#9CA3AF">mdi-arrow-right</v-icon>
          <span class="route-city">{{ booking.destination }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Traveler:</span>
          <span class="summary-value">{{ booking.travelerName }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Date:</span>
          <span class="summary-value">{{ booking.date }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Amount Paid:</span>
          <span class="summary-value">{{ booking.amount }} TND</span>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="submit">

        <!-- 1. Dispute Type -->
        <div class="retro-card mb-5 pa-4">
          <div class="section-label mb-3">Dispute Type</div>
          <div class="dispute-types">
            <button
              v-for="type in disputeTypes"
              :key="type.value"
              type="button"
              class="dispute-type-card"
              :class="{ 'dispute-type-selected': disputeType === type.value }"
              @click="disputeType = type.value"
            >
              <span class="type-icon">{{ type.icon }}</span>
              <span class="type-label">{{ type.label }}</span>
            </button>
          </div>
          <div v-if="showTypeError" class="field-error mt-2">Please select a dispute type.</div>
        </div>

        <!-- 2. Description -->
        <div class="retro-card mb-5 pa-4">
          <div class="section-label mb-3">Description of Issue</div>
          <v-textarea
            v-model="description"
            label="Describe what happened"
            rows="4"
            counter="1000"
            maxlength="1000"
            variant="outlined"
            hint="Be as specific as possible to help our team investigate."
            persistent-hint
            :error-messages="descriptionError"
            class="retro-textarea"
          />
        </div>

        <!-- 3. Evidence Photos -->
        <div class="retro-card mb-5 pa-4">
          <div class="section-label mb-3">Evidence / Photos</div>
          <div
            class="upload-zone"
            :class="{ 'upload-zone-active': photos.length < 3 }"
            @click="photos.length < 3 && $refs.fileInput.click()"
          >
            <v-icon size="32" color="#9CA3AF" class="mb-2">mdi-camera-plus</v-icon>
            <div class="upload-text">📷 Add Photos (up to 3)</div>
            <div class="upload-hint">JPG, PNG — max 5MB each</div>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png"
            style="display:none"
            @change="handleFileSelect"
          />
          <div v-if="photos.length > 0" class="photo-previews mt-3">
            <div
              v-for="(photo, i) in photos"
              :key="i"
              class="photo-thumb"
            >
              <img :src="photo.preview" :alt="photo.name" />
              <button class="photo-remove" @click="removePhoto(i)" type="button">×</button>
            </div>
          </div>
          <div v-if="photoError" class="field-error mt-2">{{ photoError }}</div>
        </div>

        <!-- 4. Requested Resolution -->
        <div class="retro-card mb-5 pa-4">
          <div class="section-label mb-3">Requested Resolution</div>
          <v-select
            v-model="resolution"
            :items="resolutionOptions"
            label="Select resolution"
            variant="outlined"
            :rules="[v => !!v || 'Please select a resolution']"
            class="retro-select"
          />
        </div>

        <!-- 5. Estimated Loss -->
        <div class="retro-card mb-5 pa-4">
          <div class="section-label mb-3">Estimated Loss <span class="optional-badge">optional</span></div>
          <v-text-field
            v-model="estimatedLoss"
            type="number"
            label="Amount"
            prefix="TND"
            variant="outlined"
            min="0"
            class="retro-input"
          />
        </div>

        <!-- 6. Terms Checkbox -->
        <div class="retro-card mb-5 pa-4">
          <v-checkbox
            v-model="termsAgreed"
            color="#FF4DA6"
            :rules="[v => !!v || 'You must agree to the terms']"
          >
            <template #label>
              <span class="terms-text">
                I confirm this dispute is accurate and submitted in good faith
              </span>
            </template>
          </v-checkbox>
        </div>

        <!-- Submit Error -->
        <v-alert
          v-if="submitError"
          type="error"
          variant="tonal"
          class="mb-4"
          density="compact"
        >
          {{ submitError }}
        </v-alert>

        <!-- Submit Button -->
        <v-btn
          type="submit"
          class="retro-btn-error mb-4"
          size="large"
          block
          :loading="loading"
          :disabled="!termsAgreed"
          prepend-icon="mdi-alert-circle"
        >
          Submit Dispute
        </v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Mock booking
const mockBookings = [
  {
    id: '1',
    origin: 'Tunis',
    destination: 'Paris',
    date: 'April 15, 2026',
    status: 'delivered',
    travelerName: 'Alex Dupont',
    amount: '85.00',
    deliveredAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10h ago
  }
]

const bookingId = route.params.id || '1'
const booking = mockBookings.find(b => b.id === bookingId) || mockBookings[0]

// For demo: always accessible
const isExpired = ref(false)

const deadlineDate = computed(() => {
  const d = new Date(booking.deliveredAt)
  d.setHours(d.getHours() + 48)
  return d.toLocaleString()
})

const timeRemaining = computed(() => {
  const elapsed = Date.now() - booking.deliveredAt.getTime()
  const windowMs = 48 * 60 * 60 * 1000
  const leftMs = Math.max(0, windowMs - elapsed)
  const hours = Math.floor(leftMs / (1000 * 60 * 60))
  const minutes = Math.floor((leftMs % (1000 * 60 * 60)) / (1000 * 60))
  return { hours, minutes }
})

// Form refs
const formRef = ref(null)
const fileInput = ref(null)
const disputeType = ref(null)
const description = ref('')
const photos = ref([])
const resolution = ref(null)
const estimatedLoss = ref(null)
const termsAgreed = ref(false)
const submitted = ref(false)
const loading = ref(false)
const caseId = ref('')
const submitError = ref('')
const showTypeError = ref(false)
const descriptionError = ref('')
const photoError = ref('')

const disputeTypes = [
  { value: 'damaged', icon: '📦', label: 'Package Damaged' },
  { value: 'wrong', icon: '📋', label: 'Wrong Package Delivered' },
  { value: 'missing', icon: '🔍', label: 'Missing Items' },
  { value: 'not_delivered', icon: '❓', label: 'Not Delivered' },
  { value: 'other', icon: '📝', label: 'Other' },
]

const resolutionOptions = [
  'Full Refund',
  'Partial Refund',
  'Replacement Shipment',
  'Formal Apology',
  'Other',
]

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  if (photos.value.length >= 3) {
    photoError.value = 'Maximum 3 photos allowed.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    photoError.value = 'File must be under 5MB.'
    return
  }
  photoError.value = ''
  const preview = URL.createObjectURL(file)
  photos.value.push({ name: file.name, preview, file })
  // Reset input so same file can be re-added after removal
  event.target.value = ''
}

function removePhoto(index) {
  URL.revokeObjectURL(photos.value[index].preview)
  photos.value.splice(index, 1)
}

async function submit() {
  submitError.value = ''
  showTypeError.value = false
  descriptionError.value = ''

  let valid = true

  if (!disputeType.value) {
    showTypeError.value = true
    valid = false
  }
  if (description.value.trim().length < 50) {
    descriptionError.value = 'Description must be at least 50 characters.'
    valid = false
  }
  if (!resolution.value) {
    submitError.value = 'Please select a requested resolution.'
    valid = false
  }
  if (!termsAgreed.value) {
    submitError.value = 'You must agree to the terms to submit.'
    valid = false
  }

  if (!valid) {
    if (!submitError.value) submitError.value = 'Please fix the errors above.'
    return
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false

  const digits = Math.floor(100000 + Math.random() * 900000)
  caseId.value = `D-${digits}`
  submitted.value = true
}
</script>

<style scoped>
.dispute-form {
  font-family: 'Archivo', sans-serif;
  background: #E9DEEA;
  min-height: 100vh;
}

.back-btn {
  color: #0A0A0A;
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 26px;
  color: #0A0A0A;
}

/* Amber Banner */
.amber-banner {
  background: #E8A94A;
  color: #0A0A0A;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  border-radius: 4px;
}

/* Retro Card */
.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 4px;
}

/* Section Label */
.section-label {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #0A0A0A;
}

/* Route */
.route-display {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.route-city {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #0A0A0A;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.summary-row {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}
.summary-label {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #9CA3AF;
  min-width: 90px;
}
.summary-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #0A0A0A;
  font-weight: 600;
}

/* Dispute Types */
.dispute-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.dispute-type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #FAFAF7;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Archivo', sans-serif;
}
.dispute-type-card:hover {
  border-color: #FF4DA6;
}
.dispute-type-selected {
  border-color: #FF4DA6 !important;
  background: #fff0f8 !important;
  box-shadow: 0 0 0 1px #FF4DA6;
}
.type-icon {
  font-size: 24px;
}
.type-label {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #0A0A0A;
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed #9CA3AF;
  border-radius: 8px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  background: #f9f9f7;
}
.upload-zone-active:hover {
  border-color: #FF4DA6;
  background: #fff0f8;
}
.upload-text {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #0A0A0A;
  margin-bottom: 4px;
}
.upload-hint {
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #9CA3AF;
}

.photo-previews {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.photo-thumb {
  position: relative;
  width: 80px;
  height: 80px;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  overflow: visible;
}
.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}
.photo-remove {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #C23B3B;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Optional Badge */
.optional-badge {
  font-family: 'Archivo', sans-serif;
  font-size: 10px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  color: #9CA3AF;
  border: 1px solid #9CA3AF;
  padding: 1px 6px;
  border-radius: 10px;
  vertical-align: middle;
  margin-left: 6px;
}

/* Terms */
.terms-text {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #0A0A0A;
}

/* Field Error */
.field-error {
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #C23B3B;
}

/* Retro Button Pink */
.retro-btn {
  background: #FF4DA6 !important;
  color: white !important;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 4px !important;
  text-transform: none;
  letter-spacing: 0.5px;
}
.retro-btn:active {
  box-shadow: 1px 1px 0 #0A0A0A !important;
  transform: translate(2px, 2px);
}

/* Retro Button Error */
.retro-btn-error {
  background: #C23B3B !important;
  color: white !important;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 4px !important;
  text-transform: none;
  letter-spacing: 0.5px;
}
.retro-btn-error:active {
  box-shadow: 1px 1px 0 #0A0A0A !important;
  transform: translate(2px, 2px);
}

/* Success State */
.success-state {
  margin-top: 20px;
}
.success-card {
  background: #f0fdf4;
  border: 2px solid #3D5B3E;
  box-shadow: 4px 4px 0 #3D5B3E;
  border-radius: 4px;
}
.success-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 22px;
  color: #065f46;
}
.case-id {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.case-label {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.case-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #065f46;
  background: white;
  padding: 4px 12px;
  border: 2px solid #065f46;
  border-radius: 4px;
}
.success-detail {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #374151;
}

/* Expired State */
.expired-banner {
  background: #C23B3B;
  color: white;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 4px;
}
.expired-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 24px;
  color: white;
  margin-bottom: 8px;
}
.expired-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}
.expired-dates {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
}
</style>
