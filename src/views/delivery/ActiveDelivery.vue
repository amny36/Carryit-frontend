<template>
  <v-container class="pa-0" style="background: #E9DEEA; min-height: 100vh;">
    <!-- Top Bar -->
    <div class="top-bar px-4 pt-4 pb-2 d-flex align-center gap-3">
      <v-btn
        icon
        variant="text"
        class="retro-icon-btn"
        @click="router.back()"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="page-title">Active Delivery</h1>
    </div>

    <div class="px-4 pb-24">
      <!-- Booking Info Card -->
      <div class="retro-card mb-4">
        <!-- Route -->
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="route-display d-flex align-center gap-2">
            <span class="route-city">{{ booking.origin }}</span>
            <v-icon size="18" color="#FF4DA6">mdi-arrow-right</v-icon>
            <span class="route-city">{{ booking.destination }}</span>
          </div>
          <StatusPill :status="booking.status" />
        </div>

        <!-- Sender Info -->
        <div class="d-flex align-center gap-3 mb-3">
          <div class="avatar-circle">{{ senderInitials }}</div>
          <div>
            <div class="sender-label">SENDER</div>
            <div class="sender-name">{{ booking.senderName }}</div>
          </div>
        </div>

        <!-- Package Info -->
        <div class="d-flex align-center gap-2 mb-3">
          <v-icon size="20" color="#3D5B3E">{{ categoryIcon }}</v-icon>
          <span class="package-desc">{{ booking.packageDescription }}</span>
        </div>

        <!-- Pickup Code -->
        <div class="pickup-code-badge">
          <span class="pickup-code-label">PICKUP CODE:</span>
          <span class="pickup-code-value">{{ booking.pickupCode }}</span>
        </div>
      </div>

      <!-- Delivery Status Stepper -->
      <div class="retro-card mb-4">
        <h2 class="section-title mb-4">Delivery Status</h2>

        <div class="stepper">
          <!-- Step 1: Scan QR -->
          <div class="step" :class="getStepClass(0)">
            <div class="step-indicator">
              <div class="step-icon-circle" :class="getIconClass(0)">
                <v-icon v-if="currentStep > 0" size="16" color="white">mdi-check</v-icon>
                <v-icon v-else size="16" :color="currentStep === 0 ? '#FF4DA6' : '#aaa'">mdi-qrcode-scan</v-icon>
              </div>
              <div class="step-line" :class="{ done: currentStep > 0 }"></div>
            </div>
            <div class="step-content">
              <div class="step-title">Scan Package QR Code</div>
              <div class="step-sub">Scan sender's QR at pickup point</div>
              <v-btn
                v-if="currentStep === 0"
                class="retro-btn mt-2"
                block
                @click="router.push('/delivery/scan')"
              >
                SCAN QR CODE →
              </v-btn>
            </div>
          </div>

          <!-- Step 2: Confirm Pickup -->
          <div class="step" :class="getStepClass(1)">
            <div class="step-indicator">
              <div class="step-icon-circle" :class="getIconClass(1)">
                <v-icon v-if="currentStep > 1" size="16" color="white">mdi-check</v-icon>
                <v-icon v-else size="16" :color="currentStep === 1 ? '#FF4DA6' : '#aaa'">mdi-package-check</v-icon>
              </div>
              <div class="step-line" :class="{ done: currentStep > 1 }"></div>
            </div>
            <div class="step-content">
              <div class="step-title">Confirm Package Pickup</div>
              <div class="step-sub">Verify package details before departure</div>
              <v-btn
                v-if="currentStep === 1"
                class="retro-btn mt-2"
                block
                @click="router.push('/delivery/handoff/' + bookingId)"
              >
                CONFIRM PICKUP
              </v-btn>
              <v-btn
                v-else-if="currentStep < 1"
                class="retro-btn-disabled mt-2"
                block
                disabled
              >
                CONFIRM PICKUP
              </v-btn>
            </div>
          </div>

          <!-- Step 3: In Transit -->
          <div class="step" :class="getStepClass(2)">
            <div class="step-indicator">
              <div class="step-icon-circle" :class="getIconClass(2)">
                <v-icon v-if="currentStep > 2" size="16" color="white">mdi-check</v-icon>
                <v-icon v-else size="16" :color="currentStep === 2 ? '#FF4DA6' : '#aaa'">mdi-airplane-takeoff</v-icon>
              </div>
              <div class="step-line" :class="{ done: currentStep > 2 }"></div>
            </div>
            <div class="step-content">
              <div class="step-title">In Transit</div>
              <div class="step-sub">Package is on the way</div>
              <div v-if="currentStep === 2" class="d-flex align-center gap-2 mt-2">
                <div class="pulse-dot"></div>
                <span class="transit-label">Traveling now...</span>
              </div>
            </div>
          </div>

          <!-- Step 4: Confirm Delivery (OTP) -->
          <div class="step step-last" :class="getStepClass(3)">
            <div class="step-indicator">
              <div class="step-icon-circle" :class="getIconClass(3)">
                <v-icon v-if="currentStep > 3" size="16" color="white">mdi-check</v-icon>
                <v-icon v-else size="16" :color="currentStep === 3 ? '#FF4DA6' : '#aaa'">mdi-lock-check</v-icon>
              </div>
            </div>
            <div class="step-content">
              <div class="step-title">Confirm Delivery (OTP)</div>
              <div class="step-sub">Enter recipient's 4-digit code</div>
              <v-btn
                v-if="currentStep === 3"
                class="retro-btn mt-2"
                block
                @click="otpDialog = true"
              >
                ENTER DELIVERY OTP
              </v-btn>
              <v-btn
                v-else-if="currentStep < 3"
                class="retro-btn-disabled mt-2"
                block
                disabled
              >
                ENTER DELIVERY OTP
              </v-btn>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Sender Button -->
      <v-btn
        class="retro-btn-ghost"
        block
        prepend-icon="mdi-message-outline"
        @click="router.push('/chat/' + booking.conversationId)"
      >
        Message Sender
      </v-btn>
    </div>

    <!-- OTP Dialog -->
    <v-dialog v-model="otpDialog" max-width="340">
      <div class="retro-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">Enter Delivery OTP</h3>
          <p class="dialog-sub">Ask the recipient for their 4-digit code</p>
        </div>

        <div class="otp-inputs d-flex gap-2 justify-center my-4">
          <input
            v-for="(digit, i) in otpDigits"
            :key="i"
            :ref="el => otpRefs[i] = el"
            v-model="otpDigits[i]"
            class="otp-input"
            type="text"
            maxlength="1"
            inputmode="numeric"
            @input="handleOtpInput(i)"
            @keydown.backspace="handleOtpBackspace(i)"
            :class="{ shake: otpError }"
          />
        </div>

        <p v-if="otpError" class="otp-error">Incorrect code. Try again.</p>

        <div class="d-flex gap-2 mt-2">
          <v-btn variant="text" @click="closeOtpDialog" class="flex-1">Cancel</v-btn>
          <v-btn class="retro-btn flex-1" @click="verifyOtp">VERIFY</v-btn>
        </div>
      </div>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="#3D5B3E" timeout="2000" location="top">
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      Delivery confirmed!
    </v-snackbar>
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

