<template>
  <v-container class="rating-review pa-4" max-width="600">
    <!-- Back Button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4 back-btn"
      @click="$router.back()"
    >
      Back
    </v-btn>

    <!-- Success Screen -->
    <div v-if="submitted" class="success-screen text-center py-8">
      <div class="starburst-container mb-6">
        <span class="star-center">⭐</span>
        <span class="star-orbit star-1">⭐</span>
        <span class="star-orbit star-2">⭐</span>
        <span class="star-orbit star-3">⭐</span>
        <span class="star-orbit star-4">⭐</span>
        <span class="star-orbit star-5">⭐</span>
      </div>
      <h2 class="success-title mb-3">Thank you for your review!</h2>
      <p class="success-sub mb-8">Your feedback helps build trust in our community.</p>
      <div class="d-flex flex-column gap-3">
        <v-btn
          class="retro-btn"
          size="large"
          block
          @click="$router.push('/my-bookings')"
        >
          Back to Bookings
        </v-btn>
        <v-btn
          variant="outlined"
          class="retro-btn-outline"
          size="large"
          block
          @click="$router.push('/')"
        >
          Back to Home
        </v-btn>
      </div>
    </div>

    <!-- Rating Form -->
    <div v-else>
      <!-- Progress Banner -->
      <div class="progress-banner mb-4">
        <v-icon color="white" class="mr-2">mdi-check-circle</v-icon>
        Delivery Complete! ✓
      </div>

      <!-- Context Card -->
      <div class="retro-card mb-6 pa-4">
        <div class="route-display mb-3">
          <span class="route-city">{{ booking.origin }}</span>
          <v-icon class="mx-2" color="#9CA3AF">mdi-arrow-right</v-icon>
          <span class="route-city">{{ booking.destination }}</span>
        </div>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-3">
            <div class="avatar-circle">
              {{ otherUserInitial }}
            </div>
            <div>
              <div class="rating-label">You're rating:</div>
              <div class="other-user-name">{{ otherUserName }}</div>
            </div>
          </div>
          <div>
            <span class="status-pill status-delivered">delivered</span>
          </div>
        </div>
        <div class="booking-date mt-2">
          <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
          {{ booking.date }}
        </div>
      </div>

      <!-- Main Star Rating -->
      <div class="retro-card mb-5 pa-5 text-center">
        <div class="section-label mb-4">Overall Rating</div>
        <div class="main-stars mb-3">
          <button
            v-for="star in 5"
            :key="star"
            class="star-btn main-star"
            :class="{ 'star-selected': star <= rating, 'star-hovered': star <= hoverRating }"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            @click="rating = star"
            type="button"
          >
            <v-icon
              :color="star <= (hoverRating || rating) ? '#E8A94A' : '#9CA3AF'"
              size="60"
            >
              {{ star <= (hoverRating || rating) ? 'mdi-star' : 'mdi-star-outline' }}
            </v-icon>
          </button>
        </div>
        <div class="star-label" :class="{ 'star-label-active': rating > 0 }">
          {{ starLabel }}
        </div>
      </div>

      <!-- Category Ratings -->
      <div class="retro-card mb-5 pa-4">
        <div class="section-label mb-4">Detailed Ratings</div>
        <div
          v-for="cat in currentCategories"
          :key="cat.key"
          class="category-row mb-3"
        >
          <div class="d-flex align-center justify-space-between">
            <span class="category-label">{{ cat.label }}</span>
            <div class="small-stars">
              <button
                v-for="s in 5"
                :key="s"
                class="star-btn small-star"
                :class="{ 'star-selected': s <= categoryRatings[cat.key] }"
                @click="categoryRatings[cat.key] = s"
                type="button"
              >
                <v-icon
                  :color="s <= categoryRatings[cat.key] ? '#E8A94A' : '#9CA3AF'"
                  size="22"
                >
                  {{ s <= categoryRatings[cat.key] ? 'mdi-star' : 'mdi-star-outline' }}
                </v-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Written Review -->
      <div class="retro-card mb-5 pa-4">
        <div class="section-label mb-3">Written Review</div>
        <v-textarea
          v-model="review"
          label="Write a review"
          :placeholder="reviewPlaceholder"
          rows="3"
          counter="500"
          maxlength="500"
          variant="outlined"
          :error-messages="reviewError"
          class="retro-textarea"
        />
        <div class="char-hint">{{ review.length }}/500 characters</div>
      </div>

      <!-- Recommend Toggle -->
      <div class="retro-card mb-5 pa-4">
        <div class="section-label mb-3">Would you recommend them?</div>
        <div class="d-flex gap-3">
          <button
            class="recommend-btn"
            :class="{ 'recommend-yes': recommend === true }"
            @click="recommend = true"
            type="button"
          >
            <v-icon class="mr-1">mdi-thumb-up</v-icon> Yes
          </button>
          <button
            class="recommend-btn"
            :class="{ 'recommend-no': recommend === false }"
            @click="recommend = false"
            type="button"
          >
            <v-icon class="mr-1">mdi-thumb-down</v-icon> No
          </button>
        </div>
      </div>

      <!-- Validation Error -->
      <v-alert
        v-if="submitError"
        type="error"
        variant="tonal"
        class="mb-4"
        density="compact"
      >
        {{ submitError }}
      </v-alert>

      <!-- Submit Button -->
      <v-btn
        class="retro-btn mb-4"
        size="large"
        block
        :loading="loading"
        prepend-icon="mdi-send"
        @click="submit"
      >
        Submit Rating
      </v-btn>

      <!-- Skip Link -->
      <div class="text-center">
        <a href="#" class="skip-link" @click.prevent="$router.back()">
          Skip for now
        </a>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Mock booking data
