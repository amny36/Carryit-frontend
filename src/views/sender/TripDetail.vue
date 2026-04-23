<template>
  <v-container fluid class="detail-page pa-0" style="background:#E9DEEA; min-height:100vh;">

    <!-- Top Nav -->
    <div class="top-nav pa-3">
      <v-btn icon size="small" class="back-btn" @click="router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="nav-title">Trip Details</span>
      <v-btn icon size="small" variant="text" class="share-btn">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </div>

    <div class="content-wrapper pa-3 pb-24">

      <!-- TRAVELER CARD -->
      <v-card class="retro-card mb-4" elevation="0">
        <v-card-text class="pa-4">
          <div class="traveler-header">
            <div class="avatar-xl">{{ getInitials(trip.travelerName) }}</div>
            <div class="traveler-details">
              <h2 class="traveler-name">{{ trip.travelerName }}</h2>
              <div class="trust-row">
                <v-icon size="16" color="#FF4DA6">mdi-star</v-icon>
                <span class="trust-score">{{ trip.trustScore }}</span>
                <span class="trust-label">({{ trip.reviewCount || 0 }} reviews)</span>
              </div>
              <div class="badges-row mt-1">
                <span class="kyc-badge">
                  <v-icon size="12" color="#3D5B3E">mdi-check-circle</v-icon>
                  ID Verified
                </span>
              </div>
            </div>
          </div>

          <div class="traveler-stats mt-3">
            <div class="stat-item">
              <span class="stat-val">{{ trip.completedTrips || 0 }}</span>
              <span class="stat-label">Deliveries</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-val">{{ trip.memberSince || '2023' }}</span>
              <span class="stat-label">Member Since</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-val">{{ trip.responseRate || '98' }}%</span>
              <span class="stat-label">Response</span>
            </div>
          </div>

          <v-btn
            block
            variant="outlined"
            class="chat-btn mt-3"
            @click="router.push(`/chat/${trip.travelerId}`)"
          >
            <v-icon left class="mr-2">mdi-chat-outline</v-icon>
            CHAT WITH TRAVELER
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- TRIP DETAILS CARD -->
      <v-card class="retro-card mb-4" elevation="0">
        <div class="card-header-bar">
          <span class="card-header-label">TRIP DETAILS</span>
        </div>
        <v-card-text class="pa-4">
          <!-- Route -->
          <div class="route-display mb-4">
            <div class="route-city origin">{{ trip.origin }}</div>
            <div class="route-arrow">
              <div class="arrow-line"></div>
              <v-icon size="20" :color="getTransportColor(trip.transportMode)">
                {{ getTransportIcon(trip.transportMode) }}
              </v-icon>
              <div class="arrow-line"></div>
            </div>
            <div class="route-city dest">{{ trip.destination }}</div>
          </div>

          <!-- Detail Rows -->
          <div class="detail-row">
            <v-icon size="18" color="#3D5B3E">{{ getTransportIcon(trip.transportMode) }}</v-icon>
            <div>
              <div class="detail-label">TRANSPORT</div>
              <div class="detail-val">{{ trip.transportMode || 'Flight' }}</div>
            </div>
          </div>

          <div class="detail-row">
            <v-icon size="18" color="#3D5B3E">mdi-calendar</v-icon>
            <div>
              <div class="detail-label">DEPARTURE</div>
              <div class="detail-val">{{ formatDate(trip.departureDate) }}</div>
            </div>
          </div>

          <div class="detail-row">
            <v-icon size="18" color="#3D5B3E">mdi-weight-kilogram</v-icon>
            <div>
              <div class="detail-label">AVAILABLE SPACE</div>
              <div class="detail-val">
                <span class="available-kg">{{ trip.availableKg }}</span> kg remaining
              </div>
            </div>
          </div>

          <div class="detail-row" v-if="trip.pickupLocation">
            <v-icon size="18" color="#3D5B3E">mdi-map-marker</v-icon>
            <div>
              <div class="detail-label">PICKUP LOCATION</div>
              <div class="detail-val">{{ trip.pickupLocation }}</div>
            </div>
          </div>

          <div class="detail-row" v-if="trip.restrictions">
            <v-icon size="18" color="#FF4DA6">mdi-alert-circle</v-icon>
            <div>
              <div class="detail-label">RESTRICTIONS</div>
              <div class="detail-val restriction-val">{{ trip.restrictions }}</div>
            </div>
          </div>

          <div v-if="trip.description" class="description-box mt-2">
            <div class="detail-label mb-1">DESCRIPTION</div>
            <p class="description-text">{{ trip.description }}</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- PRICE CALCULATOR -->
      <div class="lcd-card mb-4">
        <div class="lcd-card__header">
          <v-icon size="14" color="#A3D977" class="mr-1">mdi-calculator</v-icon>
          <span>PRICE CALCULATOR</span>
        </div>
        <div class="lcd-card__body pa-4">
          <div class="calc-label mb-1">WEIGHT TO SEND</div>
          <div class="weight-display mb-2">
            <span class="lcd-weight">{{ calcWeight.toFixed(1) }}</span>
            <span class="lcd-unit">KG</span>
          </div>
          <div class="stepper-row mb-3">
            <v-btn icon size="small" class="stepper-btn" @click="adjustWeight(-0.5)" :disabled="calcWeight <= 0.5">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-slider
              v-model="calcWeight"
              :min="0.5"
              :max="maxWeight"
              :step="0.5"
              color="#A3D977"
              track-color="#333"
              thumb-color="#A3D977"
              class="mx-3"
              hide-details
            />
            <v-btn icon size="small" class="stepper-btn" @click="adjustWeight(0.5)" :disabled="calcWeight >= maxWeight">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>

          <!-- Price breakdown -->
          <div class="price-line">
            <span class="price-line__label">Base price ({{ calcWeight }} kg × {{ trip.pricePerKg }} TND)</span>
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
          <div class="payout-note mt-2">
            Traveler receives: {{ travelerPayout.toFixed(2) }} TND
          </div>
        </div>
      </div>

    </div>

    <!-- Book CTA -->
    <div class="book-cta">
      <div class="cta-inner">
        <div class="cta-price">
          <span class="cta-label">Total</span>
          <span class="cta-amount">{{ totalPrice.toFixed(2) }} TND</span>
        </div>
        <v-btn class="retro-btn book-btn" @click="handleBook">
          <v-icon left class="mr-2">mdi-package-variant-closed</v-icon>
          BOOK THIS TRIP
        </v-btn>
      </div>
    </div>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { mockTrips } from '@/data/mock.js'

