<template>
  <v-app :style="{ background: '#E9DEEA' }">
    <v-app-bar flat color="#FAFAF7" border="b" style="border-bottom: 2px solid #0A0A0A;">
      <v-app-bar-title>
        <span class="page-title font-archivo">
          Notifications
          <span v-if="unreadCount > 0" class="unread-count">({{ unreadCount }})</span>
        </span>
      </v-app-bar-title>
      <template #append>
        <v-btn
          variant="text"
          size="small"
          class="mark-all-btn font-mono"
          :disabled="unreadCount === 0"
          @click="markAllRead"
        >
          Mark all read
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <div class="notifications-page">

        <!-- FILTER TABS -->
        <div class="filter-tabs-wrapper">
          <div class="filter-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              class="filter-tab font-mono"
              :class="{ active: activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
              <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
            </button>
          </div>
        </div>

        <!-- PULL TO REFRESH -->
        <div class="pull-refresh-hint font-mono" :class="{ refreshing: isRefreshing }">
          <v-icon size="14" :class="{ spin: isRefreshing }">mdi-refresh</v-icon>
          {{ isRefreshing ? 'Refreshing...' : 'Pull to refresh' }}
        </div>

        <!-- CONTENT -->
        <div class="notifications-list" @touchstart="onTouchStart" @touchend="onTouchEnd">

          <!-- EMPTY STATE -->
          <div v-if="filteredGrouped.length === 0" class="empty-state">
            <div class="empty-icon">🔔</div>
            <div class="empty-title font-archivo">No notifications</div>
            <div class="empty-sub font-mono">
              {{ activeTab === 'unread' ? 'You\'re all caught up!' : 'Nothing here yet.' }}
            </div>
          </div>

          <!-- GROUPED NOTIFICATIONS -->
          <template v-else>
            <div v-for="group in filteredGrouped" :key="group.label">
              <div class="group-label font-mono">{{ group.label }}</div>
              <div
                v-for="notif in group.items"
                :key="notif.id"
                class="notif-item"
                :class="{ unread: !notif.read }"
                @click="handleNotifClick(notif)"
              >
                <div class="notif-icon-wrap" :style="{ background: iconBg(notif.type) }">
                  <v-icon size="18" :color="iconColor(notif.type)">{{ iconFor(notif.type) }}</v-icon>
                </div>
                <div class="notif-body">
                  <div class="notif-title font-archivo">{{ notif.title }}</div>
                  <div class="notif-message font-mono">{{ notif.message }}</div>
                  <div class="notif-time font-mono text-caption">{{ notif.timeFormatted }}</div>
                </div>
                <div v-if="!notif.read" class="unread-dot" />
              </div>
            </div>
          </template>

        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mockNotifications } from '@/data/mock.js'

const router = useRouter()

// Reactive local copy with read state
const notifications = reactive(
  (mockNotifications || generateFallbackNotifications()).map(n => ({ ...n, read: false }))
)

function generateFallbackNotifications() {
  const now = Date.now()
  return [
    { id: '1', type: 'booking', title: 'Booking Confirmed', message: 'Your booking #B-1042 has been confirmed by Alex.', time: now - 1000 * 60 * 30, category: 'bookings' },
    { id: '2', type: 'message', title: 'New Message', message: 'Marie: "I\'ll be at the airport by 2pm"', time: now - 1000 * 60 * 90, category: 'bookings' },
    { id: '3', type: 'trip', title: 'Trip Reminder', message: 'Your trip to Paris departs tomorrow.', time: now - 1000 * 60 * 60 * 5, category: 'bookings' },
    { id: '4', type: 'system', title: 'Welcome to CarryIt!', message: 'Your account has been verified. Start exploring trips.', time: now - 1000 * 60 * 60 * 26, category: 'system' },
    { id: '5', type: 'booking', title: 'Package Delivered', message: 'Booking #B-1039 has been marked as delivered.', time: now - 1000 * 60 * 60 * 48, category: 'bookings' },
    { id: '6', type: 'system', title: 'KYC Approved', message: 'Your identity has been verified successfully.', time: now - 1000 * 60 * 60 * 72, category: 'system' },
  ]
}

const tabs = computed(() => [
  { label: 'All', value: 'all', count: 0 },
  { label: 'Unread', value: 'unread', count: unreadCount.value },
  { label: 'Bookings', value: 'bookings', count: notifications.filter(n => !n.read && n.category === 'bookings').length },
  { label: 'System', value: 'system', count: notifications.filter(n => !n.read && n.category === 'system').length },
])

