<template>
  <div class="confirmation-page">
    <!-- Animated Success Icon -->
    <div class="success-icon-wrapper">
      <div class="success-circle" :class="{ animate: mounted }">
        <v-icon size="40" color="white">mdi-check</v-icon>
      </div>
    </div>

    <!-- Heading -->
    <h1 class="confirm-title">Booking Confirmed!</h1>
    <p class="confirm-subtitle">Your package is on its way soon.</p>

    <!-- LCD Dark Card -->
    <div class="lcd-card">
      <div class="lcd-row">
        <span class="lcd-label">BOOKING ID</span>
        <span class="lcd-value booking-id">{{ formattedBookingId }}</span>
      </div>

      <div class="lcd-divider"></div>

      <div class="lcd-row">
        <span class="lcd-label">PICKUP CODE</span>
        <span class="lcd-pickup-code">{{ pickupCode }}</span>
      </div>

      <div class="lcd-divider"></div>

      <div class="lcd-row route-row">
        <span class="lcd-route">
          {{ booking?.origin || 'Origin' }}
          <span class="route-arrow">→</span>
          {{ booking?.destination || 'Destination' }}
        </span>
      </div>

      <div class="lcd-row">
        <span class="lcd-small-label">Traveler</span>
        <span class="lcd-small-value">{{ booking?.travelerName || 'Assigned Traveler' }}</span>
      </div>

      <div class="lcd-row">
        <span class="lcd-small-label">Date</span>
        <span class="lcd-small-value">{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Info Box -->
    <div class="info-box">
      <v-icon color="#E8A94A" size="18" class="mr-2">mdi-information-outline</v-icon>
      <span>Show your pickup code to the traveler when you meet</span>
    </div>

    <!-- What Happens Next Accordion -->
    <div class="next-steps-section">
      <h3 class="next-steps-title">What happens next</h3>
      <div class="next-steps-list">
        <div
          v-for="(step, i) in nextSteps"
          :key="i"
          class="next-step-item"
          @click="toggleStep(i)"
        >
          <div class="step-header">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div v-if="openStep === i" class="step-desc">{{ step.desc }}</div>
            </div>
            <v-icon size="18" color="#888">
              {{ openStep === i ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="retro-btn-primary" @click="trackBooking">
        Track My Booking
      </button>
      <button class="retro-btn-ghost" @click="viewAllBookings">
        View All Bookings
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import { mockBookings } from '@/data/mock.js'

const router = useRouter()
const route = useRoute()
const bookingsStore = useBookingsStore()

const mounted = ref(false)
const openStep = ref(0)

const booking = computed(() => {
  const id = route.params.id
  return bookingsStore.currentBooking
    || mockBookings.find(b => b.id === id)
    || mockBookings[0]
})

const formattedBookingId = computed(() => {
  const id = booking.value?.id || 'BK00000001'
  return 'B-' + String(id).replace(/^B-?/, '').toUpperCase().padStart(8, '0')
})

const pickupCode = computed(() => {
  return booking.value?.pickupCode || 'PCK-' + Math.random().toString(36).substring(2, 6).toUpperCase()
})

const formattedDate = computed(() => {
  const date = booking.value?.date || booking.value?.tripDate || new Date().toISOString()
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

const nextSteps = [
  { title: 'Traveler will confirm', desc: "You'll get a notification once the traveler accepts your booking." },
  { title: 'Meet at pickup', desc: 'Share your pickup code when you meet the traveler at the agreed location.' },
  { title: 'Track live', desc: 'Get real-time updates as your package travels to its destination.' },
  { title: 'Rate experience', desc: 'After delivery, rate the traveler to help the community.' }
]

function toggleStep(i) {
  openStep.value = openStep.value === i ? -1 : i
}

function trackBooking() {
  const id = booking.value?.id || route.params.id
  router.push(`/sender/tracking/${id}`)
}

function viewAllBookings() {
  router.push('/sender/bookings')
}

onMounted(() => {
  setTimeout(() => { mounted.value = true }, 100)
})
</script>

<style scoped>
.confirmation-page {
  min-height: 100vh;
  background: #E9DEEA;
  padding: 40px 20px 60px;
  font-family: 'Archivo', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  margin: 0 auto;
}

/* Success Icon */
.success-icon-wrapper {
  margin-bottom: 24px;
  margin-top: 20px;
}

.success-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #3D5B3E;
  border: 3px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-circle.animate {
  transform: scale(1);
}

/* Headings */
.confirm-title {
  font-family: 'Archivo', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0A0A0A;
  text-align: center;
  margin: 0 0 8px;
}

.confirm-subtitle {
  font-size: 16px;
  color: #555;
  text-align: center;
  margin: 0 0 28px;
}

/* LCD Card */
.lcd-card {
  width: 100%;
  background: #141a14;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  border: 2px solid #2a3a2a;
  box-shadow: 4px 4px 0 #0A0A0A;
}

.lcd-row {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lcd-label {
  font-family: 'VT323', monospace;
  font-size: 13px;
  color: #A3D977;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
}

.lcd-value.booking-id {
  font-family: 'VT323', monospace;
  font-size: 28px;
  color: #A3D977;
  letter-spacing: 3px;
}

.lcd-pickup-code {
  font-family: 'VT323', monospace;
  font-size: 48px;
  color: white;
  letter-spacing: 4px;
  line-height: 1;
  text-shadow: 0 0 12px #A3D977, 0 0 24px rgba(163, 217, 119, 0.4);
}

.lcd-divider {
  height: 1px;
  background: #A3D977;
  opacity: 0.25;
  margin: 8px 0 12px;
}

.route-row {
  margin-bottom: 12px;
}

.lcd-route {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  color: #A3D977;
  letter-spacing: 1px;
  font-weight: 600;
}

.route-arrow {
  margin: 0 8px;
  opacity: 0.7;
}

.lcd-small-label {
  font-family: 'VT323', monospace;
  font-size: 12px;
  color: #A3D977;
  opacity: 0.7;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.lcd-small-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #e0e0e0;
}

/* Info Box */
.info-box {
  width: 100%;
  background: rgba(232, 169, 74, 0.15);
  border: 2px solid #E8A94A;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  color: #0A0A0A;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.4;
}

/* Next Steps */
.next-steps-section {
  width: 100%;
  margin-bottom: 28px;
}

.next-steps-title {
  font-family: 'Archivo', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 12px;
}

.next-steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.next-step-item {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #0A0A0A;
  transition: transform 0.1s, box-shadow 0.1s;
}

.next-step-item:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FF4DA6;
  color: white;
  font-weight: 800;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 700;
  font-size: 14px;
  color: #0A0A0A;
}

.step-desc {
  font-size: 13px;
  color: #666;
  margin-top: 6px;
  line-height: 1.5;
}

/* Action Buttons */
.action-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.retro-btn-primary {
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
  letter-spacing: 0.3px;
}

.retro-btn-primary:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.retro-btn-ghost {
  width: 100%;
  padding: 16px;
  background: transparent;
  color: #0A0A0A;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  border-radius: 8px;
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.retro-btn-ghost:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