const router = useRouter()
const route = useRoute()
const tripsStore = useTripsStore()

const calcWeight = ref(5)

const trip = computed(() => {
  const id = route.params.id
  const fromStore = tripsStore.searchResults?.find(t => String(t.id) === String(id))
  if (fromStore) return fromStore
  return (mockTrips || []).find(t => String(t.id) === String(id)) || {
    id,
    travelerName: 'Unknown Traveler',
    trustScore: 4.5,
    reviewCount: 12,
    completedTrips: 8,
    memberSince: '2023',
    responseRate: 95,
    travelerId: 'u1',
    origin: '—',
    destination: '—',
    transportMode: 'Flight',
    departureDate: '',
    availableKg: 10,
    pricePerKg: 15,
    pickupLocation: '',
    restrictions: '',
    description: '',
  }
})

const maxWeight = computed(() => Math.min(trip.value.availableKg || 10, 30))
const basePrice = computed(() => calcWeight.value * (trip.value.pricePerKg || 15))
const platformFee = computed(() => basePrice.value * 0.10)
const totalPrice = computed(() => basePrice.value + platformFee.value)
const travelerPayout = computed(() => basePrice.value * 0.90)

onMounted(() => {
  const searchWeight = tripsStore.searchParams?.weight
  if (searchWeight) {
    calcWeight.value = Math.min(searchWeight, maxWeight.value)
  }
})

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return d }
}

function getTransportIcon(mode) {
  const m = (mode || '').toLowerCase()
  if (m === 'plane' || m === 'flight') return 'mdi-airplane'
  if (m === 'train') return 'mdi-train'
  if (m === 'car') return 'mdi-car'
  return 'mdi-truck-delivery'
}

