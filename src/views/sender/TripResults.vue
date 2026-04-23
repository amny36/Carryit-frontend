<template>
  <v-container fluid class="results-page pa-0" style="background:#E9DEEA; min-height:100vh;">

    <!-- Search Summary Bar -->
    <div class="summary-bar pa-3">
      <div class="summary-inner">
        <div class="summary-text">
          <span class="route-text">{{ searchParams.origin || '—' }} → {{ searchParams.destination || '—' }}</span>
          <span class="summary-meta">
            <span v-if="searchParams.weight">{{ searchParams.weight }} kg</span>
            <span v-if="searchParams.date"> • {{ formatDate(searchParams.date) }}</span>
          </span>
        </div>
        <v-btn size="small" class="edit-btn" @click="router.push('/sender/search')">
          <v-icon size="14" class="mr-1">mdi-pencil</v-icon>
          EDIT
        </v-btn>
      </div>
    </div>

    <div class="content-wrapper pa-3">
      <!-- Filter / Sort Bar -->
      <div class="filter-bar mb-3">
        <!-- Sort Chips -->
        <div class="filter-row mb-2">
          <span class="filter-label">SORT:</span>
          <div class="chips-scroll">
            <v-chip
              v-for="s in sortOptions"
              :key="s.value"
              :class="['sort-chip mr-2', sort === s.value ? 'sort-chip--active' : '']"
              size="small"
              @click="sort = s.value"
            >
              {{ s.label }}
            </v-chip>
          </div>
        </div>
        <!-- Transport Filter -->
        <div class="filter-row">
          <span class="filter-label">MODE:</span>
          <div class="chips-scroll">
            <v-chip
              v-for="m in modeOptions"
              :key="m.value"
              :class="['mode-chip mr-2', modeFilter === m.value ? 'mode-chip--active' : '']"
              size="small"
              @click="modeFilter = m.value"
            >
              <v-icon start size="12">{{ m.icon }}</v-icon>
              {{ m.label }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Results Header -->
      <div class="results-header mb-3">
        <div class="results-count">
          <span class="count-number">{{ filteredTrips.length }}</span>
          <span class="count-label"> TRIPS FOUND</span>
        </div>
        <v-btn size="small" variant="text" class="refresh-btn" @click="handleRefresh" :loading="refreshing">
          <v-icon size="14" class="mr-1">mdi-refresh</v-icon>
          REFRESH
        </v-btn>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="loading">
        <div v-for="i in 3" :key="i" class="skeleton-card mb-3">
          <div class="skeleton-row mb-3">
            <v-skeleton-loader type="avatar" class="mr-3" />
            <div style="flex:1">
              <v-skeleton-loader type="text" width="60%" class="mb-1" />
              <v-skeleton-loader type="text" width="40%" />
            </div>
          </div>
          <v-skeleton-loader type="text" class="mb-2" />
          <v-skeleton-loader type="text" width="80%" />
        </div>
      </div>

      <!-- Trip List -->
      <div v-else-if="filteredTrips.length > 0">
        <div
          v-for="trip in filteredTrips"
          :key="trip.id"
          class="trip-card retro-card mb-3"
          @click="goToTrip(trip.id)"
        >
          <!-- Traveler Info -->
          <div class="trip-card__header">
            <div class="avatar-circle">{{ getInitials(trip.travelerName || trip.traveler?.name) }}</div>
            <div class="traveler-info">
              <div class="traveler-name">{{ trip.travelerName || trip.traveler?.name }}</div>
              <div class="trust-row">
                <v-icon size="14" color="#FF4DA6">mdi-star</v-icon>
                <span class="trust-val">{{ trip.trustScore || trip.traveler?.trustScore || '4.8' }}</span>
                <span class="verified-badge ml-2" v-if="trip.isVerified || trip.traveler?.isVerified">
                  <v-icon size="10" color="#3D5B3E">mdi-check-decagram</v-icon> Verified
                </span>
              </div>
            </div>
            <div class="trip-price">
              <span class="price-val">{{ getPricePerKg(trip) }}</span>
              <span class="price-label">TND/kg</span>
            </div>
          </div>

          <v-divider class="my-2" />

          <!-- Route -->
          <div class="trip-card__route">
            <div class="route-point">
              <div class="route-city">{{ trip.origin }}</div>
              <div class="route-dot origin-dot"></div>
            </div>
            <div class="route-line">
              <v-icon size="16" :color="getTransportColor(trip.transportMode)">
                {{ getTransportIcon(trip.transportMode) }}
              </v-icon>
            </div>
            <div class="route-point text-right">
              <div class="route-city">{{ trip.destination }}</div>
              <div class="route-dot dest-dot"></div>
            </div>
          </div>

          <!-- Meta -->
          <div class="trip-card__meta mt-2">
            <span class="meta-chip">
              <v-icon size="12">mdi-calendar</v-icon>
              {{ formatDate(trip.departureDate || trip.date) }}
            </span>
            <span class="meta-chip">
              <v-icon size="12">mdi-weight-kilogram</v-icon>
              {{ trip.availableKg || trip.availableSpace }} kg avail.
            </span>
            <span class="meta-chip transport-chip">
              <v-icon size="12">{{ getTransportIcon(trip.transportMode) }}</v-icon>
              {{ trip.transportMode || 'Flight' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-illustration">
          <div class="empty-box">
            <v-icon size="64" color="#FF4DA6">mdi-package-variant-closed-remove</v-icon>
          </div>
        </div>
        <h3 class="empty-title">No trips found</h3>
        <p class="empty-subtitle">Try different dates or cities to find available travelers</p>
        <v-btn class="retro-btn mt-4" @click="router.push('/sender/search')">
          <v-icon left class="mr-2">mdi-magnify</v-icon>
          MODIFY SEARCH
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { mockTrips } from '@/data/mock.js'

const router = useRouter()
const tripsStore = useTripsStore()

const loading = ref(false)
const refreshing = ref(false)
const sort = ref('best')
const modeFilter = ref('all')

const sortOptions = [
  { label: 'Best Match', value: 'best' },
  { label: 'Cheapest', value: 'cheapest' },
  { label: 'Most Trusted', value: 'trusted' },
  { label: 'Soonest', value: 'soonest' },
]

const modeOptions = [
  { label: 'All', value: 'all', icon: 'mdi-dots-horizontal' },
  { label: 'Plane', value: 'plane', icon: 'mdi-airplane' },
  { label: 'Train', value: 'train', icon: 'mdi-train' },
  { label: 'Car', value: 'car', icon: 'mdi-car' },
]

const searchParams = computed(() => tripsStore.searchParams || {})

const rawTrips = computed(() => {
  const results = tripsStore.searchResults
  if (results && results.length > 0) return results
  const params = searchParams.value
  if (!params.origin && !params.destination) return mockTrips || []
  return (mockTrips || []).filter(t => {
    const matchOrigin = !params.origin || (t.origin || '').toLowerCase().includes(params.origin.toLowerCase())
    const matchDest = !params.destination || (t.destination || '').toLowerCase().includes(params.destination.toLowerCase())
    const matchWeight = !params.weight || (t.availableKg || t.availableSpace || 0) >= params.weight
    return matchOrigin && matchDest && matchWeight
  })
})

const filteredTrips = computed(() => {
  let trips = [...rawTrips.value]

  if (modeFilter.value !== 'all') {
    trips = trips.filter(t =>
      (t.transportMode || '').toLowerCase() === modeFilter.value
    )
  }

  switch (sort.value) {
    case 'cheapest':
      trips.sort((a, b) => (a.pricePerKg || 0) - (b.pricePerKg || 0))
      break
    case 'trusted':
      trips.sort((a, b) => (b.trustScore || b.traveler?.trustScore || 0) - (a.trustScore || a.traveler?.trustScore || 0))
      break
    case 'soonest':
      trips.sort((a, b) => new Date(a.departureDate || a.date) - new Date(b.departureDate || b.date))
      break
    default:
      break
  }

  return trips
})

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function getPricePerKg(trip) {
  return trip.pricePerKg || trip.price || '—'
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
  if (m === 'car') return '#888'
  return '#888'
}

function goToTrip(id) {
  router.push(`/sender/trip/${id}`)
}

async function handleRefresh() {
  refreshing.value = true
  try {
    await tripsStore.searchTrips()
  } catch {}
  setTimeout(() => { refreshing.value = false }, 800)
}

onMounted(() => {
  if (!tripsStore.searchResults?.length) {
    loading.value = true
    setTimeout(() => { loading.value = false }, 1000)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&family=VT323&display=swap');

.results-page {
  font-family: 'Archivo', sans-serif;
}

.summary-bar {
  background: #0A0A0A;
  position: sticky;
  top: 0;
  z-index: 10;
}

.summary-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 480px;
  margin: 0 auto;
}

.route-text {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  color: #A3D977;
}

.summary-meta {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}

.edit-btn {
  background: #FF4DA6 !important;
  color: #0A0A0A !important;
  border: 2px solid #FF4DA6 !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  border-radius: 4px !important;
}

.content-wrapper {
  max-width: 480px;
  margin: 0 auto;
}

.filter-bar {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  padding: 12px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #0A0A0A;
  white-space: nowrap;
  min-width: 40px;
}

.chips-scroll {
  display: flex;
  overflow-x: auto;
  gap: 0;
  padding-bottom: 2px;
}

.sort-chip, .mode-chip {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  border-radius: 4px !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s;
}

.sort-chip--active, .mode-chip--active {
  background: #FF4DA6 !important;
  color: #0A0A0A !important;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.count-number {
  font-family: 'VT323', monospace;
  font-size: 28px;
  color: #FF4DA6;
}

.count-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #0A0A0A;
}

.refresh-btn {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 11px !important;
  color: #3D5B3E !important;
}

.retro-card {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 4px 4px 0 #0A0A0A !important;
  border-radius: 4px !important;
  cursor: pointer;
  transition: all 0.1s;
}

.retro-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #0A0A0A !important;
}

.retro-card:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #0A0A0A !important;
}

.trip-card {
  padding: 14px;
}

.trip-card__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #FF4DA6;
  border: 2px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 14px;
  color: #0A0A0A;
  flex-shrink: 0;
}

.traveler-info {
  flex: 1;
}

.traveler-name {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #0A0A0A;
}

.trust-row {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
}

.trust-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #FF4DA6;
}

