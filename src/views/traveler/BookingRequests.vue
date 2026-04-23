<template>
  <v-container class="pa-0" fluid style="background:#E9DEEA; min-height:100vh;">
    <!-- Header -->
    <div class="header-bar px-4 pt-4 pb-3">
      <div class="d-flex align-center gap-3">
        <v-btn icon variant="text" @click="router.back()" class="back-btn">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <div class="page-title d-flex align-center gap-2">
            Booking Requests
            <span v-if="pendingCount > 0" class="badge-count">{{ pendingCount }}</span>
          </div>
          <div class="page-subtitle">Review and manage incoming requests</div>
        </div>
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
          <span v-if="tab.value === 'pending' && pendingCount > 0" class="tab-count">{{ pendingCount }}</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center pa-8">
      <v-progress-circular indeterminate color="#FF4DA6" size="40" />
    </div>

    <!-- Requests List -->
    <div v-else class="px-4 pb-24 mt-3">
      <div v-if="filteredRequests.length === 0" class="empty-state">
        <div class="empty-icon">{{ activeTab === 'pending' ? '📬' : '✅' }}</div>
        <div class="empty-title">
          {{ activeTab === 'pending' ? 'No pending requests' : 'Nothing here yet' }}
        </div>
        <div class="empty-sub">
          {{ activeTab === 'pending'
            ? 'New booking requests will appear here.'
            : 'Accepted bookings will show up once approved.' }}
        </div>
      </div>

      <div v-for="req in filteredRequests" :key="req.id" class="request-card mb-4">
        <!-- Sender Info -->
        <div class="d-flex align-center gap-3 mb-3">
          <v-avatar size="44" class="sender-avatar" color="#FF4DA6">
            <span class="avatar-initials">{{ initials(req.senderName) }}</span>
          </v-avatar>
          <div class="flex-1">
            <div class="sender-name">{{ req.senderName }}</div>
            <div class="req-date">Requested {{ formatDate(req.requestedAt) }}</div>
          </div>
          <StatusPill :status="req.status" />
        </div>

        <!-- Package Info -->
        <div class="package-box mb-3">
          <div class="d-flex align-center gap-2 mb-1">
            <span class="pkg-icon">{{ categoryIcon(req.packageCategory) }}</span>
            <span class="pkg-category">{{ req.packageCategory }}</span>
          </div>
          <div class="pkg-desc">{{ req.packageDescription }}</div>
        </div>

        <!-- Price Row -->
        <div class="price-row mb-3">
          <div class="price-item">
            <div class="price-label">Weight</div>
            <div class="price-val">{{ req.weightKg }} kg</div>
          </div>
          <div class="price-divider" />
          <div class="price-item">
            <div class="price-label">Sender pays</div>
            <div class="price-val">{{ req.senderPays }} TND</div>
          </div>
          <div class="price-divider" />
          <div class="price-item">
            <div class="price-label">Your payout</div>
            <div class="price-val price-val--earn">{{ req.travelerPayout }} TND</div>
          </div>
        </div>

        <!-- Trip Label -->
        <div class="trip-label mb-3">
          <v-icon size="14" class="mr-1">mdi-map-marker-path</v-icon>
          {{ req.tripOrigin }} → {{ req.tripDestination }} · {{ formatDate(req.tripDate) }}
        </div>

        <!-- Actions -->
        <div class="req-actions d-flex gap-2">
          <template v-if="req.status === 'pending'">
            <v-btn class="accept-btn flex-1" @click="openAccept(req)" size="small">
              <v-icon left size="16" class="mr-1">mdi-check</v-icon>Accept
            </v-btn>
            <v-btn class="reject-btn flex-1" @click="openReject(req)" size="small" variant="outlined">
              <v-icon left size="16" class="mr-1">mdi-close</v-icon>Reject
            </v-btn>
          </template>
          <template v-else-if="req.status === 'accepted'">
            <v-btn
              class="delivery-btn flex-1"
              @click="router.push(`/delivery/active/${req.id}`)"
              size="small"
            >
              <v-icon left size="16" class="mr-1">mdi-truck-delivery</v-icon>Start Delivery
            </v-btn>
          </template>
        </div>
      </div>
    </div>

    <!-- Accept Confirm Dialog -->
    <v-dialog v-model="acceptDialog" max-width="340">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title pt-5 px-5">Accept Booking?</v-card-title>
        <v-card-text class="px-5 pb-2">
          <p class="dialog-text">The sender will be notified and can proceed to prepare their package.</p>
          <div class="dialog-highlight mt-3">
            <span class="dh-label">You'll earn</span>
            <span class="dh-value">{{ selectedReq?.travelerPayout }} TND</span>
          </div>
        </v-card-text>
        <v-card-actions class="pa-5 pt-2 d-flex gap-2">
          <v-btn variant="outlined" class="cancel-btn flex-1" @click="acceptDialog = false">Cancel</v-btn>
          <v-btn class="confirm-btn flex-1" :loading="actionLoading" @click="doAccept">Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reject Confirm Dialog -->
    <v-dialog v-model="rejectDialog" max-width="340">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title pt-5 px-5">Reject Booking?</v-card-title>
        <v-card-text class="px-5 pb-2">
          <p class="dialog-text">
            This cannot be undone. The sender will be notified that their request was rejected.
          </p>
        </v-card-text>
        <v-card-actions class="pa-5 pt-2 d-flex gap-2">
          <v-btn variant="outlined" class="cancel-btn flex-1" @click="rejectDialog = false">Cancel</v-btn>
          <v-btn class="danger-btn flex-1" :loading="actionLoading" @click="doReject">Reject</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import { useAppStore } from '@/stores/app'