const currentStep = ref(0)
const qrScanned = ref(false)
const otpDialog = ref(false)
const otpDigits = ref(['', '', '', ''])
const otpRefs = ref([])
const otpError = ref(false)
const showSuccess = ref(false)

const senderInitials = computed(() => {
  const name = booking.value.senderName || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const categoryIcon = computed(() => {
  const icons = {
    electronics: 'mdi-laptop',
    documents: 'mdi-file-document',
    clothing: 'mdi-tshirt-crew',
    food: 'mdi-food',
    default: 'mdi-package-variant'
  }
  return icons[booking.value.packageCategory] || icons.default
})

function getStepClass(step) {
  if (currentStep.value > step) return 'step-done'
  if (currentStep.value === step) return 'step-active'
  return 'step-pending'
}

function getIconClass(step) {
  if (currentStep.value > step) return 'icon-done'
  if (currentStep.value === step) return 'icon-active'
  return 'icon-pending'
}

function handleOtpInput(index) {
  otpError.value = false
  const val = otpDigits.value[index]
  if (val && index < 3) {
    otpRefs.value[index + 1]?.focus()
  }
}

function handleOtpBackspace(index) {
  if (!otpDigits.value[index] && index > 0) {
    otpDigits.value[index - 1] = ''
    otpRefs.value[index - 1]?.focus()
  }
}

function closeOtpDialog() {
  otpDialog.value = false
  otpDigits.value = ['', '', '', '']
  otpError.value = false
}

function verifyOtp() {
  const entered = otpDigits.value.join('')
  const correct = booking.value.deliveryOtp || '4821'
  if (entered === correct) {
    otpDialog.value = false
    showSuccess.value = true
    currentStep.value = 4
    setTimeout(() => {
      router.push('/review/' + bookingId.value)
    }, 1500)
  } else {
    otpError.value = true
    setTimeout(() => { otpError.value = false }, 600)
  }
}

onMounted(() => {
  const status = booking.value.status
  if (status === 'confirmed') currentStep.value = 0
  else if (status === 'picked_up') currentStep.value = 2
  else if (status === 'in_transit') currentStep.value = 2
  else if (status === 'delivered') currentStep.value = 4
  else currentStep.value = 0
})
</script>

<style scoped>
.top-bar {
  background: #E9DEEA;
  display: flex;
  align-items: center;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0;
}

.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  padding: 16px;
}

.retro-icon-btn {
  border: 2px solid #0A0A0A !important;
  background: #FAFAF7 !important;
  box-shadow: 2px 2px 0 #0A0A0A;
}

.route-city {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #0A0A0A;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FF4DA6;
  color: white;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0A0A0A;
  flex-shrink: 0;
}

.sender-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #888;
  letter-spacing: 2px;
}

