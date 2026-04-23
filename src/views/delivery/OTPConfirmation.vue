<template>
  <v-container class="pa-0" style="background: #E9DEEA; min-height: 100vh;">
    <!-- Top Bar -->
    <div class="top-bar px-4 pt-4 pb-2 d-flex align-center gap-3">
      <v-btn icon variant="text" class="retro-icon-btn" @click="router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="page-title">Delivery Confirmation</h1>
    </div>

    <div class="px-4 pb-8">
      <!-- Celebration Banner -->
      <div class="celebration-banner mb-4">
        <span class="banner-emoji">🎉</span>
        <span class="banner-text">Your Package Has Arrived!</span>
      </div>

      <!-- Package Info Card -->
      <div class="retro-card mb-4">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="route-display d-flex align-center gap-2">
            <span class="route-city">{{ booking.origin }}</span>
            <v-icon size="16" color="#FF4DA6">mdi-arrow-right</v-icon>
            <span class="route-city">{{ booking.destination }}</span>
          </div>
          <StatusPill status="delivered" />
        </div>

        <div class="d-flex align-items-center gap-3 mb-2">
          <v-icon size="16" color="#888">mdi-briefcase-account</v-icon>
          <div>
            <span class="detail-label">TRAVELER: </span>
            <span class="detail-value">{{ booking.travelerName }}</span>
          </div>
        </div>

        <div class="d-flex align-center gap-3">
          <v-icon size="16" color="#888">mdi-calendar</v-icon>
          <div>
            <span class="detail-label">DELIVERY DATE: </span>
            <span class="detail-value">{{ booking.deliveryDate }}</span>
          </div>
        </div>
      </div>

      <!-- OTP Display -->
      <div class="lcd-card mb-4">
        <div class="otp-section-label">DELIVERY CONFIRMATION CODE</div>
        <div class="otp-divider"></div>

        <div class="otp-digits-row">
          <div
            v-for="(digit, i) in otpDigits"
            :key="i"
            class="otp-digit-box"
          >
            <span class="otp-digit-char">{{ digit }}</span>
          </div>
        </div>

        <p class="otp-hint">Share this code with the traveler to confirm delivery</p>
      </div>

      <!-- Instructions -->
      <div class="instructions-card mb-5">
        <div class="instructions-title mb-3">HOW IT WORKS</div>
        <div class="instruction-step mb-2">
          <div class="step-number">1</div>
          <div class="step-text">Traveler enters this code in their app</div>
        </div>
        <div class="instruction-step mb-2">
          <div class="step-number">2</div>
          <div class="step-text">Both parties confirm the handoff</div>
        </div>
        <div class="instruction-step">
          <div class="step-number">3</div>
          <div class="step-text">Payment is released to traveler</div>
        </div>
      </div>

      <!-- Confirm Receipt Button -->
      <v-btn
        class="retro-btn-green"
        block
        size="large"
        :loading="confirming"
        prepend-icon="mdi-package-check"
        @click="confirmReceived"
      >
        I Confirm Receipt of My Package
      </v-btn>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="340" persistent>
      <div class="retro-dialog">
        <div class="dialog-success-icon">
          <v-icon size="56" color="#3D5B3E">mdi-check-circle</v-icon>
        </div>
        <h3 class="dialog-title">Delivery Complete!</h3>
        <p class="dialog-sub">Rate your experience to complete the journey</p>

        <div class="d-flex flex-column gap-2 mt-4">
          <v-btn
            class="retro-btn"
            block
            @click="goToReview"
          >
            Rate Now ★
          </v-btn>
          <v-btn
            variant="text"
            block
            @click="skipReview"
            class="skip-btn"
          >
            Maybe Later
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockBookings } from '@/data/mock.js'
import StatusPill from '@/components/StatusPill.vue'

const router = useRouter()
const route = useRoute()

const bookingId = computed(() => route.params.id || 'b1')
const booking = ref({ ...mockBookings[0] })