const activeTab = ref('all')
const isRefreshing = ref(false)

const unreadCount = computed(() => notifications.filter(n => !n.read).length)

const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') return notifications
  if (activeTab.value === 'unread') return notifications.filter(n => !n.read)
  return notifications.filter(n => n.category === activeTab.value)
})

const filteredGrouped = computed(() => {
  const now = Date.now()
  const todayStart = new Date(); todayStart.setHours(0,0,0,0)
  const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  const groups = { Today: [], Yesterday: [], Earlier: [] }

  filteredNotifications.value.forEach(n => {
    const t = new Date(n.time)
    if (t >= todayStart) groups.Today.push(n)
    else if (t >= yesterdayStart) groups.Yesterday.push(n)
    else groups.Earlier.push(n)
  })

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({
      label,
      items: items.map(n => ({
        ...n,
        timeFormatted: formatTime(n.time)
      }))
    }))
})

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function iconFor(type) {
  const map = {
    booking: 'mdi-package-variant',
    message: 'mdi-message',
    trip: 'mdi-airplane',
    system: 'mdi-information',
  }
  return map[type] || 'mdi-bell'
}
function iconBg(type) {
  const map = {
    booking: '#fce4ec',
    message: '#e8f5e9',
    trip: '#e3f2fd',
    system: '#fff8e1',
  }
  return map[type] || '#f5f5f5'
}
function iconColor(type) {
  const map = {
    booking: '#FF4DA6',
    message: '#3D5B3E',
    trip: '#1976D2',
    system: '#E8A94A',
  }
  return map[type] || '#888'
}

function handleNotifClick(notif) {
  const idx = notifications.findIndex(n => n.id === notif.id)
  if (idx !== -1) notifications[idx].read = true

  if (notif.type === 'booking') router.push('/sender/bookings')
  else if (notif.type === 'trip') router.push('/traveler/trips')
  else if (notif.type === 'message') router.push('/chat')
  // system: stay
}

function markAllRead() {
  notifications.forEach(n => { n.read = true })
}

// Pull-to-refresh simulation
let touchStartY = 0
function onTouchStart(e) {
  touchStartY = e.touches[0].clientY
}
function onTouchEnd(e) {
  const delta = e.changedTouches[0].clientY - touchStartY
  if (delta > 60 && window.scrollY === 0) {
    isRefreshing.value = true
    setTimeout(() => {
      isRefreshing.value = false
    }, 1200)
  }
}
</script>

<style scoped>
.font-archivo { font-family: 'Archivo', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.notifications-page {
  background: #E9DEEA;
  min-height: 100vh;
}

.page-title {
  font-weight: 900;
  font-size: 20px;
  color: #0A0A0A;
}
.unread-count {
  color: #FF4DA6;
}
.mark-all-btn {
  font-size: 11px !important;
  color: #FF4DA6 !important;
  text-transform: none !important;
}

/* FILTER TABS */
.filter-tabs-wrapper {
  background: #FAFAF7;
  border-bottom: 2px solid #0A0A0A;
  padding: 0 16px;
}
.filter-tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
}
.filter-tabs::-webkit-scrollbar { display: none; }
.filter-tab {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  position: relative;
}
.filter-tab.active {
  color: #FF4DA6;
  border-bottom-color: #FF4DA6;
}
.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #FF4DA6;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-left: 4px;
}

/* PULL REFRESH */
.pull-refresh-hint {
  text-align: center;
  font-size: 10px;
  color: #aaa;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.refreshing { color: #FF4DA6; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }

/* GROUP LABEL */
.group-label {
  font-size: 11px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 16px 4px;
}

/* NOTIF ITEM */
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #FAFAF7;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.notif-item:hover { background: #f0ecf1; }
.notif-item.unread { background: #fff5fb; }

.notif-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.notif-body { flex: 1; min-width: 0; }
.notif-title {
  font-size: 14px;
  font-weight: 800;
  color: #0A0A0A;
  margin-bottom: 2px;
}
.notif-message {
  font-size: 12px;
  color: #444;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notif-time {
  font-size: 10px;
  color: #aaa;
  margin-top: 3px;
}
.unread-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #FF4DA6;
  flex-shrink: 0;
  margin-top: 6px;
}

/* EMPTY STATE */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-title {
  font-size: 18px;
  font-weight: 800;
  color: #0A0A0A;
  margin-bottom: 6px;
}
.empty-sub {
  font-size: 12px;
  color: #888;
}
</style>
