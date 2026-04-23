<template>
  <div class="earnings-page has-bottom-nav">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">My Earnings</h1>
      <p class="page-subtitle">Track your cargo income</p>
    </div>

    <!-- Summary Stats Row -->
    <div class="stats-grid">
      <div class="stat-card">
        <v-icon size="22" color="#E8A94A" class="stat-icon">mdi-cash-multiple</v-icon>
        <span class="stat-label">Total Earned</span>
        <span class="stat-value amber">{{ totalEarned }} TND</span>
        <div class="stat-bottom-border"></div>
      </div>
      <div class="stat-card">
        <v-icon size="22" color="#FF4DA6" class="stat-icon">mdi-airplane-takeoff</v-icon>
        <span class="stat-label">Trips Done</span>
        <span class="stat-value">{{ tripsCount }}</span>
        <div class="stat-bottom-border"></div>
      </div>
      <div class="stat-card">
        <v-icon size="22" color="#3D5B3E" class="stat-icon">mdi-chart-line</v-icon>
        <span class="stat-label">Avg / Trip</span>
        <span class="stat-value">{{ avgPerTrip }} TND</span>
        <div class="stat-bottom-border"></div>
      </div>
    </div>

    <!-- Monthly Earnings Chart -->
    <div class="retro-card chart-card">
      <h3 class="card-title">Monthly Earnings</h3>
      <div class="bar-chart">
        <div
          v-for="(entry, i) in mockEarnings"
          :key="i"
          class="bar-row"
        >
          <span class="bar-month">{{ entry.month }}</span>
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{
                width: barsAnimated ? barWidth(entry.amount) : '0%'
              }"
              :title="`${entry.amount} TND`"
            >
              <span class="bar-tooltip">{{ entry.amount }} TND</span>
            </div>
          </div>
          <span class="bar-amount">{{ entry.amount }}</span>
        </div>
      </div>
    </div>

    <!-- Trip History Table -->
    <div class="retro-card table-card">
      <div class="table-header-row">
        <h3 class="card-title">Completed Trips</h3>
        <div class="filter-chips">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-chip"
            :class="{ active: activeFilter === f.value }"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div class="trip-table">
        <!-- Table Header -->
        <div class="trip-row trip-header">
          <span>Route</span>
          <span>Date</span>
          <span>Kg</span>
          <span>Earned</span>
        </div>

        <!-- Table Rows -->
        <div
          v-for="(trip, i) in filteredTrips"
          :key="i"
          class="trip-row"
        >
          <span class="trip-route">
            {{ trip.origin?.slice(0, 3).toUpperCase() }}→{{ trip.destination?.slice(0, 3).toUpperCase() }}
          </span>
          <span class="trip-date">{{ formatDate(trip.date || trip.tripDate) }}</span>
          <span class="trip-kg">{{ trip.weight || trip.kg || '—' }}</span>
          <span class="trip-earned">{{ trip.earned || trip.price || '—' }}</span>
        </div>

        <!-- Empty -->
        <div v-if="filteredTrips.length === 0" class="trip-empty">
          No trips for this period.
        </div>

        <!-- Total Row -->
        <div v-if="filteredTrips.length > 0" class="trip-row trip-total">
          <span>Total</span>
          <span></span>
          <span>{{ totalKg }} kg</span>
          <span>{{ totalFilteredEarned }} TND</span>
        </div>
      </div>
    </div>

    <!-- Payout Section -->
    <div class="lcd-payout-card">
      <div class="payout-balance">
        <span class="payout-label">AVAILABLE BALANCE</span>
        <span class="payout-amount">{{ availableBalance }} TND</span>
      </div>
      <button class="retro-btn-green" @click="requestPayout">
        <v-icon size="16" class="mr-2">mdi-bank-transfer</v-icon>
        Request Payout
      </button>
      <p class="payout-note">Demo mode — payouts are simulated</p>
    </div>

    <!-- Trust Score Card -->
    <div class="retro-card trust-card">
      <h3 class="card-title">Trust Score</h3>
      <div class="trust-main">
        <div class="trust-star">
          <v-icon size="40" color="#E8A94A">mdi-star</v-icon>
          <span class="trust-score-value">{{ trustScore }}</span>
        </div>
        <div class="trust-details">
          <TrustScore :score="trustScore" show-label />
          <div class="trust-bar-track">
            <div class="trust-bar-fill" :style="{ width: (trustScore / 5 * 100) + '%' }"></div>
          </div>
          <span class="trust-level">Trusted Carrier ⭐</span>
        </div>
      </div>

      <!-- Mini Reviews -->
      <div class="reviews-list">
        <div v-for="(review, i) in fakeReviews" :key="i" class="review-item">
          <div class="review-header">
            <span class="review-name">{{ review.name }}</span>
            <div class="review-stars">
              <v-icon v-for="s in 5" :key="s" size="12" color="#E8A94A">mdi-star</v-icon>
            </div>
          </div>
          <p class="review-comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { mockBookings, mockEarnings } from '@/data/mock.js'
