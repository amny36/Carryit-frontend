<template>
  <v-app :style="{ background: '#E9DEEA' }">
    <v-main>
      <div class="profile-page">

        <!-- HERO SECTION -->
        <div class="hero-band">
          <div class="hero-gradient" />
          <div class="hero-top-actions">
            <v-btn
              v-if="isOwnProfile"
              icon
              variant="text"
              class="edit-btn-hero"
              @click="toggleEdit"
            >
              <v-icon color="white">mdi-pencil</v-icon>
            </v-btn>
          </div>
          <div class="hero-content">
            <div class="avatar-circle">
              <span class="avatar-initials">{{ initials }}</span>
            </div>
            <h1 class="user-name">{{ editMode ? editForm.name : profile.name }}</h1>
            <p class="user-meta">
              <v-icon size="14" color="rgba(255,255,255,0.8)">mdi-map-marker</v-icon>
              {{ profile.city }} &nbsp;·&nbsp;
              <v-icon size="14" color="rgba(255,255,255,0.8)">mdi-calendar</v-icon>
              Joined {{ joinDate }}
            </p>
            <div class="kyc-badge" :class="profile.kyc ? 'kyc-verified' : 'kyc-pending'">
              <span v-if="profile.kyc">✓ ID Verified</span>
              <span v-else>⚠ Verification Pending</span>
            </div>
          </div>
        </div>

        <div class="page-body">

          <!-- EDIT PROFILE MODE -->
          <v-card v-if="editMode" class="retro-card mb-4">
            <v-card-title class="font-archivo font-weight-black">Edit Profile</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="editForm.name"
                label="Full Name"
                variant="outlined"
                class="mb-2"
              />
              <v-text-field
                v-model="editForm.city"
                label="City"
                variant="outlined"
                class="mb-2"
              />
              <v-textarea
                v-model="editForm.bio"
                label="About Me"
                variant="outlined"
                rows="3"
                counter="300"
                maxlength="300"
              />
            </v-card-text>
            <v-card-actions class="px-4 pb-4">
              <v-btn class="retro-btn" @click="saveEdit">Save Changes</v-btn>
              <v-btn variant="text" color="grey" @click="cancelEdit">Cancel</v-btn>
            </v-card-actions>
          </v-card>

          <!-- TRUST SCORE CARD -->
          <v-card class="retro-card mb-4">
            <v-card-text>
              <div class="trust-header">
                <div>
                  <div class="trust-score-display">
                    <span class="trust-number">{{ profile.trustScore }}</span>
                    <span class="trust-max">/5</span>
                  </div>
                  <div class="trust-stars">
                    <v-icon
                      v-for="i in 5"
                      :key="i"
                      :color="i <= Math.round(profile.trustScore) ? '#E8A94A' : '#ccc'"
                      size="20"
                    >mdi-star</v-icon>
                  </div>
                  <p class="trust-based-on font-mono">Based on {{ profile.reviewCount }} reviews</p>
                </div>
                <div class="star-breakdown">
                  <div v-for="(pct, idx) in starBreakdown" :key="idx" class="star-row">
                    <span class="star-label font-mono">{{ 5 - idx }}★</span>
                    <div class="star-bar-bg">
                      <div class="star-bar-fill" :style="{ width: pct + '%' }" />
                    </div>
                    <span class="star-pct font-mono">{{ pct }}%</span>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- STATS ROW -->
          <div class="stats-row mb-4">
            <div v-for="stat in currentStats" :key="stat.label" class="stat-tile retro-card">
              <div class="stat-value font-archivo">{{ stat.value }}</div>
              <div class="stat-label font-mono">{{ stat.label }}</div>
            </div>
          </div>

          <!-- ABOUT ME -->
          <v-card class="retro-card mb-4">
            <v-card-title class="section-title">About Me</v-card-title>
            <v-card-text>
              <p v-if="!editMode" class="bio-text">{{ profile.bio || 'No bio yet.' }}</p>
            </v-card-text>
          </v-card>

          <!-- TRAVELER ONLY -->
          <template v-if="profile.role === 'traveler'">
            <v-card class="retro-card mb-4 quick-link-card" @click="router.push('/traveler/trips')">
              <v-card-text class="d-flex align-center">
                <v-icon color="#FF4DA6" size="28" class="mr-3">mdi-airplane</v-icon>
                <div>
                  <div class="font-archivo font-weight-bold">My Trips</div>
                  <div class="font-mono text-caption text-grey">View all your posted trips</div>
                </div>
                <v-spacer />
                <v-icon color="#FF4DA6">mdi-chevron-right</v-icon>
              </v-card-text>
            </v-card>

            <v-card class="retro-card mb-4">
              <v-card-title class="section-title">Recent Earnings</v-card-title>
              <v-card-text>
                <div class="sparkline-container">
                  <svg class="sparkline" viewBox="0 0 200 50" preserveAspectRatio="none">
                    <polyline
                      points="0,40 33,30 66,35 100,20 133,15 166,10 200,5"
                      fill="none"
                      stroke="#FF4DA6"
                      stroke-width="2"
                    />
                    <circle cx="200" cy="5" r="3" fill="#FF4DA6" />
                  </svg>
                  <div class="sparkline-labels font-mono">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </template>

          <!-- SENDER ONLY -->
          <template v-if="profile.role === 'sender'">
            <v-card class="retro-card mb-4 quick-link-card" @click="router.push('/sender/bookings')">
              <v-card-text class="d-flex align-center">
                <v-icon color="#FF4DA6" size="28" class="mr-3">mdi-package-variant</v-icon>
                <div>
                  <div class="font-archivo font-weight-bold">My Bookings</div>
                  <div class="font-mono text-caption text-grey">Track all your shipments</div>
                </div>
                <v-spacer />
                <v-icon color="#FF4DA6">mdi-chevron-right</v-icon>
              </v-card-text>
            </v-card>

            <v-card class="retro-card mb-4">
              <v-card-title class="section-title">Favorite Routes</v-card-title>
              <v-card-text>
                <div v-for="route in favoriteRoutes" :key="route.id" class="route-chip-row">
                  <div class="route-chip font-mono">
                    <v-icon size="14" color="#FF4DA6">mdi-map-marker</v-icon>
                    {{ route.from }} → {{ route.to }}
                    <span class="route-count">({{ route.count }}x)</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </template>

          <!-- RECENT REVIEWS -->
          <v-card class="retro-card mb-4">
            <v-card-title class="section-title d-flex align-center justify-space-between">
              <span>Recent Reviews</span>
              <v-btn variant="text" size="small" color="#FF4DA6" class="font-mono">See All</v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <div v-for="review in recentReviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <div class="review-avatar">{{ review.initials }}</div>
                  <div class="review-meta">
                    <div class="review-name font-archivo font-weight-bold">{{ review.name }}</div>
                    <div class="review-stars">
                      <v-icon v-for="i in 5" :key="i" size="14" :color="i <= review.rating ? '#E8A94A' : '#ccc'">mdi-star</v-icon>
                    </div>
                  </div>
                  <div class="review-date font-mono text-caption text-grey ml-auto">{{ review.date }}</div>
                </div>
                <p class="review-comment font-mono">{{ review.comment }}</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- SETTINGS ACCORDION -->
          <v-expansion-panels class="mb-6" variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title class="font-archivo font-weight-bold">
                <v-icon class="mr-2">mdi-cog</v-icon> Settings
              </v-expansion-panel-title>
              <v-expansion-panel-text>

                <div class="settings-section">
                  <div class="settings-label font-mono text-caption text-grey mb-2">NOTIFICATIONS</div>
                  <div v-for="notif in notifPrefs" :key="notif.key" class="settings-row">
                    <span class="font-archivo">{{ notif.label }}</span>
                    <v-switch
                      v-model="notif.enabled"
                      color="#FF4DA6"
                      hide-details
                      density="compact"
                    />
                  </div>
                </div>

                <v-divider class="my-3" />

                <div class="settings-section">
                  <div class="settings-label font-mono text-caption text-grey mb-2">LANGUAGE</div>
                  <v-select
                    v-model="selectedLanguage"
                    :items="languages"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </div>

                <v-divider class="my-3" />

                <div class="d-flex flex-column gap-2 mt-3">
                  <v-btn
                    variant="outlined"
                    color="error"
                    class="logout-btn font-archivo"
                    @click="handleLogout"
                  >
                    <v-icon class="mr-2">mdi-logout</v-icon>
                    Log Out
                  </v-btn>
                  <v-btn
                    variant="text"
                    color="error"
                    size="small"
                    class="font-mono"
                    @click="deleteDialog = true"
                  >
                    Delete Account
                  </v-btn>
                </div>

              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

        </div>
      </div>

      <!-- Delete Account Dialog -->
      <v-dialog v-model="deleteDialog" max-width="360">
        <v-card class="retro-card">
          <v-card-title class="font-archivo font-weight-black text-error">Delete Account</v-card-title>
          <v-card-text class="font-mono">
            This action is irreversible. All your data will be permanently deleted.
          </v-card-text>
          <v-card-actions>
            <v-btn class="retro-btn-danger font-archivo" @click="deleteDialog = false">Confirm Delete</v-btn>
            <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  userId: { type: String, default: null }
})

