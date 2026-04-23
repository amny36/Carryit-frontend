<template>
  <v-container fluid class="booking-page pa-0" style="background:#E9DEEA; min-height:100vh;">

    <!-- Top Nav -->
    <div class="top-nav pa-3">
      <v-btn icon size="small" class="back-btn" @click="handleBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="nav-title">Book Trip</span>
      <div style="width:36px"></div>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator pa-4 pb-2">
      <div class="step-labels">
        <span
          v-for="(label, i) in stepLabels"
          :key="i"
          :class="['step-label', currentStep === i + 1 ? 'step-label--active' : '', currentStep > i + 1 ? 'step-label--done' : '']"
        >
          <span class="step-num">{{ i + 1 }}</span>
          {{ label }}
        </span>
      </div>
      <div class="progress-track mt-2">
        <div class="progress-fill" :style="{ width: `${((currentStep - 1) / 2) * 100}%` }"></div>
      </div>
      <div class="step-counter mt-1">
        <span class="mono-text">STEP {{ currentStep }} / 3</span>
      </div>
    </div>

    <div class="content-wrapper pa-3 pb-24">

      <!-- ===== STEP 1: PACKAGE ===== -->
      <div v-if="currentStep === 1">
        <div class="section-title mb-3">Describe Your Package</div>

        <!-- Category Grid -->
        <div class="category-label mb-2">PACKAGE CATEGORY</div>
        <div class="category-grid mb-4">
          <div
            v-for="cat in categories"
            :key="cat.value"
            :class="['category-card', form.category === cat.value ? 'category-card--selected' : '']"
            @click="form.category = cat.value"
          >
            <span class="category-icon">{{ cat.icon }}</span>
            <span class="category-name">{{ cat.label }}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="field-label mb-1">PACKAGE DESCRIPTION <span class="required">*</span></div>
        <v-textarea
          v-model="form.description"
          placeholder="Describe your package in detail (at least 20 characters)"
          variant="outlined"
          rows="3"
          class="retro-input mb-1"
          :counter="200"
          hide-details="auto"
          @update:model-value="checkProhibited"
        />
        <div class="char-count mb-3">{{ form.description.length }} / 200 chars (min 20)</div>

        <!-- Prohibited Warning -->
        <div v-if="prohibitedWarning" class="prohibited-box mb-3">
          <div class="prohibited-header">
            <v-icon size="16" color="#ff1744">mdi-alert</v-icon>
            <span>PROHIBITED ITEM DETECTED</span>
          </div>
          <p class="prohibited-reason">{{ prohibitedWarning }}</p>
          <p class="prohibited-note">Please remove this item from your package or modify your description.</p>
        </div>

        <!-- Fragile Toggle -->
        <div class="toggle-row mb-3">
          <div>
            <div class="field-label">FRAGILE ITEM?</div>
            <div class="toggle-sub">Traveler will handle with extra care</div>
          </div>
          <v-switch
            v-model="form.isFragile"
            color="#FF4DA6"
            inset
            hide-details
          />
        </div>

        <!-- Declared Value -->
        <div class="field-label mb-1">DECLARED VALUE (TND)</div>
        <v-text-field
          v-model.number="form.declaredValue"
          type="number"
          placeholder="0.00"
          variant="outlined"
          density="comfortable"
          class="retro-input mb-3"
          prepend-inner-icon="mdi-currency-usd"
          hide-details
        />

        <v-btn
          block
          size="large"
          class="retro-btn mt-2"
          :disabled="!canProceedStep1"
          @click="currentStep = 2"
        >
          NEXT: BOOKING DETAILS
          <v-icon right class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <!-- ===== STEP 2: BOOKING DETAILS ===== -->
      <div v-if="currentStep === 2">
        <div class="section-title mb-3">Booking Details</div>

        <!-- Trip Summary -->
        <div class="trip-summary-card mb-4">
          <div class="trip-summary__route">
            <span class="summary-city">{{ trip.origin }}</span>
            <v-icon size="16" color="#A3D977" class="mx-2">mdi-arrow-right</v-icon>
            <span class="summary-city">{{ trip.destination }}</span>
          </div>
          <div class="trip-summary__meta">
            <span>
              <v-icon size="12">mdi-calendar</v-icon>
              {{ formatDate(trip.departureDate) }}
            </span>
            <span class="ml-3">
              <v-icon size="12">mdi-account</v-icon>
              {{ trip.travelerName }}
            </span>
          </div>
        </div>

        <!-- Weight -->
        <div class="field-label mb-1">WEIGHT TO CARRY (KG)</div>
        <div class="weight-display-sm mb-2">
          <span class="lcd-weight-sm">{{ form.weight.toFixed(1) }}</span>
          <span class="lcd-unit-sm">KG</span>
        </div>
        <v-slider
          v-model="form.weight"
          :min="0.5"
          :max="maxWeight"
          :step="0.5"
          color="#FF4DA6"
          track-color="#ddd"
          class="mb-1"
          hide-details
        />
        <div class="slider-labels mb-3">
          <span>0.5 kg</span>
          <span>{{ maxWeight }} kg max</span>
        </div>

        <!-- Price Breakdown -->
        <div class="lcd-card mb-4">
          <div class="lcd-card__header">
            <v-icon size="12" color="#A3D977" class="mr-1">mdi-receipt</v-icon>
            PRICE BREAKDOWN
          </div>
          <div class="pa-3">
            <div class="price-line">
              <span class="price-line__label">{{ form.weight }} kg × {{ trip.pricePerKg || 15 }} TND</span>
              <span class="price-line__val">{{ basePrice.toFixed(2) }} TND</span>
            </div>
            <div class="price-line">
              <span class="price-line__label">Platform fee (10%)</span>
              <span class="price-line__val">{{ platformFee.toFixed(2) }} TND</span>
            </div>
            <div class="price-divider my-2"></div>
            <div class="price-total-row">
              <span class="price-total-label">TOTAL</span>
              <span class="price-total-val">{{ totalPrice.toFixed(2) }} TND</span>
            </div>
          </div>
        </div>

        <!-- Special Instructions -->
        <div class="field-label mb-1">SPECIAL INSTRUCTIONS (OPTIONAL)</div>
        <v-textarea
          v-model="form.specialInstructions"
          placeholder="Any special handling instructions for the traveler..."
          variant="outlined"
          rows="2"
          class="retro-input mb-3"
          :counter="200"
          maxlength="200"
          hide-details
        />

        <!-- Pickup Details -->
        <div class="field-label mb-1">PREFERRED PICKUP TIME / LOCATION</div>
        <v-text-field
          v-model="form.pickupDetails"
          placeholder="e.g. Morning, near city center..."
          variant="outlined"
          density="comfortable"
          class="retro-input mb-4"
          prepend-inner-icon="mdi-map-marker-clock"
          hide-details
        />

        <div class="step-nav-row">
          <v-btn variant="outlined" class="back-step-btn" @click="currentStep = 1">
            <v-icon class="mr-1">mdi-arrow-left</v-icon> BACK
          </v-btn>
          <v-btn class="retro-btn flex-1 ml-3" :disabled="!canProceedStep2" @click="currentStep = 3">
            REVIEW & CONFIRM
            <v-icon right class="ml-2">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- ===== STEP 3: REVIEW & CONFIRM ===== -->
      <div v-if="currentStep === 3">
        <div class="section-title mb-3">Review & Confirm</div>

        <!-- Summary -->
        <v-card class="retro-card mb-3" elevation="0">
          <v-card-text class="pa-4">
            <div class="review-section-label mb-2">TRIP</div>
            <div class="review-row">
              <span class="review-key">Route</span>
              <span class="review-val">{{ trip.origin }} → {{ trip.destination }}</span>
            </div>
            <div class="review-row">
              <span class="review-key">Date</span>
              <span class="review-val">{{ formatDate(trip.departureDate) }}</span>
            </div>
            <div class="review-row">
              <span class="review-key">Traveler</span>
              <span class="review-val">{{ trip.travelerName }} <span class="trust-inline">★ {{ trip.trustScore }}</span></span>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="retro-card mb-3" elevation="0">
          <v-card-text class="pa-4">
            <div class="review-section-label mb-2">PACKAGE</div>
            <div class="review-row">
              <span class="review-key">Category</span>
              <span class="review-val">{{ getCategoryLabel(form.category) }}</span>
            </div>
            <div class="review-row">
              <span class="review-key">Description</span>
              <span class="review-val">{{ form.description }}</span>
            </div>
            <div class="review-row">
              <span class="review-key">Weight</span>
              <span class="review-val">{{ form.weight }} kg</span>
            </div>
            <div class="review-row" v-if="form.isFragile">
              <span class="review-key">Handling</span>
              <span class="review-val fragile-badge">⚠ Fragile</span>
            </div>
            <div class="review-row">
              <span class="review-key">Declared Value</span>
              <span class="review-val">{{ form.declaredValue || 0 }} TND</span>
            </div>
          </v-card-text>
        </v-card>

        <!-- Price Summary -->
        <div class="lcd-card mb-3">
          <div class="lcd-card__header">
            <v-icon size="12" color="#A3D977" class="mr-1">mdi-receipt</v-icon>
            PRICE SUMMARY
          </div>
          <div class="pa-3">
            <div class="price-line">
              <span class="price-line__label">Base ({{ form.weight }}kg)</span>
              <span class="price-line__val">{{ basePrice.toFixed(2) }} TND</span>
            </div>
            <div class="price-line">
              <span class="price-line__label">Platform fee</span>
              <span class="price-line__val">{{ platformFee.toFixed(2) }} TND</span>
            </div>
            <div class="price-divider my-2"></div>
            <div class="total-big-row">
              <span class="total-big-label">TOTAL TO PAY</span>
              <span class="total-big-val">{{ totalPrice.toFixed(2) }} TND</span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <v-card class="retro-card mb-3" elevation="0">
          <v-card-text class="pa-4">
            <div class="review-section-label mb-2">PAYMENT METHOD</div>
            <v-radio-group v-model="form.paymentMethod" hide-details>
              <v-radio value="pickup" color="#FF4DA6" class="payment-option mb-2">
                <template #label>
                  <div class="payment-label-wrap">
                    <div class="payment-label-title">
                      <v-icon size="16" class="mr-1">mdi-handshake</v-icon>
                      Pay on Pickup
                    </div>
                    <span class="demo-badge">DEMO MODE</span>
                  </div>
                </template>
              </v-radio>
              <v-radio value="card" color="#FF4DA6" class="payment-option">
                <template #label>
                  <div class="payment-label-wrap">
                    <div class="payment-label-title">
                      <v-icon size="16" class="mr-1">mdi-credit-card</v-icon>
                      Pay Now (Card)
                    </div>
                    <span class="demo-badge">DEMO MODE</span>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- Terms -->
        <div class="terms-row mb-4">
          <v-checkbox
            v-model="form.termsAccepted"
            color="#FF4DA6"
            hide-details
            class="terms-check"
          >
            <template #label>
              <span class="terms-text">I confirm the package contains no prohibited items and agree to the CarryIt terms of service</span>
            </template>
          </v-checkbox>
        </div>

        <div class="step-nav-row">
          <v-btn variant="outlined" class="back-step-btn" @click="currentStep = 2">
            <v-icon class="mr-1">mdi-arrow-left</v-icon> BACK
          </v-btn>
          <v-btn
            class="retro-btn flex-1 ml-3"
            size="large"
            :disabled="!canConfirm"
            :loading="submitting"
            @click="handleConfirm"
          >
            <v-icon left class="mr-2">mdi-check-bold</v-icon>
            CONFIRM BOOKING
          </v-btn>
        </div>
      </div>

    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { useBookingsStore } from '@/stores/bookings'