.verified-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3D5B3E;
  font-weight: 700;
}

.trip-price {
  text-align: right;
  flex-shrink: 0;
}

.price-val {
  font-family: 'VT323', monospace;
  font-size: 28px;
  color: #FF4DA6;
  display: block;
  line-height: 1;
}

.price-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #888;
}

.trip-card__route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.route-point {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.route-point.text-right {
  align-items: flex-end;
}

.route-city {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 18px;
  color: #0A0A0A;
}

.route-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #0A0A0A;
  margin-top: 2px;
}

.origin-dot { background: #A3D977; }
.dest-dot { background: #FF4DA6; }

.route-line {
  flex: 1;
  text-align: center;
  border-bottom: 2px dashed #ccc;
  margin: 0 8px;
  padding-bottom: 4px;
}

.trip-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  background: #E9DEEA;
  border: 1px solid #0A0A0A;
  border-radius: 3px;
  padding: 2px 6px;
  color: #0A0A0A;
}

.transport-chip {
  background: #141a14;
  color: #A3D977;
  border-color: #A3D977;
}

.skeleton-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  padding: 14px;
}

.skeleton-row {
  display: flex;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-box {
  width: 100px;
  height: 100px;
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.empty-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: #0A0A0A;
}

.empty-subtitle {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
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
</style>