const mockBookings = [
  {
    id: '1',
    origin: 'Tunis',
    destination: 'Paris',
    date: 'April 15, 2026',
    status: 'delivered',
    travelerName: 'Alex Dupont',
    senderName: 'Marie Laurent',
    travelerId: 'traveler-1',
    senderId: 'sender-1',
  }
]

const mockAuth = { userId: 'sender-1', role: 'sender' }

const bookingId = route.params.id || '1'
const booking = mockBookings.find(b => b.id === bookingId) || mockBookings[0]

const userRole = mockAuth.role // 'sender' | 'traveler'

const otherUserName = userRole === 'sender' ? booking.travelerName : booking.senderName
const otherUserInitial = otherUserName?.charAt(0).toUpperCase() || '?'

// Refs
const rating = ref(0)
const hoverRating = ref(0)
const categoryRatings = ref({ communication: 0, reliability: 0, care: 0, accuracy: 0, pickup: 0 })
const review = ref('')
const recommend = ref(null)
const submitted = ref(false)
const loading = ref(false)
const submitError = ref('')
const reviewError = ref('')

// Category sets
const senderCategories = [
  { key: 'communication', label: 'Communication' },
  { key: 'reliability', label: 'Reliability' },
  { key: 'care', label: 'Care of Package' },
]
const travelerCategories = [
  { key: 'communication', label: 'Communication' },
  { key: 'accuracy', label: 'Package Accuracy' },
  { key: 'pickup', label: 'Ease of Pickup' },
]

const currentCategories = computed(() =>
  userRole === 'sender' ? senderCategories : travelerCategories
)

const starLabelMap = {
  0: 'Select a rating',
  1: '1 / 5 — Poor',
  2: '2 / 5 — Fair',
  3: '3 / 5 — Good',
  4: '4 / 5 — Great!',
  5: '5 / 5 — Excellent!',
}

const starLabel = computed(() => starLabelMap[rating.value] || 'Select a rating')

const reviewPlaceholder = computed(() =>
  userRole === 'sender'
    ? 'Describe your experience with this carrier...'
    : 'Describe your experience with this sender...'
)

function submit() {
  submitError.value = ''
  reviewError.value = ''

  if (rating.value < 1) {
    submitError.value = 'Please select a star rating before submitting.'
    return
  }
  if (review.value.trim().length < 20) {
    reviewError.value = 'Review must be at least 20 characters.'
    submitError.value = 'Please write a review of at least 20 characters.'
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    submitted.value = true
  }, 1000)
}
</script>

