<template>
  <v-container class="pa-0" fluid style="background:#E9DEEA; min-height:100vh;">
    <!-- Header -->
    <div class="header-bar px-4 pt-4 pb-2 d-flex align-center gap-3">
      <v-btn icon variant="text" @click="router.back()" class="back-btn">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <div class="page-title">Post a Trip Offer</div>
        <div class="page-subtitle">Share your journey. Earn on every kg.</div>
      </div>
    </div>

    <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit" class="px-4 pb-24">

      <!-- Route Section -->
      <div class="section-card mt-4">
        <div class="section-label mb-3">Route</div>
        <v-autocomplete
          v-model="form.origin"
          :items="cities"
          label="Origin City"
          prepend-inner-icon="mdi-map-marker"
          variant="outlined"
          :rules="[rules.required, rules.notSameAsDestination]"
          class="carryit-field mb-3"
          clearable
        />
        <div class="route-arrow d-flex justify-center mb-3">
          <v-icon color="#FF4DA6" size="28">mdi-arrow-down</v-icon>
        </div>
        <v-autocomplete
          v-model="form.destination"
          :items="cities"
          label="Destination City"
          prepend-inner-icon="mdi-map-marker-check"
          variant="outlined"
          :rules="[rules.required, rules.notSameAsOrigin]"
          class="carryit-field"
          clearable
        />
      </div>

      <!-- Date & Time -->
      <div class="section-card mt-4">
        <div class="section-label mb-3">Departure</div>
        <v-row>
          <v-col cols="7">
            <v-text-field
              v-model="form.departureDate"
              label="Date"
              type="date"
              variant="outlined"
              :rules="[rules.required, rules.futureDate]"
              class="carryit-field"
              :min="todayStr"
            />
          </v-col>
          <v-col cols="5">
            <v-text-field
              v-model="form.departureTime"
              label="Time"
              type="time"
              variant="outlined"
              class="carryit-field"
            />
          </v-col>
        </v-row>
      </div>

      <!-- Transport Mode -->
      <div class="section-card mt-4">
        <div class="section-label mb-3">Transport Mode</div>
        <div class="transport-grid">
          <div
            v-for="mode in transportModes"
            :key="mode.value"
            class="transport-card"
            :class="{ 'transport-card--selected': form.transportMode === mode.value }"
            @click="form.transportMode = mode.value"
          >
            <span class="transport-emoji">{{ mode.emoji }}</span>
            <span class="transport-label">{{ mode.label }}</span>
          </div>
        </div>
        <div v-if="showTransportError" class="error-text mt-1">Transport mode is required</div>
      </div>

      <!-- Available Space -->
      <div class="section-card mt-4">
        <div class="section-label mb-2">Available Space</div>
        <div class="lcd-display mb-3">
          <span class="lcd-value">{{ form.availableSpace }}</span>
          <span class="lcd-unit">kg</span>
        </div>
        <v-slider
          v-model="form.availableSpace"
          :min="1"
          :max="50"
          :step="0.5"
          color="#FF4DA6"
          track-color="#ddd"
          thumb-color="#FF4DA6"
          class="mt-2"
          hide-details
        />
        <div class="d-flex justify-space-between mt-1">
          <span class="slider-label">1 kg</span>
          <span class="slider-label">50 kg</span>
        </div>
      </div>

      <!-- Price per kg -->
      <div class="section-card mt-4">
        <div class="section-label mb-3">Pricing</div>
        <v-text-field
          v-model.number="form.pricePerKg"
          label="Price per kg (TND)"
          type="number"
          variant="outlined"
          :rules="[rules.required, rules.minPrice]"
          class="carryit-field"
          prepend-inner-icon="mdi-currency-usd"
          min="1"
          @input="updateEarnings"
        />
        <div class="earnings-preview mt-2" v-if="form.pricePerKg >= 1">
          <v-icon color="#E8A94A" size="18" class="mr-1">mdi-lightning-bolt</v-icon>
          <span class="earnings-label">You'll earn approximately </span>
          <span class="earnings-value">{{ estimatedEarnings }} TND</span>
          <span class="earnings-note"> (5 kg avg, after 10% fee)</span>
        </div>
      </div>

      <!-- Pickup Location -->
      <div class="section-card mt-4">
        <div class="section-label mb-3">Pickup Details</div>
        <v-text-field
          v-model="form.pickupLocation"
          label="Pickup Location"
          placeholder="Where can senders meet you?"
          variant="outlined"
          class="carryit-field mb-3"
          prepend-inner-icon="mdi-map-marker-radius"
        />
        <v-textarea
          v-model="form.description"
          label="Description (optional)"
          placeholder="Tell senders about your trip, luggage space, etc."
          variant="outlined"
          class="carryit-field mb-3"
          :maxlength="300"
          counter
          rows="3"
        />
        <v-text-field
          v-model="form.restrictions"
          label="Restrictions (optional)"
          placeholder="e.g., No liquids, No fragile items"
          variant="outlined"
          class="carryit-field"
          prepend-inner-icon="mdi-alert-circle-outline"
        />
      </div>

      <!-- Submit Button -->
      <div class="mt-6">
        <v-btn
          type="submit"
          class="submit-btn"
          :loading="loading"
          :disabled="loading"
          block
          size="large"
        >
          <v-icon left class="mr-2">mdi-rocket-launch</v-icon>
          Post Trip
        </v-btn>
      </div>
    </v-form>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="360">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">Ready to post?</v-card-title>
        <v-card-text class="dialog-text">
          {{ form.origin }} → {{ form.destination }}<br />
          <strong>{{ form.departureDate }}</strong> · {{ form.availableSpace }} kg · {{ form.pricePerKg }} TND/kg
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 gap-2 d-flex">
          <v-btn variant="outlined" class="cancel-btn flex-1" @click="confirmDialog = false">Cancel</v-btn>
          <v-btn class="confirm-btn flex-1" :loading="loading" @click="submitTrip">Post Trip</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const tripsStore = useTripsStore()