import { mockTrips, screenDescription } from '@/data/mock.js'

const router = useRouter()
const route = useRoute()
const tripsStore = useTripsStore()
const bookingsStore = useBookingsStore()

const currentStep = ref(1)
const submitting = ref(false)
const prohibitedWarning = ref('')

const stepLabels = ['Package', 'Details', 'Confirm']

const categories = [
  { value: 'documents', label: 'Documents', icon: '📄' },
  { value: 'clothing', label: 'Books & Clothing', icon: '👕' },
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'food', label: 'Food & Gifts', icon: '🎁' },
  { value: 'cosmetics', label: 'Cosmetics', icon: '💄' },
  { value: 'other', label: 'Other', icon: '📦' },
]

const form = ref({
  category: '',
  description: '',
  isFragile: false,
  declaredValue: '',
  weight: 5,
  specialInstructions: '',
  pickupDetails: '',
  paymentMethod: 'pickup',
  termsAccepted: false,
})

const trip = computed(() => {
  const id = route.params.tripId
  const fromStore = tripsStore.searchResults?.find(t => String(t.id) === String(id))
  if (fromStore) return fromStore
  return (mockTrips || []).find(t => String(t.id) === String(id)) || {
    id, travelerName: 'Unknown', trustScore: 4.5, travelerId: 'u1',
    origin: '—', destination: '—', departureDate: '', pricePerKg: 15,
    availableKg: 10
  }
})

