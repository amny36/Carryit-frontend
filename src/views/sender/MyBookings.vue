<template>
  <div class="my-bookings-page has-bottom-nav">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">My Bookings</h1>
      <p class="page-subtitle">
        {{ filteredBookings.length }}
        {{ filteredBookings.length === 1 ? 'booking' : 'bookings' }}
        {{ activeTab !== 'all' ? `· ${tabLabel}` : '' }}
      </p>
    </div>

    <!-- Status Filter Tabs -->
    <div class="tabs-wrapper">
      <div class="tabs-scroll">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tabCount(tab.value) > 0" class="tab-badge">{{ tabCount(tab.value) }}</span>
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="bookings-list">
      <v-skeleton-loader
        v-for="n in 3"
        :key="n"
        type="card"
        class="skeleton-card"
      />
    </div>

    <!-- Bookings List -->
    <div v-else-if="filteredBookings.length > 0" class="bookings-list">
      <div
        v-for="booking in filteredBookings"
        :key="booking.id"
        class="booking-item"
      >
        <!-- BookingCard -->
        <div class="booking-card-wrapper" @click="handleCardClick(booking)">
          <BookingCard :booking="booking" />
        </div>

        <!-- Action Row -->
        <div class="action-row">
          <!-- In Transit -->
          <template v-if="['picked_up', 'in_transit'].includes(booking.status)">
            <button class="action-btn pink" @click.stop="trackPackage(booking.id)">
              <v-icon size="14" class="mr-1">mdi-map-marker-path</v-icon>
              Track Package
            </button>
          </template>

          <!-- Delivered -->
          <template v-else-if="booking.status === 'delivered'">
            <button class="action-btn green" @click.stop="rateTraveler(booking.id)">
              <v-icon size="14" class="mr-1">mdi-star</v-icon>
              Rate Traveler
            </button>
            <button
              v-if="isWithin48h(booking.deliveredAt)"
              class="action-btn-text orange"
              @click.stop="openDispute(booking.id)"
            >
              Dispute
            </button>
          </template>

          <!-- Pending -->
          <template v-else-if="booking.status === 'pending'">
            <button class="action-btn-text red" @click.stop="confirmCancel(booking)">
              Cancel
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">{{ emptyStateIcon }}</div>
      <p class="empty-title">{{ emptyStateTitle }}</p>
      <p class="empty-desc">{{ emptyStateDesc }}</p>
    </div>

    <!-- FAB -->
    <button class="fab-btn" @click="router.push('/sender/search')" aria-label="New booking">
      <v-icon color="white" size="28">mdi-plus</v-icon>
    </button>

    <!-- Confirm Cancel Dialog -->
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Cancel Booking?"
      message="Are you sure you want to cancel this booking? This action cannot be undone."
      confirm-label="Cancel Booking"
      confirm-color="#C23B3B"
      @confirm="executeCancel"
    />

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
import { useBookingsStore } from '@/stores/bookings'
import { useAuthStore } from '@/stores/auth'
import { mockBookings } from '@/data/mock.js'
import BookingCard from '@/components/BookingCard.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const bookingsStore = useBookingsStore()
const authStore = useAuthStore()

const loading = ref(true)
const activeTab = ref('all')
const confirmDialogRef = ref(null)
const bookingToCancel = ref(null)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
]

const allBookings = ref([])

const filteredBookings = computed(() => {
  if (activeTab.value === 'all') return allBookings.value
  if (activeTab.value === 'in_transit') {
    return allBookings.value.filter(b => ['picked_up', 'in_transit'].includes(b.status))
  }
  return allBookings.value.filter(b => b.status === activeTab.value)
})

const tabLabel = computed(() => {
  return tabs.find(t => t.value === activeTab.value)?.label || ''
})

function tabCount(value) {
  if (value === 'all') return allBookings.value.length
  if (value === 'in_transit') {
    return allBookings.value.filter(b => ['picked_up', 'in_transit'].includes(b.status)).length
  }
  return allBookings.value.filter(b => b.status === value).length
}

function isWithin48h(deliveredAt) {
  if (!deliveredAt) return false
  const diff = Date.now() - new Date(deliveredAt).getTime()
  return diff < 48 * 60 * 60 * 1000
}

function handleCardClick(booking) {
  const { status, id } = booking
  if (['accepted', 'picked_up', 'in_transit'].includes(status)) {
    router.push(`/sender/tracking/${id}`)
  } else if (status === 'delivered') {
    router.push(`/review/${id}`)
  }
}

