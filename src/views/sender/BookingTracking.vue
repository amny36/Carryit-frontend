<template>
  <div class="tracking-page has-bottom-nav">

    <!-- Header -->
    <div class="tracking-header">
      <button class="back-btn" @click="router.back()">
        <v-icon color="#0A0A0A">mdi-arrow-left</v-icon>
      </button>
      <div class="header-text">
        <h1 class="header-title">Tracking Package</h1>
        <p class="header-route">
          <span v-if="booking">{{ booking.origin }} → {{ booking.destination }}</span>
          <span v-else>Loading route...</span>
        </p>
      </div>
    </div>

    <div v-if="!booking" class="loading-wrapper">
      <LoadingSpinner />
    </div>

    <div v-else class="tracking-content">

      <!-- Compact Booking Info Card -->
      <div class="retro-card info-card">
        <div class="info-top">
          <div class="traveler-row">
            <div class="traveler-avatar">
              <span>{{ travelerInitials }}</span>
            </div>
            <div class="traveler-details">
              <span class="traveler-name">{{ booking.travelerName || 'Traveler' }}</span>
              <TrustScore :score="booking.travelerScore || 4.7" />
            </div>
          </div>
          <div class="pickup-badge">
            <span class="pickup-label">CODE</span>
            <span class="pickup-value">{{ booking.pickupCode || 'PCK-????' }}</span>
          </div>
        </div>
        <div class="package-row">
          <v-icon size="18" color="#FF4DA6" class="mr-2">mdi-package-variant-closed</v-icon>
          <span class="package-desc">{{ truncate(booking.packageDescription || 'Package', 50) }}</span>
        </div>
      </div>

      <!-- Delivery Timeline -->
      <div class="retro-card timeline-card">
        <h3 class="card-title">Delivery Timeline</h3>
        <div class="timeline">
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="timeline-step"
          >
            <!-- Dot -->
            <div class="step-dot-col">
              <div
                class="step-dot"
                :class="{
                  done: step.status === 'done',
                  active: step.status === 'active',
                  pending: step.status === 'pending'
                }"
              >
                <v-icon v-if="step.status === 'done'" size="14" color="white">mdi-check</v-icon>
                <div v-else-if="step.status === 'active'" class="pulse-dot"></div>
              </div>
              <div
                v-if="i < steps.length - 1"
                class="step-line"
                :class="{
                  solid: step.status === 'done',
                  dashed: step.status === 'active',
                  gray: step.status === 'pending'
                }"
              ></div>
            </div>

            <!-- Content -->
            <div class="step-content" :class="{ 'step-active': step.status === 'active' }">
              <span class="step-label">{{ step.label }}</span>
              <span v-if="step.sublabel" class="step-sublabel">{{ step.sublabel }}</span>
              <span v-if="step.timestamp" class="step-timestamp">{{ step.timestamp }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Placeholder Card -->
      <div class="map-card">
        <div class="map-header">
          <span class="map-title">Route</span>
          <div class="live-badge">
            <div class="live-dot"></div>
            <span>LIVE TRACKING</span>
          </div>
        </div>

        <!-- Map Visual -->
        <div class="map-visual">
          <div class="map-origin">
            <div class="map-dot origin-dot"></div>
            <span class="map-label">{{ booking.origin || 'Origin' }}</span>
          </div>

          <div class="map-path">
            <svg class="path-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
              <path
                d="M 10 20 Q 100 5 190 20"
                stroke="#A3D977"
                stroke-width="2"
                stroke-dasharray="6 4"
                fill="none"
                opacity="0.6"
              />
            </svg>
            <div class="moving-dot" :style="{ left: movingDotPosition + '%' }"></div>
          </div>

          <div class="map-destination">
            <div class="map-dot dest-dot"></div>
            <span class="map-label">{{ booking.destination || 'Destination' }}</span>
          </div>
        </div>

        <p class="map-note">Simulated route visualization</p>
      </div>

      <!-- Chat Button -->
      <button class="retro-btn-outline" @click="chatWithTraveler">
        <v-icon size="18" class="mr-2">mdi-message-text</v-icon>
        Chat with Traveler
      </button>

      <!-- Auto-refresh Notice -->
      <p class="refresh-note">
        <v-icon size="12" class="mr-1">mdi-refresh</v-icon>
        Updates every 30 seconds
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import { mockBookings } from '@/data/mock.js'
import TrustScore from '@/components/TrustScore.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const bookingsStore = useBookingsStore()

const booking = ref(null)
const movingDotPosition = ref(10)
let movingInterval = null
let refreshInterval = null

const travelerInitials = computed(() => {
  const name = booking.value?.travelerName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T'
})

const statusOrder = ['pending', 'accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered']

const currentStepIndex = computed(() => {
  const status = booking.value?.status || 'pending'
  const idx = statusOrder.indexOf(status)
  return idx >= 0 ? idx : 0
})

const steps = computed(() => {
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const definitions = [
    { label: 'Booking Confirmed', sublabel: 'Waiting for traveler' },
    { label: 'Traveler Accepted', sublabel: 'Traveler confirmed your package' },
    { label: 'Package Picked Up', sublabel: 'Traveler has your package' },
    { label: 'In Transit', sublabel: 'On the way' },
    { label: 'Out for Delivery', sublabel: 'Almost there!' },
    { label: 'Delivered', sublabel: 'Package delivered successfully' }
  ]

  return definitions.map((def, i) => {
    let status = 'pending'
    let timestamp = null
    if (i < currentStepIndex.value) {
      status = 'done'
      timestamp = now
    } else if (i === currentStepIndex.value) {
      status = 'active'
      timestamp = 'Now'
    }
    return { ...def, status, timestamp }
  })
})

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '...' : str
}