<style scoped>
.rating-review {
  font-family: 'Archivo', sans-serif;
  background: #E9DEEA;
  min-height: 100vh;
}

.back-btn {
  color: #0A0A0A;
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
}

/* Progress Banner */
.progress-banner {
  background: #3D5B3E;
  color: white;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 20px;
  border-radius: 4px;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  display: flex;
  align-items: center;
}

/* Retro Card */
.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 4px;
}

/* Route */
.route-display {
  display: flex;
  align-items: center;
}
.route-city {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #0A0A0A;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Avatar */
.avatar-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #FF4DA6;
  color: white;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0A0A0A;
}
.rating-label {
  font-size: 11px;
  color: #9CA3AF;
  font-family: 'Archivo', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.other-user-name {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: #0A0A0A;
}

/* Status Pill */
.status-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.status-delivered {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #065f46;
}

.booking-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #9CA3AF;
}

/* Section Label */
.section-label {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #0A0A0A;
}

/* Stars */
.main-stars {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.15s ease;
  line-height: 1;
}
.star-btn:hover {
  transform: scale(1.15);
}
.main-star.star-selected {
  transform: scale(1.2);
}

.star-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  color: #9CA3AF;
  font-weight: 600;
  transition: color 0.2s;
}
.star-label-active {
  color: #E8A94A;
}

/* Category Rows */
.category-label {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #0A0A0A;
  font-weight: 500;
}
.small-stars {
  display: flex;
  gap: 2px;
}
.small-star {
  padding: 2px;
}

/* Textarea */
.char-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #9CA3AF;
  text-align: right;
  margin-top: -8px;
}

/* Recommend Buttons */
.recommend-btn {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #0A0A0A;
  background: #FAFAF7;
  border-radius: 40px;
  cursor: pointer;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.recommend-btn:hover {
  background: #f0f0f0;
}
.recommend-yes {
  background: #d1fae5 !important;
  border-color: #065f46 !important;
  color: #065f46;
}
.recommend-no {
  background: #fee2e2 !important;
  border-color: #C23B3B !important;
  color: #C23B3B;
}

/* Retro Button */
.retro-btn {
  background: #FF4DA6 !important;
  color: white !important;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 4px !important;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: box-shadow 0.1s, transform 0.1s;
}
.retro-btn:active {
  box-shadow: 1px 1px 0 #0A0A0A !important;
  transform: translate(2px, 2px);
}
.retro-btn-outline {
  background: transparent !important;
  color: #0A0A0A !important;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 4px !important;
  text-transform: none;
}

/* Skip Link */
.skip-link {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #9CA3AF;
  text-decoration: none;
}
.skip-link:hover {
  text-decoration: underline;
}

/* Success Screen */
.success-screen {
  padding-top: 40px;
}
.success-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 26px;
  color: #0A0A0A;
}
.success-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  color: #6B7280;
  max-width: 320px;
  margin: 0 auto;
}

/* Star Burst Animation */
.starburst-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.star-center {
  font-size: 48px;
  z-index: 2;
  position: relative;
  animation: pulse-star 1.2s ease-in-out infinite;
}
.star-orbit {
  font-size: 22px;
  position: absolute;
  animation: orbit-out 0.7s ease-out forwards;
}
.star-1 { animation-delay: 0.0s; --angle: 0deg; --dist: 52px; }
.star-2 { animation-delay: 0.1s; --angle: 72deg; --dist: 52px; }
.star-3 { animation-delay: 0.2s; --angle: 144deg; --dist: 52px; }
.star-4 { animation-delay: 0.3s; --angle: 216deg; --dist: 52px; }
.star-5 { animation-delay: 0.4s; --angle: 288deg; --dist: 52px; }

@keyframes orbit-out {
  0% { transform: rotate(var(--angle)) translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: rotate(var(--angle)) translateY(calc(-1 * var(--dist))); opacity: 0.85; }
}
@keyframes pulse-star {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