function trackPackage(id) {
  router.push(`/sender/tracking/${id}`)
}

function rateTraveler(id) {
  router.push(`/review/${id}`)
}

function openDispute(id) {
  showSnackbar('Dispute process initiated. Our team will contact you.', 'warning')
}

function confirmCancel(booking) {
  bookingToCancel.value = booking
  confirmDialogRef.value?.open()
}

async function executeCancel() {
  if (!bookingToCancel.value) return
  const id = bookingToCancel.value.id
  try {
    if (bookingsStore.updateStatus) {
      await bookingsStore.updateStatus(id, 'cancelled')
    }
    const idx = allBookings.value.findIndex(b => b.id === id)
    if (idx >= 0) allBookings.value[idx] = { ...allBookings.value[idx], status: 'cancelled' }
    showSnackbar('Booking cancelled.', 'error')
  } catch {
    showSnackbar('Failed to cancel. Please try again.', 'error')
  }
  bookingToCancel.value = null
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}

const emptyStateIcon = computed(() => {
  const map = {
    all: '📦', pending: '⏳', accepted: '✅',
    in_transit: '🚚', delivered: '🎉', cancelled: '❌'
  }
  return map[activeTab.value] || '📦'
})

const emptyStateTitle = computed(() => {
  const map = {
    all: 'No bookings yet',
    pending: 'No pending bookings',
    accepted: 'No accepted bookings',
    in_transit: 'Nothing in transit',
    delivered: 'No deliveries yet',
    cancelled: 'No cancelled bookings'
  }
  return map[activeTab.value] || 'No bookings'
})

const emptyStateDesc = computed(() => {
  if (activeTab.value === 'all') return 'Start by searching for a traveler to carry your package!'
  return `No bookings with status "${tabLabel.value}" found.`
})

onMounted(async () => {
  try {
    if (bookingsStore.fetchMyBookings) {
      await bookingsStore.fetchMyBookings(authStore.user?.id)
      allBookings.value = bookingsStore.bookings || []
    }
    if (!allBookings.value.length) {
      allBookings.value = mockBookings.filter(b => b.senderId === 'u2')
    }
  } catch {
    allBookings.value = mockBookings.filter(b => b.senderId === 'u2')
  }
  loading.value = false
})
</script>

<style scoped>
.my-bookings-page {
  min-height: 100vh;
  background: #FAFAF7;
  font-family: 'Archivo', sans-serif;
  padding-bottom: 100px;
}

.has-bottom-nav {
  padding-bottom: 100px;
}

/* Page Header */
.page-header {
  padding: 56px 20px 12px;
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

/* Tabs */
.tabs-wrapper {
  padding: 0;
  border-bottom: 2px solid #e0e0e0;
  background: #FAFAF7;
  position: sticky;
  top: 0;
  z-index: 5;
}

.tabs-scroll {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 0;
  padding: 0 12px;
}

.tabs-scroll::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  flex-shrink: 0;
  padding: 14px 16px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -2px;
}

.tab-btn.active {
  color: #FF4DA6;
  border-bottom-color: #FF4DA6;
}

.tab-badge {
  background: #FF4DA6;
  color: white;
  font-size: 10px;
  font-weight: 800;
  border-radius: 10px;
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}

/* Bookings List */
.bookings-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.booking-item {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.booking-card-wrapper {
  cursor: pointer;
}

.action-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 4px 0;
}

/* Action Buttons */
.action-btn {
  display: flex;
  align-items: center;
  padding: 7px 14px;
  border-radius: 6px;
  border: 2px solid #0A0A0A;
  box-shadow: 2px 2px 0 #0A0A0A;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.action-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.action-btn.pink {
  background: #FF4DA6;
  color: white;
}

.action-btn.green {
  background: #3D5B3E;
  color: white;
}

.action-btn-text {
  background: none;
  border: none;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 7px 10px;
  border-radius: 4px;
  text-decoration: underline;
}

.action-btn-text.red {
  color: #C23B3B;
}

.action-btn-text.orange {
  color: #E8A94A;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 14px;
  color: #888;
  margin: 0;
  line-height: 1.5;
}

/* FAB */
.fab-btn {
  position: fixed;
  bottom: 88px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #FF4DA6;
  border: 2px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  z-index: 10;
}

.fab-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
</style>