const maxWeight = computed(() => Math.min(trip.value.availableKg || 10, 30))
const basePrice = computed(() => form.value.weight * (trip.value.pricePerKg || 15))
const platformFee = computed(() => basePrice.value * 0.10)
const totalPrice = computed(() => basePrice.value + platformFee.value)

const canProceedStep1 = computed(() =>
  form.value.category &&
  form.value.description.length >= 20 &&
  !prohibitedWarning.value
)

const canProceedStep2 = computed(() => form.value.weight > 0)

const canConfirm = computed(() =>
  form.value.paymentMethod &&
  form.value.termsAccepted
)

onMounted(() => {
  const qWeight = parseFloat(route.query.weight)
  if (qWeight && !isNaN(qWeight)) {
    form.value.weight = Math.min(qWeight, maxWeight.value)
  } else if (tripsStore.searchParams?.weight) {
    form.value.weight = Math.min(tripsStore.searchParams.weight, maxWeight.value)
  }
})

function checkProhibited(val) {
  if (!val || val.length < 5) { prohibitedWarning.value = ''; return }
  try {
    const result = screenDescription(val)
    prohibitedWarning.value = result?.flagged ? result.reason : ''
  } catch {
    prohibitedWarning.value = ''
  }
}

function getCategoryLabel(val) {
  return categories.find(c => c.value === val)?.label || val
}

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return d }
}