.sender-name {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #0A0A0A;
}

.package-desc {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #333;
}

.pickup-code-badge {
  background: #E8A94A;
  border: 2px solid #0A0A0A;
  border-radius: 6px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.pickup-code-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #0A0A0A;
  letter-spacing: 1px;
}

.pickup-code-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: #0A0A0A;
  letter-spacing: 3px;
}

.section-title {
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0A0A0A;
}

/* Stepper */
.stepper {
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  gap: 12px;
  padding-bottom: 4px;
}

.step-last {
  padding-bottom: 0;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0A0A0A;
  flex-shrink: 0;
}

.icon-done { background: #3D5B3E; }
.icon-active { background: #FF4DA6; }
.icon-pending { background: #e0e0e0; }

.step-line {
  width: 2px;
  flex: 1;
  min-height: 24px;
  background: #ddd;
  margin: 4px 0;
}

.step-line.done {
  background: #3D5B3E;
}

.step-content {
  flex: 1;
  padding-bottom: 16px;
}

.step-done .step-title {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #888;
  text-decoration: line-through;
}

.step-active .step-title {
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0A0A0A;
}

.step-pending .step-title {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #bbb;
}

.step-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
}

.step-active .step-sub {
  color: #666;
}

.step-done .step-content {
  border-left: 3px solid #3D5B3E;
  padding-left: 8px;
  margin-left: -8px;
}

.step-active .step-content {
  border-left: 3px solid #FF4DA6;
  padding-left: 8px;
  margin-left: -8px;
}

.step-pending .step-content {
  border-left: 3px dashed #ddd;
  padding-left: 8px;
  margin-left: -8px;
}

/* Pulse dot */
.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #FF4DA6;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.transit-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #FF4DA6;
  letter-spacing: 1px;
}

/* Buttons */
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

.retro-btn-disabled {
  background: #f0f0f0 !important;
  color: #bbb !important;
  border: 2px solid #ddd !important;
  box-shadow: none !important;
  border-radius: 6px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
}

.retro-btn-ghost {
  background: transparent !important;
  color: #3D5B3E !important;
  border: 2px solid #3D5B3E !important;
  box-shadow: 3px 3px 0 #3D5B3E !important;
  border-radius: 6px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px;
}

.pb-24 {
  padding-bottom: 96px;
}

/* OTP Dialog */
.retro-dialog {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 12px;
  padding: 24px;
}

.dialog-header {
  text-align: center;
  margin-bottom: 8px;
}

.dialog-title {
  font-family: 'Archivo', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0A0A0A;
  margin: 0 0 4px;
}

.dialog-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #666;
  margin: 0;
}

.otp-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.otp-input {
  width: 56px;
  height: 64px;
  border: 2px solid #0A0A0A;
  border-radius: 8px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  color: #0A0A0A;
  background: white;
  outline: none;
  box-shadow: 2px 2px 0 #0A0A0A;
  transition: border-color 0.2s;
}

.otp-input:focus {
  border-color: #FF4DA6;
  box-shadow: 2px 2px 0 #FF4DA6;
}

.otp-error {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #C23B3B;
  text-align: center;
  margin: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.shake {
  animation: shake 0.4s ease;
}

.flex-1 { flex: 1; }
</style>