const isOwnProfile = computed(() => !props.userId || props.userId === authStore.user?.id)

const profile = reactive({
  id: '1',
  name: authStore.user?.name || 'Alex Martin',
  city: 'Tunis',
  joinDate: '2023-03-15',
  kyc: true,
  trustScore: 4.7,
  reviewCount: 23,
  bio: 'Frequent traveler between Tunis and Paris. I take great care of packages and always communicate proactively. Available most weekends.',
  role: authStore.user?.role || 'traveler',
})

const editMode = ref(false)
const deleteDialog = ref(false)

const editForm = reactive({
  name: profile.name,
  city: profile.city,
  bio: profile.bio,
})

const initials = computed(() => {
  const parts = profile.name.split(' ')
  return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2)
})

const joinDate = computed(() => {
  const d = new Date(profile.joinDate)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const starBreakdown = ref([60, 25, 10, 4, 1])

const travelerStats = [
  { label: 'Trips', value: '12' },
  { label: 'Earned', value: '840 TND' },
  { label: 'Reviews', value: '8' },
]
const senderStats = [
  { label: 'Shipments', value: '7' },
  { label: 'Saved', value: '32%' },
  { label: 'Avg Rating', value: '4.5★' },
]
const currentStats = computed(() => profile.role === 'traveler' ? travelerStats : senderStats)

const favoriteRoutes = ref([
  { id: 1, from: 'Tunis', to: 'Paris', count: 4 },
  { id: 2, from: 'Tunis', to: 'Lyon', count: 2 },
  { id: 3, from: 'Sfax', to: 'Marseille', count: 1 },
])

const recentReviews = ref([
  { id: 1, name: 'Marie Dupont', initials: 'MD', rating: 5, comment: 'Super fiable, colis arrivé en parfait état. Je recommande vivement !', date: 'Apr 10' },
  { id: 2, name: 'Karim B.', initials: 'KB', rating: 4, comment: 'Good communication, slight delay but handled professionally.', date: 'Mar 28' },
  { id: 3, name: 'Sophie L.', initials: 'SL', rating: 5, comment: 'Perfect delivery, very careful with my fragile items.', date: 'Mar 14' },
])

const notifPrefs = reactive([
  { key: 'booking_updates', label: 'Booking Updates', enabled: true },
  { key: 'new_messages', label: 'New Messages', enabled: true },
  { key: 'trip_reminders', label: 'Trip Reminders', enabled: true },
  { key: 'promotions', label: 'Promotions', enabled: false },
])

const selectedLanguage = ref('English')
const languages = ['English', 'Français', 'العربية']

function toggleEdit() {
  editForm.name = profile.name
  editForm.city = profile.city
  editForm.bio = profile.bio
  editMode.value = true
}

function saveEdit() {
  profile.name = editForm.name
  profile.city = editForm.city
  profile.bio = editForm.bio
  editMode.value = false
}

function cancelEdit() {
  editMode.value = false
}

function handleLogout() {
  authStore.logout?.()
  router.push('/login')
}
</script>

<style scoped>
.font-archivo { font-family: 'Archivo', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.profile-page {
  min-height: 100vh;
  background: #E9DEEA;
  font-family: 'Archivo', sans-serif;
}

/* HERO */
.hero-band {
  position: relative;
  height: 180px;
  background: linear-gradient(135deg, #FF4DA6 0%, #c23b8a 60%, #3D5B3E 100%);
  overflow: visible;
  margin-bottom: 60px;
}
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
}
.hero-top-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}
.edit-btn-hero {
  background: rgba(255,255,255,0.2) !important;
}
.hero-content {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
}
.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #FAFAF7;
  border: 3px solid #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 28px;
  color: #FF4DA6;
  margin-bottom: 8px;
}
.avatar-initials { line-height: 1; }
.user-name {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 22px;
  color: #0A0A0A;
  margin: 0;
  text-align: center;
}
.user-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #555;
  margin: 2px 0 6px;
  text-align: center;
}
.kyc-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1.5px solid;
}
.kyc-verified {
  background: #e8f5e9;
  color: #2e7d32;
  border-color: #2e7d32;
}
.kyc-pending {
  background: #fff8e1;
  color: #e65100;
  border-color: #E8A94A;
}