function handleBack() {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.back()
  }
}

async function handleConfirm() {
  submitting.value = true
  try {
    const booking = await bookingsStore.createBooking({
      tripId: trip.value.id,
      weight: form.value.weight,
      category: form.value.category,
      description: form.value.description,
      isFragile: form.value.isFragile,
      declaredValue: form.value.declaredValue,
      specialInstructions: form.value.specialInstructions,
      pickupDetails: form.value.pickupDetails,
      paymentMethod: form.value.paymentMethod,
      totalPrice: totalPrice.value,
    })
    const bookingId = booking?.id || booking?.data?.id || 'new'
    router.push(`/sender/booking/${bookingId}/confirmation`)
  } catch (e) {
    console.error(e)
    router.push(`/sender/booking/demo/confirmation`)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&family=VT323&display=swap');

.booking-page { font-family: 'Archivo', sans-serif; }

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FAFAF7;
  border-bottom: 2px solid #0A0A0A;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 16px;
}

.back-btn {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
}

.step-indicator { max-width: 480px; margin: 0 auto; }

.step-labels {
  display: flex;
  justify-content: space-between;
}

.step-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 4px;
}

.step-label--active { color: #FF4DA6; }
.step-label--done { color: #3D5B3E; }

.step-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
}

.progress-track {
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  border: 1px solid #0A0A0A;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #FF4DA6;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.step-counter { text-align: right; }
.mono-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #888;
}

.content-wrapper {
  max-width: 480px;
  margin: 0 auto;
}

.pb-24 { padding-bottom: 32px; }

.section-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 20px;
  color: #0A0A0A;
}

