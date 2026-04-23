<template>
  <v-container class="pa-0" style="background: #E9DEEA; min-height: 100vh;">
    <!-- Top Bar -->
    <div class="top-bar px-4 pt-4 pb-2 d-flex align-center gap-3">
      <v-btn icon variant="text" class="retro-icon-btn" @click="router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="page-title">Scan Package QR</h1>
        <p class="page-sub">Point camera at the sender's package QR</p>
      </div>
    </div>

    <div class="px-4 pb-8">
      <!-- Scanner / Success View -->
      <transition name="flash" mode="out-in">
        <!-- SUCCESS STATE -->
        <div v-if="success" key="success" class="success-overlay retro-card d-flex flex-column align-center justify-center">
          <v-icon size="80" color="white" class="mb-3">mdi-check-circle</v-icon>
          <div class="success-text">PACKAGE VERIFIED</div>
          <div class="success-code">{{ manualCode || 'PCK-DEMO' }} confirmed</div>
        </div>

        <!-- SCANNER STATE -->
        <div v-else key="scanner">
          <!-- Viewfinder -->
          <div class="viewfinder-wrapper d-flex justify-center mb-5">
            <div class="viewfinder">
              <!-- Corner Brackets -->
              <div class="corner corner-tl"></div>
              <div class="corner corner-tr"></div>
              <div class="corner corner-bl"></div>
              <div class="corner corner-br"></div>

              <!-- LIVE Badge -->
              <div class="live-badge">
                <div class="rec-dot"></div>
                <span class="rec-text">SCANNING</span>
              </div>

              <!-- Scanning Line -->
              <div class="scan-line"></div>

              <!-- Center Grid (cosmetic) -->
              <div class="center-area">
                <div class="qr-placeholder">
                  <v-icon size="64" color="rgba(163,217,119,0.2)">mdi-qrcode</v-icon>
                </div>
              </div>

              <!-- Bottom Label -->
              <div class="scan-label">SCANNING...</div>
            </div>
          </div>

          <!-- Manual Entry -->
          <div class="divider-row mb-4">
            <div class="divider-line"></div>
            <span class="divider-text">OR ENTER CODE MANUALLY</span>
            <div class="divider-line"></div>
          </div>

          <v-text-field
            v-model="manualCode"
            placeholder="PCK-XXXX"
            variant="outlined"
            density="comfortable"
            class="retro-input mb-3"
            prepend-inner-icon="mdi-barcode"
            @input="manualCode = manualCode.toUpperCase()"
            :error="showError"
            :error-messages="showError ? 'Invalid code format. Try PCK-XXXX' : ''"
            clearable
          />

          <v-btn
            class="retro-btn"
            block
            size="large"
            :loading="verifying"
            @click="verifyCode"
          >
            VERIFY CODE
          </v-btn>
        </div>
      </transition>
    </div>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top">
      {{ snackbarMsg }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const manualCode = ref('')
const verified = ref(false)
const success = ref(false)
const verifying = ref(false)
const showError = ref(false)
const snackbar = ref(false)
const snackbarMsg = ref('')
const snackbarColor = ref('error')

function showSnackbar(msg, color = 'error') {
  snackbarMsg.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

async function verifyCode() {
  const code = manualCode.value.trim()
  if (!code) {
    showError.value = true
    showSnackbar('Please enter a pickup code')
    return
  }
  if (!code.startsWith('PCK-')) {
    showError.value = true
    showSnackbar('Invalid code format. Code must start with PCK-')
    return
  }

  showError.value = false
  verifying.value = true

  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 800))
  verifying.value = false
  success.value = true

  // Navigate back after success flash
  setTimeout(() => {
    router.back()
  }, 1500)
}
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
  line-height: 1.2;
}

.page-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #666;
  margin: 0;
}

.retro-icon-btn {
  border: 2px solid #0A0A0A !important;
  background: #FAFAF7 !important;
  box-shadow: 2px 2px 0 #0A0A0A;
  flex-shrink: 0;
}

/* Viewfinder */
.viewfinder-wrapper {
  width: 100%;
}

.viewfinder {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 300px;
  background: #141a14;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  overflow: hidden;
}

/* Corner brackets */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #A3D977;
  border-style: solid;
  z-index: 3;
}

.corner-tl {
  top: 12px;
  left: 12px;
  border-width: 3px 0 0 3px;
  border-radius: 2px 0 0 0;
}

.corner-tr {
  top: 12px;
  right: 12px;
  border-width: 3px 3px 0 0;
  border-radius: 0 2px 0 0;
}

.corner-bl {
  bottom: 12px;
  left: 12px;
  border-width: 0 0 3px 3px;
  border-radius: 0 0 0 2px;
}

.corner-br {
  bottom: 12px;
  right: 12px;
  border-width: 0 3px 3px 0;
  border-radius: 0 0 2px 0;
}

/* LIVE Badge */
.live-badge {
  position: absolute;
  top: 10px;
  right: 36px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 4;
  background: rgba(20, 26, 20, 0.8);
  padding: 3px 8px;
  border-radius: 4px;
}

.rec-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #C23B3B;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.rec-text {
  font-family: 'VT323', monospace;
  font-size: 13px;
  color: #A3D977;
  letter-spacing: 2px;
}

/* Scanning Line */
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #A3D977;
  box-shadow: 0 0 8px #A3D977, 0 0 16px #A3D977;
  z-index: 2;
  animation: scanDown 2s linear infinite;
}

@keyframes scanDown {
  0% { top: 10%; }
  50% { top: 85%; }
  50.01% { top: 10%; }
  100% { top: 10%; }
}

/* Center area */
.center-area {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bottom label */
.scan-label {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'VT323', monospace;
  font-size: 20px;
  color: #A3D977;
  letter-spacing: 4px;
  z-index: 3;
  white-space: nowrap;
}

/* Divider */
.divider-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #bbb;
}

.divider-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #888;
  letter-spacing: 1px;
  white-space: nowrap;
}

/* Input */
.retro-input :deep(.v-field) {
  border: 2px solid #0A0A0A;
  border-radius: 6px;
  background: #FAFAF7;
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  letter-spacing: 2px;
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

/* Retro card for success */
.retro-card {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  box-shadow: 4px 4px 0 #0A0A0A;
  border-radius: 8px;
  padding: 16px;
}

/* Success State */
.success-overlay {
  background: #3D5B3E !important;
  min-height: 320px;
  border-color: #0A0A0A;
  gap: 8px;
}

.success-text {
  font-family: 'VT323', monospace;
  font-size: 40px;
  color: white;
  letter-spacing: 3px;
}

.success-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
}

/* Flash transition */
.flash-enter-active,
.flash-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.flash-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.flash-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