const appStore = useAppStore()

const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)
const confirmDialog = ref(false)
const showTransportError = ref(false)

const today = new Date()
const todayStr = today.toISOString().split('T')[0]

const cities = [
  'Paris', 'Lyon', 'Tunis', 'Madrid', 'London',
  'Barcelona', 'Amsterdam', 'Cairo', 'Milan', 'Rome', 'Berlin'
]

const transportModes = [
  { value: 'plane', emoji: '✈️', label: 'Plane' },
  { value: 'train', emoji: '🚆', label: 'Train' },
  { value: 'bus', emoji: '🚌', label: 'Bus' },
  { value: 'car', emoji: '🚗', label: 'Car' },
]

const form = ref({
  origin: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  transportMode: '',
  availableSpace: 10,
  pricePerKg: 5,
  pickupLocation: '',
  description: '',
  restrictions: '',
})

const estimatedEarnings = computed(() => {
  const gross = 5 * (form.value.pricePerKg || 0)
  return (gross * 0.9).toFixed(2)
})

const rules = {
  required: v => !!v || 'This field is required',
  futureDate: v => {
    if (!v) return true
    return new Date(v) > new Date(todayStr) || 'Date must be in the future'
  },
  notSameAsDestination: v => v !== form.value.destination || 'Origin must differ from destination',
  notSameAsOrigin: v => v !== form.value.origin || 'Destination must differ from origin',
  minPrice: v => v >= 1 || 'Minimum price is 1 TND',
}

function updateEarnings() {}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!form.value.transportMode) {
    showTransportError.value = true
    return
  }
  showTransportError.value = false
  if (!valid) return
  confirmDialog.value = true
}

async function submitTrip() {
  loading.value = true
  try {
    await tripsStore.postTrip({ ...form.value })
    confirmDialog.value = false
    appStore.showSnackbar('Trip posted successfully! Bookings will appear soon.')
    router.push('/traveler/trips')
  } catch (e) {
    appStore.showSnackbar('Failed to post trip. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.header-bar {
  background: #FAFAF7;
  border-bottom: 2px solid #0A0A0A;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0A0A0A;
  line-height: 1.2;
}

.page-subtitle {
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  color: #555;
  margin-top: 2px;
}

.back-btn {
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A;
}

.section-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 4px 4px 0 #0A0A0A;
}

.section-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #FF4DA6;
}

.carryit-field :deep(.v-field) {
  border-radius: 8px;
  font-family: 'Archivo', sans-serif;
}

.transport-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.transport-card {
  background: #FAFAF7;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 2px 2px 0 #ccc;
}

.transport-card:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #ccc;
}

.transport-card--selected {
  border-color: #FF4DA6 !important;
  box-shadow: 3px 3px 0 #FF4DA6 !important;
  background: #fff0f7;
}

.transport-emoji {
  font-size: 1.8rem;
}

.transport-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0A0A0A;
}

.lcd-display {
  background: #141a14;
  border-radius: 8px;
  border: 2px solid #0A0A0A;
  padding: 10px 20px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}

.lcd-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.8rem;
  font-weight: 700;
  color: #A3D977;
  line-height: 1;
}

.lcd-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: #A3D977;
  opacity: 0.7;
}

.slider-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #888;
}

.earnings-preview {
  background: #fff8e7;
  border: 1px solid #E8A94A;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}

.earnings-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.85rem;
  color: #555;
}

.earnings-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #E8A94A;
}

.earnings-note {
  font-family: 'Archivo', sans-serif;
  font-size: 0.75rem;
  color: #888;
}

.error-text {
  font-size: 0.75rem;
  color: #C23B3B;
  font-family: 'Archivo', sans-serif;
}

.submit-btn {
  background: #FF4DA6 !important;
  color: #fff !important;
  font-family: 'VT323', monospace !important;
  font-size: 1.4rem !important;
  letter-spacing: 0.05em;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 10px !important;
  text-transform: uppercase;
}

.submit-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #0A0A0A !important;
}

.dialog-card {
  border: 2px solid #0A0A0A;
  border-radius: 14px;
  box-shadow: 5px 5px 0 #0A0A0A;
}

.dialog-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
}

.dialog-text {
  font-family: 'Archivo', sans-serif;
  font-size: 0.9rem;
  color: #444;
}

.cancel-btn {
  border: 2px solid #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

.confirm-btn {
  background: #FF4DA6 !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

.pb-24 { padding-bottom: 96px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.flex-1 { flex: 1; }
</style>