.category-label, .field-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #0A0A0A;
}

.required { color: #FF4DA6; }

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.category-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  border-radius: 4px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s;
}

.category-card:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #0A0A0A;
}

.category-card--selected {
  border-color: #FF4DA6 !important;
  box-shadow: 3px 3px 0 #FF4DA6 !important;
  background: #fff0f7 !important;
}

.category-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 4px;
}

.category-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  color: #0A0A0A;
  display: block;
}

.retro-input :deep(.v-field) {
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  font-family: 'Archivo', sans-serif;
  background: #FAFAF7;
}

.retro-input :deep(.v-field--focused) {
  border-color: #FF4DA6;
}

.char-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #888;
  text-align: right;
}

.prohibited-box {
  background: #fff5f5;
  border: 2px solid #ff1744;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 3px 3px 0 #ff1744;
}

.prohibited-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff1744;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.prohibited-reason {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: #cc0000;
  margin: 0 0 4px;
}

.prohibited-note {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  padding: 12px;
}

.toggle-sub {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.retro-btn {
  background: #FF4DA6 !important;
  color: #0A0A0A !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 4px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 900 !important;
  font-size: 14px !important;
}

.retro-btn:disabled {
  opacity: 0.5 !important;
}

.trip-summary-card {
  background: #141a14;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  border-radius: 4px;
  padding: 12px;
}

.trip-summary__route {
  display: flex;
  align-items: center;
}

.summary-city {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 20px;
  color: #A3D977;
}

.trip-summary__meta {
  margin-top: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #A3D977;
  opacity: 0.7;
  display: flex;
  align-items: center;
}

.weight-display-sm {
  display: flex;
  align-items: baseline;
  gap: 6px;
  background: #141a14;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  padding: 8px 12px;
}

.lcd-weight-sm {
  font-family: 'VT323', monospace;
  font-size: 40px;
  color: #A3D977;
  text-shadow: 0 0 8px #A3D977;
}

.lcd-unit-sm {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #A3D977;
  opacity: 0.7;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #888;
}

.lcd-card {
  background: #141a14;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 4px;
}

.lcd-card__header {
  background: #0a0f0a;
  padding: 6px 14px;
  border-bottom: 1px solid #2a3a2a;
  display: flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #A3D977;
}

.price-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.price-line__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #A3D977;
  opacity: 0.8;
}

.price-line__val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #A3D977;
  font-weight: 700;
}

.price-divider { border-top: 1px solid #2a3a2a; }

.price-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-total-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #A3D977;
}

.price-total-val {
  font-family: 'VT323', monospace;
  font-size: 28px;
  color: #A3D977;
  text-shadow: 0 0 6px #A3D977;
}

.step-nav-row {
  display: flex;
  align-items: center;
}

.back-step-btn {
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
  border-radius: 4px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
}

.flex-1 { flex: 1; }

.retro-card {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 4px 4px 0 #0A0A0A !important;
  border-radius: 4px !important;
}

.review-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #FF4DA6;
}

.review-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.review-key {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #888;
  flex-shrink: 0;
  margin-right: 12px;
}

.review-val {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: #0A0A0A;
  text-align: right;
}

.trust-inline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #FF4DA6;
}

.fragile-badge {
  color: #FF9800;
}

.total-big-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-big-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #A3D977;
}

.total-big-val {
  font-family: 'VT323', monospace;
  font-size: 36px;
  color: #FF4DA6;
  text-shadow: 0 0 6px rgba(255, 77, 166, 0.4);
}

.payment-option {
  background: #FAFAF7;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 8px;
}

.payment-option :deep(.v-selection-control--dirty) {
  border-color: #FF4DA6;
}

.payment-label-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.payment-label-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.demo-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  background: #FF4DA6;
  color: #0A0A0A;
  padding: 2px 6px;
  border-radius: 2px;
  border: 1px solid #0A0A0A;
  white-space: nowrap;
}

.terms-row {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  padding: 8px;
}

.terms-text {
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #0A0A0A;
  line-height: 1.4;
}
</style>