/* PAGE BODY */
.page-body {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

/* RETRO CARD */
.retro-card {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 4px 4px 0 #0A0A0A !important;
  border-radius: 8px !important;
}

/* RETRO BUTTONS */
.retro-btn {
  background: #FF4DA6 !important;
  color: white !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 6px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}
.retro-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #0A0A0A !important;
}
.retro-btn-danger {
  background: #C23B3B !important;
  color: white !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 6px !important;
  text-transform: none !important;
}

/* TRUST SCORE */
.trust-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.trust-score-display {
  display: flex;
  align-items: baseline;
}
.trust-number {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 42px;
  color: #0A0A0A;
  line-height: 1;
}
.trust-max {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: #888;
  margin-left: 4px;
}
.trust-based-on {
  font-size: 11px;
  color: #888;
  margin: 4px 0 0;
}
.star-breakdown {
  flex: 1;
}
.star-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}
.star-label {
  font-size: 11px;
  width: 20px;
  color: #555;
}
.star-bar-bg {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  border: 1px solid #ccc;
  overflow: hidden;
}
.star-bar-fill {
  height: 100%;
  background: #E8A94A;
  border-radius: 4px;
  transition: width 0.6s ease;
}
.star-pct {
  font-size: 10px;
  color: #888;
  width: 28px;
  text-align: right;
}