function chatWithTraveler() {
  const travelerId = booking.value?.travelerId || 'u1'
  router.push(`/chat/${travelerId}`)
}

function animateMovingDot() {
  movingInterval = setInterval(() => {
    movingDotPosition.value += 0.4
    if (movingDotPosition.value > 90) movingDotPosition.value = 10
  }, 50)
}

onMounted(() => {
  const id = route.params.id
  booking.value = bookingsStore.currentBooking
    || mockBookings.find(b => b.id === id)
    || mockBookings[0]

  animateMovingDot()

  refreshInterval = setInterval(() => {
    // In production: refresh booking status
  }, 30000)
})

onUnmounted(() => {
  if (movingInterval) clearInterval(movingInterval)
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
.tracking-page {
  min-height: 100vh;
  background: #FAFAF7;
  font-family: 'Archivo', sans-serif;
}

.has-bottom-nav {
  padding-bottom: 100px;
}

/* Header */
.tracking-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 52px 20px 16px;
  background: white;
  border-bottom: 2px solid #e0e0e0;
}

.back-btn {
  width: 40px;
  height: 40px;
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 2px 2px 0 #0A0A0A;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.1s, box-shadow 0.1s;
}

.back-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.header-title {
  font-size: 20px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0;
}

.header-route {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #FF4DA6;
  margin: 2px 0 0;
  font-weight: 600;
}

/* Loading */
.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 80px 20px;
}

/* Content */
.tracking-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 540px;
  margin: 0 auto;
}

/* Retro Card Base */
.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  padding: 20px;
}

.card-title {
  font-size: 15px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Info Card */
.info-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.traveler-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.traveler-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #FF4DA6;
  border: 2px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 16px;
}

.traveler-name {
  display: block;
  font-weight: 700;
  font-size: 15px;
  color: #0A0A0A;
  margin-bottom: 4px;
}

.pickup-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.pickup-label {
  font-family: 'VT323', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: #888;
}

.pickup-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #3D5B3E;
  background: rgba(61, 91, 62, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.package-row {
  display: flex;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

.package-desc {
  font-size: 13px;
  color: #555;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-step {
  display: flex;
  gap: 14px;
  min-height: 60px;
}

.step-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 28px;
}

.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.step-dot.done {
  background: #3D5B3E;
  border-color: #3D5B3E;
}

.step-dot.active {
  background: #FF4DA6;
  border-color: #FF4DA6;
  box-shadow: 0 0 0 4px rgba(255, 77, 166, 0.2);
}

.step-dot.pending {
  background: #f0f0f0;
  border-color: #ccc;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  animation: pulse 1.4s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.7); }
}

.step-line {
  flex: 1;
  width: 2px;
  min-height: 28px;
  margin: 4px 0;
}

.step-line.solid {
  background: #3D5B3E;
}

.step-line.dashed {
  background: repeating-linear-gradient(
    to bottom,
    #FF4DA6 0px, #FF4DA6 6px,
    transparent 6px, transparent 10px
  );
}

.step-line.gray {
  background: #ddd;
}

.step-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  flex: 1;
}

.step-content.step-active .step-label {
  font-weight: 800;
  color: #FF4DA6;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #0A0A0A;
  line-height: 1.6;
}

.step-sublabel {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.step-timestamp {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #aaa;
  margin-top: 2px;
}

/* Map Card */
.map-card {
  background: #141a14;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #2a3a2a;
  box-shadow: 4px 4px 0 #0A0A0A;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.map-title {
  font-family: 'VT323', monospace;
  font-size: 18px;
  color: #A3D977;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'VT323', monospace;
  font-size: 13px;
  color: #A3D977;
  letter-spacing: 1px;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #A3D977;
  animation: blink 1.2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* Map Visual */
.map-visual {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.map-origin,
.map-destination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.map-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
}

.origin-dot {
  background: #A3D977;
  box-shadow: 0 0 8px rgba(163, 217, 119, 0.6);
}

.dest-dot {
  background: #FF4DA6;
  box-shadow: 0 0 8px rgba(255, 77, 166, 0.6);
}

.map-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #A3D977;
  text-align: center;
  letter-spacing: 0.5px;
  max-width: 60px;
  word-break: break-word;
}

.map-path {
  flex: 1;
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}

.path-svg {
  width: 100%;
  height: 40px;
}

.moving-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #FF4DA6;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 0 8px rgba(255, 77, 166, 0.8);
  transition: left 0.05s linear;
}

.map-note {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #4a5a4a;
  text-align: center;
  margin: 0;
}

/* Chat Button */
.retro-btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #0A0A0A;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  border-radius: 8px;
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.retro-btn-outline:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* Refresh Note */
.refresh-note {
  text-align: center;
  font-size: 12px;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}
</style>
