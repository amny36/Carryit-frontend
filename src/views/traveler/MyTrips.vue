<template>
  <v-container class="pa-0" fluid style="background:#E9DEEA; min-height:100vh;">
    <!-- Header -->
    <div class="header-bar px-4 pt-4 pb-3">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="page-title">My Trips</div>
          <div class="page-subtitle">{{ activeTrips.length }} active · {{ totalEarnings }} TND earned</div>
        </div>
        <v-btn icon class="fab-inline" @click="router.push('/traveler/post-trip')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs mt-3">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center pa-8">
      <v-progress-circular indeterminate color="#FF4DA6" size="40" />
    </div>

    <!-- Trip Cards -->
    <div v-else class="px-4 pb-24 mt-3">
      <div v-if="filteredTrips.length === 0" class="empty-state">
        <div class="empty-icon">✈️</div>
        <div class="empty-title">No trips yet</div>
        <div class="empty-sub">Post your first trip and start earning!</div>
        <v-btn class="cta-btn mt-4" @click="router.push('/traveler/post-trip')">
          <v-icon left class="mr-1">mdi-plus</v-icon>
          Post a Trip
        </v-btn>
      </div>

      <div v-for="trip in filteredTrips" :key="trip.id" class="trip-card mb-4">
        <!-- Card Header -->
        <div class="trip-card-header d-flex align-center justify-space-between mb-2">
          <div class="route-display">
            <span class="route-city">{{ trip.origin }}</span>
            <span class="route-arrow mx-2">→</span>
            <span class="route-city">{{ trip.destination }}</span>
          </div>
          <StatusPill :status="trip.status" />
        </div>

        <!-- Trip Meta -->
        <div class="trip-meta d-flex align-center gap-2 mb-3">
          <span class="meta-chip">{{ transportEmoji(trip.transportMode) }} {{ trip.transportMode }}</span>
          <span class="meta-chip">📅 {{ formatDate(trip.departureDate) }}</span>
        </div>

        <!-- Booking Progress -->
        <div class="booking-progress mb-3">
          <div class="d-flex justify-space-between mb-1">
            <span class="progress-label">Space booked</span>
            <span class="progress-value">{{ trip.bookedKg || 0 }} / {{ trip.availableSpace }} kg</span>
          </div>
          <v-progress-linear
            :model-value="((trip.bookedKg || 0) / trip.availableSpace) * 100"
            color="#FF4DA6"
            bg-color="#eee"
            rounded
            height="8"
          />
        </div>

        <!-- Earnings Row -->
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="earnings-badge">
            <v-icon size="14" class="mr-1" color="#E8A94A">mdi-currency-usd</v-icon>
            <span class="earnings-amt">{{ trip.earnings || 0 }} TND earned</span>
          </div>
          <div v-if="trip.pendingRequests > 0" class="pending-badge">
            {{ trip.pendingRequests }} pending
          </div>
        </div>

        <!-- Actions -->
        <div class="trip-actions d-flex gap-2">
          <template v-if="trip.status === 'active'">
            <v-btn
              class="action-btn action-btn--primary flex-1"
              @click="router.push('/traveler/requests')"
              size="small"
            >
              <v-badge
                v-if="trip.pendingRequests > 0"
                :content="trip.pendingRequests"
                color="#FF4DA6"
                inline
                class="mr-1"
              />
              View Requests
            </v-btn>
            <v-btn
              class="action-btn action-btn--danger"
              @click="openCancelDialog(trip)"
              size="small"
              variant="outlined"
            >
              Cancel
            </v-btn>
          </template>
          <template v-else-if="trip.status === 'completed'">
            <v-btn class="action-btn action-btn--ghost flex-1" size="small" variant="outlined">
              View Summary
            </v-btn>
          </template>
          <template v-else-if="trip.status === 'cancelled'">
            <span class="cancelled-label">Trip cancelled</span>
          </template>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <v-btn
      class="fab-btn"
      icon
      size="56"
      @click="router.push('/traveler/post-trip')"
      elevation="0"
    >
      <v-icon size="28">mdi-plus</v-icon>
    </v-btn>

    <!-- Cancel Confirm Dialog -->
    <v-dialog v-model="cancelDialog" max-width="340">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title pt-5 px-5">Cancel Trip?</v-card-title>
        <v-card-text class="px-5 pb-3">
          <p class="dialog-text">
            Are you sure you want to cancel this trip?<br />
            <strong>{{ selectedTrip?.origin }} → {{ selectedTrip?.destination }}</strong>
          </p>
          <p class="dialog-warn mt-2">All pending booking requests will be notified.</p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-0 d-flex gap-2">
          <v-btn variant="outlined" class="cancel-btn flex-1" @click="cancelDialog = false">Keep Trip</v-btn>
          <v-btn class="danger-btn flex-1" :loading="cancelLoading" @click="confirmCancel">Cancel Trip</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { mockTrips } from '@/data/mock.js'
import StatusPill from '@/components/StatusPill.vue'