import TrustScore from '@/components/TrustScore.vue'

const authStore = useAuthStore()

const barsAnimated = ref(false)
const activeFilter = ref('all')

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const filters = [
  { value: 'all', label: 'All' },
  { value: 'month', label: 'This Month' },
  { value: '3months', label: 'Last 3 Months' }
]

const trustScore = ref(4.7)

const fakeReviews = [
  {
    name: 'Sarah M.',
    comment: 'Super reliable! Package arrived perfectly on time. Will definitely use again.'
  },
  {
    name: 'Ahmed K.',
    comment: 'Great communication throughout the whole trip. Very trustworthy carrier!'
  },
  {
    name: 'Lena B.',
    comment: 'Handled my fragile items with care. Highly recommend.'
  }
]

const myBookings = computed(() => {
  const userId = authStore.user?.id || 'u1'
  return mockBookings.filter(b => b.travelerId === userId && b.status === 'delivered')
})

const totalEarned = computed(() => {
  return myBookings.value.reduce((sum, b) => sum + Number(b.earned || b.price || 0), 0) || 840
})

const tripsCount = computed(() => myBookings.value.length || 12)

const avgPerTrip = computed(() => {
  const count = tripsCount.value
  if (!count) return 0
  return Math.round(totalEarned.value / count) || 70
})

const availableBalance = computed(() => Math.round(totalEarned.value * 0.9) || 756)

const maxEarning = computed(() => {
  if (!mockEarnings || !mockEarnings.length) return 1
  return Math.max(...mockEarnings.map(e => e.amount || 0)) || 1
})

function barWidth(amount) {
  return Math.max(4, (amount / maxEarning.value) * 100) + '%'
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short'
  })
}

const filteredTrips = computed(() => {
  const now = new Date()
  if (activeFilter.value === 'month') {
    return myBookings.value.filter(b => {
      const d = new Date(b.date || b.tripDate || 0)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }
  if (activeFilter.value === '3months') {
    const cutoff = new Date(now)
    cutoff.setMonth(cutoff.getMonth() - 3)
    return myBookings.value.filter(b => new Date(b.date || b.tripDate || 0) >= cutoff)
  }
  return myBookings.value
})

const totalKg = computed(() =>
  filteredTrips.value.reduce((sum, t) => sum + Number(t.weight || t.kg || 0), 0)
)

const totalFilteredEarned = computed(() =>
  filteredTrips.value.reduce((sum, t) => sum + Number(t.earned || t.price || 0), 0)
)

function requestPayout() {
  snackbar.value = {
    show: true,
    message: 'Payout requested! Processing within 3-5 business days.',
    color: 'success'
  }
}

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    barsAnimated.value = true
  }, 200)
})
</script>

<style scoped>
.earnings-page {
  min-height: 100vh;
  background: #FAFAF7;
  font-family: 'Archivo', sans-serif;
  padding-bottom: 100px;
}

.has-bottom-nav {
  padding-bottom: 100px;
}