function getTransportColor(mode) {
  const m = (mode || '').toLowerCase()
  if (m === 'plane' || m === 'flight') return '#3D5B3E'
  if (m === 'train') return '#FF4DA6'
  return '#888'
}

function adjustWeight(delta) {
  const next = Math.round((calcWeight.value + delta) * 2) / 2
  calcWeight.value = Math.max(0.5, Math.min(maxWeight.value, next))
}

function handleBook() {
  router.push({
    path: `/sender/book/${trip.value.id}`,
    query: { weight: calcWeight.value }
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&family=VT323&display=swap');

.detail-page {
  font-family: 'Archivo', sans-serif;
}

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

.back-btn, .share-btn {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
}

.content-wrapper {
  max-width: 480px;
  margin: 0 auto;
}

.pb-24 { padding-bottom: 96px; }

.retro-card {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 4px 4px 0 #0A0A0A !important;
  border-radius: 4px !important;
}

.card-header-bar {
  background: #0A0A0A;
  padding: 6px 14px;
  border-radius: 2px 2px 0 0;
}

.card-header-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #A3D977;
}

.traveler-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.avatar-xl {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #FF4DA6;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: #0A0A0A;
  flex-shrink: 0;
}

.traveler-name {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: #0A0A0A;
  line-height: 1.1;
}

.trust-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.trust-score {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  color: #FF4DA6;
}

.trust-label {
  font-size: 12px;
  color: #888;
}

.kyc-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  background: #e8f5e9;
  color: #3D5B3E;
  border: 1.5px solid #3D5B3E;
  border-radius: 3px;
  padding: 2px 8px;
}

.traveler-stats {
  display: flex;
  align-items: center;
  background: #E9DEEA;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  padding: 10px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-val {
  display: block;
  font-family: 'VT323', monospace;
  font-size: 26px;
  color: #0A0A0A;
  line-height: 1;
}

.stat-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #666;
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #0A0A0A;
  margin: 0 8px;
}

.chat-btn {
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 4px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
  color: #0A0A0A !important;
}

.route-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.route-city {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 26px;
  color: #0A0A0A;
}

.route-arrow {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-line {
  flex: 1;
  height: 2px;
  background: #ccc;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-of-type {
  border-bottom: none;
}

.detail-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #888;
}

.detail-val {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #0A0A0A;
}

.available-kg {
  font-family: 'VT323', monospace;
  font-size: 24px;
  color: #3D5B3E;
}

.restriction-val {
  color: #FF4DA6;
}

.description-box {
  background: #E9DEEA;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.description-text {
  font-size: 13px;
  color: #444;
  line-height: 1.5;
  margin: 0;
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

.calc-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: #A3D977;
  opacity: 0.7;
}

.weight-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.lcd-weight {
  font-family: 'VT323', monospace;
  font-size: 56px;
  color: #A3D977;
  line-height: 1;
  text-shadow: 0 0 10px #A3D977;
}

.lcd-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: #A3D977;
  opacity: 0.7;
}

.stepper-row {
  display: flex;
  align-items: center;
}

.stepper-btn {
  background: #1e2a1e !important;
  border: 1px solid #A3D977 !important;
  color: #A3D977 !important;
  border-radius: 4px !important;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.price-divider {
  border-top: 1px solid #2a3a2a;
}

.price-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-total-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #A3D977;
}

.price-total-val {
  font-family: 'VT323', monospace;
  font-size: 32px;
  color: #A3D977;
  text-shadow: 0 0 8px #A3D977;
}

.payout-note {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #A3D977;
  opacity: 0.5;
  text-align: right;
}

.book-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FAFAF7;
  border-top: 2px solid #0A0A0A;
  padding: 12px 16px;
  z-index: 20;
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 480px;
  margin: 0 auto;
}

.cta-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #888;
}

.cta-amount {
  display: block;
  font-family: 'VT323', monospace;
  font-size: 28px;
  color: #0A0A0A;
  line-height: 1;
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

.book-btn {
  font-size: 15px !important;
  padding: 0 20px !important;
}
</style>