const router = useRouter()
const tripsStore = useTripsStore()
const appStore = useAppStore()
const authStore = useAuthStore()

const loading = ref(false)
const activeTab = ref('all')
const cancelDialog = ref(false)
const cancelLoading = ref(false)
const selectedTrip = ref(null)

const tabs = computed(() => [
  { label: 'All', value: 'all', count: 0 },
  { label: 'Active', value: 'active', count: trips.value.filter(t => t.status === 'active').length },
  { label: 'Completed', value: 'completed', count: 0 },
  { label: 'Cancelled', value: 'cancelled', count: 0 },
])

const trips = computed(() => {
  const stored = tripsStore.myTrips
  if (stored && stored.length > 0) return stored
  return mockTrips.filter(t => t.travelerId === authStore.user?.id || true)
})

const filteredTrips = computed(() => {
  if (activeTab.value === 'all') return trips.value
  return trips.value.filter(t => t.status === activeTab.value)
})

const activeTrips = computed(() => trips.value.filter(t => t.status === 'active'))
const totalEarnings = computed(() => trips.value.reduce((sum, t) => sum + (t.earnings || 0), 0))

function transportEmoji(mode) {
  const map = { plane: '✈️', train: '🚆', bus: '🚌', car: '🚗' }
  return map[mode] || '🚀'
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function openCancelDialog(trip) {
  selectedTrip.value = trip
  cancelDialog.value = true
}

async function confirmCancel() {
  cancelLoading.value = true
  try {
    await tripsStore.cancelTrip(selectedTrip.value.id)
    cancelDialog.value = false
    appStore.showSnackbar('Trip cancelled.')
  } catch {
    appStore.showSnackbar('Could not cancel trip.')
  } finally {
    cancelLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await tripsStore.fetchMyTrips()
  } catch {}
  loading.value = false
})
</script>

<style scoped>
.header-bar {
  background: #FAFAF7;
  border-bottom: 2px solid #0A0A0A;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0A0A0A;
}

.page-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #888;
  margin-top: 2px;
}

.fab-inline {
  background: #FF4DA6 !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 10px !important;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.filter-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 2px solid #ccc;
  background: #fff;
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tab-btn--active {
  background: #FF4DA6;
  border-color: #0A0A0A;
  color: #fff;
  box-shadow: 2px 2px 0 #0A0A0A;
}

.tab-count {
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 0.7rem;
}

.trip-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 4px 4px 0 #0A0A0A;
}

.route-city {
  font-family: 'Archivo', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #0A0A0A;
}

.route-arrow {
  color: #FF4DA6;
  font-weight: 700;
}

.meta-chip {
  background: #F0EAF0;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 3px 8px;
  font-family: 'Archivo', sans-serif;
  font-size: 0.75rem;
  color: #444;
  text-transform: capitalize;
}

.progress-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.75rem;
  color: #666;
}

.progress-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #333;
  font-weight: 600;
}

.earnings-badge {
  display: flex;
  align-items: center;
  background: #fff8e7;
  border: 1px solid #E8A94A;
  border-radius: 8px;
  padding: 4px 10px;
}

.earnings-amt {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #E8A94A;
  font-weight: 700;
}

.pending-badge {
  background: #fff0f7;
  border: 1px solid #FF4DA6;
  border-radius: 8px;
  padding: 3px 10px;
  font-family: 'Archivo', sans-serif;
  font-size: 0.75rem;
  color: #FF4DA6;
  font-weight: 700;
}

.trip-actions { flex-wrap: wrap; }

.action-btn {
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  text-transform: none !important;
}

.action-btn--primary {
  background: #FF4DA6 !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
}

.action-btn--danger {
  border: 2px solid #C23B3B !important;
  color: #C23B3B !important;
}

.action-btn--ghost {
  border: 2px solid #888 !important;
  color: #555 !important;
}

.cancelled-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  color: #aaa;
  text-decoration: line-through;
}

.fab-btn {
  position: fixed !important;
  bottom: 88px;
  right: 20px;
  background: #FF4DA6 !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 4px 4px 0 #0A0A0A !important;
  border-radius: 14px !important;
  z-index: 100;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { font-size: 3rem; margin-bottom: 12px; }

.empty-title {
  font-family: 'Archivo', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0A0A0A;
}

.empty-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 0.9rem;
  color: #888;
  margin-top: 6px;
}

.cta-btn {
  background: #FF4DA6 !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
}

.dialog-card {
  border: 2px solid #0A0A0A;
  border-radius: 14px;
  box-shadow: 5px 5px 0 #0A0A0A;
}

.dialog-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
}

.dialog-text {
  font-family: 'Archivo', sans-serif;
  font-size: 0.9rem;
  color: #333;
}

.dialog-warn {
  font-size: 0.8rem;
  color: #C23B3B;
  font-family: 'Archivo', sans-serif;
}

.cancel-btn {
  border: 2px solid #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

.danger-btn {
  background: #C23B3B !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

.pb-24 { padding-bottom: 120px; }
.gap-2 { gap: 8px; }
.flex-1 { flex: 1; }
</style>