import { mockBookings } from '@/data/mock.js'
import StatusPill from '@/components/StatusPill.vue'

const router = useRouter()
const bookingsStore = useBookingsStore()
const appStore = useAppStore()

const loading = ref(false)
const activeTab = ref('pending')
const acceptDialog = ref(false)
const rejectDialog = ref(false)
const actionLoading = ref(false)
const selectedReq = ref(null)

const tabs = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'All', value: 'all' },
]

const requests = computed(() => {
  const stored = bookingsStore.bookingRequests
  if (stored && stored.length > 0) return stored
  return mockBookings
})

const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length)

const filteredRequests = computed(() => {
  if (activeTab.value === 'all') return requests.value
  return requests.value.filter(r => r.status === activeTab.value)
})

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function categoryIcon(cat) {
  const map = {
    Electronics: '💻', Clothing: '👗', Documents: '📄',
    Food: '🍱', Medicine: '💊', Books: '📚', Other: '📦'
  }
  return map[cat] || '📦'
}

function openAccept(req) {
  selectedReq.value = req
  acceptDialog.value = true
}

function openReject(req) {
  selectedReq.value = req
  rejectDialog.value = true
}

async function doAccept() {
  actionLoading.value = true
  try {
    await bookingsStore.acceptRequest(selectedReq.value.id)
    selectedReq.value.status = 'accepted'
    acceptDialog.value = false
    appStore.showSnackbar('Booking accepted!')
  } catch {
    appStore.showSnackbar('Failed to accept booking.')
  } finally {
    actionLoading.value = false
  }
}

async function doReject() {
  actionLoading.value = true
  try {
    await bookingsStore.rejectRequest(selectedReq.value.id)
    selectedReq.value.status = 'rejected'
    rejectDialog.value = false
    appStore.showSnackbar('Booking rejected.')
  } catch {
    appStore.showSnackbar('Failed to reject booking.')
  } finally {
    actionLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await bookingsStore.fetchBookingRequests()
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
  font-size: 1.4rem;
  font-weight: 800;
  color: #0A0A0A;
}

.page-subtitle {
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  color: #888;
  margin-top: 2px;
}

.back-btn {
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A;
}

.badge-count {
  background: #FF4DA6;
  color: #fff;
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  border-radius: 10px;
  padding: 2px 7px;
  font-weight: 700;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 2px solid #ccc;
  background: #fff;
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
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
  background: rgba(255,255,255,0.35);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 0.7rem;
}

.request-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 4px 4px 0 #0A0A0A;
}

.sender-avatar {
  border: 2px solid #0A0A0A;
  flex-shrink: 0;
}

.avatar-initials {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 0.9rem;
  color: #fff;
}

.sender-name {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0A0A0A;
}

.req-date {
  font-family: 'Archivo', sans-serif;
  font-size: 0.75rem;
  color: #888;
}

.package-box {
  background: #F5F0F5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
}

.pkg-icon { font-size: 1.1rem; }

.pkg-category {
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #3D5B3E;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pkg-desc {
  font-family: 'Archivo', sans-serif;
  font-size: 0.85rem;
  color: #555;
  margin-top: 2px;
}

.price-row {
  display: flex;
  align-items: center;
  background: #F8F8F8;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px 4px;
}

.price-item {
  flex: 1;
  text-align: center;
}

.price-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.7rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.price-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0A0A0A;
  margin-top: 2px;
}

.price-val--earn {
  color: #E8A94A;
  font-size: 1rem;
}

.price-divider {
  width: 1px;
  height: 28px;
  background: #ddd;
}

.trip-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.8rem;
  color: #666;
  display: flex;
  align-items: center;
}

.req-actions { flex-wrap: wrap; }

.accept-btn {
  background: #3D5B3E !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  text-transform: none !important;
}

.reject-btn {
  border: 2px solid #C23B3B !important;
  color: #C23B3B !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  text-transform: none !important;
}

.delivery-btn {
  background: #FF4DA6 !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  text-transform: none !important;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { font-size: 2.8rem; margin-bottom: 12px; }

.empty-title {
  font-family: 'Archivo', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0A0A0A;
}

.empty-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 0.85rem;
  color: #888;
  margin-top: 6px;
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

.dialog-highlight {
  background: #fff8e7;
  border: 1px solid #E8A94A;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dh-label {
  font-family: 'Archivo', sans-serif;
  font-size: 0.85rem;
  color: #666;
}

.dh-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #E8A94A;
}

.cancel-btn {
  border: 2px solid #0A0A0A !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

.confirm-btn {
  background: #3D5B3E !important;
  color: #fff !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
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
.gap-3 { gap: 12px; }
.flex-1 { flex: 1; }
</style>