/* Header */
.page-header {
  padding: 56px 20px 16px;
  background: linear-gradient(180deg, #ffffff 0%, #FAFAF7 100%);
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 16px 16px;
}

.stat-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  padding: 16px 12px 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  margin-bottom: 2px;
}

.stat-label {
  font-size: 10px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #0A0A0A;
  line-height: 1;
}

.stat-value.amber {
  color: #E8A94A;
}

.stat-bottom-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #FF4DA6;
}

/* Retro Card Base */
.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  padding: 20px;
  margin: 0 16px 16px;
}

.card-title {
  font-size: 15px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-month {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #555;
  width: 32px;
  flex-shrink: 0;
  text-transform: uppercase;
}

.bar-track {
  flex: 1;
  height: 20px;
  background: #e8e8e0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF4DA6 0%, #E8A94A 100%);
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
}

.bar-fill:hover .bar-tooltip {
  opacity: 1;
}

.bar-tooltip {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
  white-space: nowrap;
  pointer-events: none;
}

.bar-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #888;
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}

/* Trip Table */
.table-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;
  flex-wrap: wrap;
}

.table-header-row .card-title {
  margin: 0;
}

.filter-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 4px 10px;
  border: 2px solid #0A0A0A;
  border-radius: 14px;
  background: #FAFAF7;
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 #0A0A0A;
  transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
}

.filter-chip:active,
.filter-chip.active {
  transform: translate(2px, 2px);
  box-shadow: none;
  background: #FF4DA6;
  color: white;
}

.trip-table {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.trip-row {
  display: grid;
  grid-template-columns: 2fr 1.4fr 0.7fr 1fr;
  gap: 4px;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.trip-row:last-child {
  border-bottom: none;
}

.trip-header {
  background: #0A0A0A;
  color: #A3D977;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.trip-route {
  font-weight: 700;
  color: #0A0A0A;
  letter-spacing: 0.5px;
}

.trip-date {
  color: #888;
}

.trip-kg {
  color: #555;
}

.trip-earned {
  color: #3D5B3E;
  font-weight: 700;
}

.trip-total {
  background: #f5f5f0;
  font-weight: 800;
  color: #0A0A0A;
  border-top: 2px solid #0A0A0A;
}

.trip-empty {
  padding: 20px;
  text-align: center;
  color: #aaa;
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
}

/* LCD Payout Card */
.lcd-payout-card {
  background: #141a14;
  border-radius: 12px;
  padding: 24px 20px;
  margin: 0 16px 16px;
  border: 2px solid #2a3a2a;
  box-shadow: 4px 4px 0 #0A0A0A;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.payout-balance {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payout-label {
  font-family: 'VT323', monospace;
  font-size: 14px;
  color: #A3D977;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
}

.payout-amount {
  font-family: 'VT323', monospace;
  font-size: 42px;
  color: #A3D977;
  letter-spacing: 3px;
  line-height: 1;
  text-shadow: 0 0 12px rgba(163, 217, 119, 0.4);
}

.retro-btn-green {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: #3D5B3E;
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  box-shadow: 3px 3px 0 rgba(0,0,0,0.4);
  border-radius: 8px;
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.retro-btn-green:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.payout-note {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #4a6a4a;
  margin: 0;
}

/* Trust Card */
.trust-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.trust-star {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.trust-score-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  color: #E8A94A;
}

.trust-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trust-bar-track {
  height: 8px;
  background: #e8e8e0;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ccc;
}

.trust-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #E8A94A 0%, #FF4DA6 100%);
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.trust-level {
  font-size: 13px;
  font-weight: 700;
  color: #3D5B3E;
}

/* Reviews */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.review-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 14px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.review-name {
  font-size: 13px;
  font-weight: 700;
  color: #0A0A0A;
}

.review-stars {
  display: flex;
  gap: 1px;
}

.review-comment {
  font-size: 13px;
  color: #555;
  margin: 0;
  line-height: 1.5;
}
</style>