/* STATS ROW */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.stat-tile {
  text-align: center;
  padding: 14px 8px;
}
.stat-value {
  font-size: 22px;
  font-weight: 900;
  color: #FF4DA6;
  line-height: 1.2;
}
.stat-label {
  font-size: 10px;
  color: #555;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* SECTION TITLE */
.section-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 16px;
  padding-bottom: 0;
}

/* BIO */
.bio-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #333;
  line-height: 1.6;
}

/* QUICK LINK */
.quick-link-card { cursor: pointer; transition: transform 0.1s; }
.quick-link-card:hover { transform: translateY(-2px); }
.quick-link-card:active { transform: translate(2px, 2px); }

/* ROUTE CHIPS */
.route-chip-row { margin-bottom: 8px; }
.route-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #E9DEEA;
  border: 1.5px solid #0A0A0A;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  color: #0A0A0A;
}
.route-count { color: #888; font-size: 11px; }

/* SPARKLINE */
.sparkline-container { padding: 8px 0; }
.sparkline {
  width: 100%;
  height: 60px;
  display: block;
}
.sparkline-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #888;
  margin-top: 4px;
}

/* REVIEWS */
.review-item {
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
}
.review-item:last-child { border-bottom: none; }
.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FF4DA6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}
.review-name { font-size: 13px; }
.review-comment {
  font-size: 12px;
  color: #444;
  line-height: 1.5;
  margin: 0;
}

/* SETTINGS */
.settings-section { margin-bottom: 8px; }
.settings-label { text-transform: uppercase; letter-spacing: 1px; }
.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}
.logout-btn {
  text-transform: none !important;
  font-weight: 700 !important;
  letter-spacing: 0 !important;
}
</style>