const confirming = ref(false)
const successDialog = ref(false)

const otp = computed(() => booking.value.deliveryOtp || '4821')
const otpDigits = computed(() => otp.value.split(''))

async function confirmReceived() {
  confirming.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  confirming.value = false
  successDialog.value = true
}

function goToReview() {
  successDialog.value = false
  router.push('/review/' + bookingId.value)
}

function skipReview() {
  successDialog.value = false
  router.push('/')
}

onMounted(() => {
  // Merge demo data fallback
  if (!booking.value.travelerName) booking.value.travelerName = 'Alex Martin'
  if (!booking.value.deliveryDate) booking.value.deliveryDate = '2026-05-15'
})
</script>

<style scoped>
.top-bar {
  background: #E9DEEA;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0;
}

.retro-icon-btn {
  border: 2px solid #0A0A0A !important;
  background: #FAFAF7 !important;
  box-shadow: 2px 2px 0 #0A0A0A;
  flex-shrink: 0;
}

/* Celebration Banner */
.celebration-banner {
  background: linear-gradient(135deg, #FF4DA6, #ff80c2);
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 10px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-emoji {
  font-size: 24px;
}

.banner-text {
  font-family: 'Archivo', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: white;
}

/* Package Card */
.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  padding: 16px;
}

.route-city {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #0A0A0A;
}

.detail-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #aaa;
  letter-spacing: 1px;
}

.detail-value {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0A0A0A;
}

/* LCD Card */
.lcd-card {
  background: #141a14;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 380px;
  margin-left: auto;
  margin-right: auto;
}

.otp-section-label {
  font-family: 'VT323', monospace;
  font-size: 14px;
  color: #A3D977;
  letter-spacing: 3px;
  text-align: center;
  margin-bottom: 10px;
}

.otp-divider {
  width: 100%;
  height: 1px;
  background: rgba(163, 217, 119, 0.3);
  margin-bottom: 20px;
}

.otp-digits-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.otp-digit-box {
  width: 56px;
  height: 72px;
  border: 2px solid #A3D977;
  border-radius: 8px;
  background: #1a241a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.otp-digit-char {
  font-family: 'VT323', monospace;
  font-size: 48px;
  color: #A3D977;
  text-shadow: 0 0 8px #A3D977, 0 0 20px rgba(163, 217, 119, 0.4);
  line-height: 1;
}

.otp-hint {
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  color: rgba(163, 217, 119, 0.7);
  text-align: center;
  margin: 0;
}

/* Instructions */
.instructions-card {
  background: rgba(232, 169, 74, 0.12);
  border: 2px solid #E8A94A;
  box-shadow: 3px 3px 0 rgba(232, 169, 74, 0.5);
  border-radius: 8px;
  padding: 16px;
}

.instructions-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #9a6900;
  letter-spacing: 2px;
}

.instruction-step {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E8A94A;
  border: 2px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #0A0A0A;
  flex-shrink: 0;
}

.step-text {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #5a3e00;
}

/* Buttons */
.retro-btn-green {
  background: #3D5B3E !important;
  color: white !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 6px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  text-transform: none !important;
}

.retro-btn-green:active {
  box-shadow: 1px 1px 0 #0A0A0A !important;
  transform: translate(2px, 2px);
}

.retro-btn {
  background: #FF4DA6 !important;
  color: white !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 6px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.retro-btn:active {
  box-shadow: 1px 1px 0 #0A0A0A !important;
  transform: translate(2px, 2px);
}

/* Dialog */
.retro-dialog {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 12px;
  padding: 28px 24px;
  text-align: center;
}

.dialog-success-icon {
  margin-bottom: 12px;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.dialog-title {
  font-family: 'Archivo', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0 0 6px;
}

.dialog-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #666;
  margin: 0;
}

.skip-btn {
  font-family: 'Archivo', sans-serif !important;
  color: #888 !important;
  font-size: 13px !important;
}
</style>
