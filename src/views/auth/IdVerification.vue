<template>
  <div class="kyc-page">
    <div class="kyc-card">
      <!-- Header -->
      <div class="card-logo">CarryIt</div>
      <h1 class="card-title">Verify Your Identity</h1>
      <p class="card-subtitle">Required to post trips or book cargo</p>

      <!-- Progress -->
      <div class="progress-steps">
        <div
          v-for="(step, i) in progressSteps"
          :key="i"
          class="progress-step"
          :class="{
            'progress-step--active': currentStep === i + 1,
            'progress-step--done': currentStep > i + 1,
          }"
        >
          <div class="progress-dot">
            <span v-if="currentStep > i + 1">✓</span>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="progress-label">{{ step }}</span>
        </div>
        <div class="progress-line"></div>
      </div>

      <!-- STEP 1: Upload ID -->
      <transition name="slide-fade" mode="out-in">
        <div v-if="currentStep === 1" key="step1" class="step-body">
          <div class="step-heading">
            <span class="step-num">Step 1 of 2</span>
            <h2 class="step-title">Upload Government ID</h2>
          </div>

          <div
            class="upload-zone"
            :class="{ 'upload-zone--has-file': idPreview, 'upload-zone--drag': idDrag }"
            @click="triggerIdInput"
            @dragover.prevent="idDrag = true"
            @dragleave="idDrag = false"
            @drop.prevent="handleIdDrop"
          >
            <input
              ref="idInput"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              class="hidden-input"
              @change="handleIdChange"
            />
            <div v-if="!idPreview" class="upload-placeholder">
              <div class="upload-icon">🪪</div>
              <p class="upload-main">Click to upload your Government ID</p>
              <p class="upload-hint">JPG, PNG or PDF · Max 10 MB</p>
            </div>
            <div v-else class="upload-preview">
              <img v-if="idPreviewType === 'image'" :src="idPreview" class="preview-img" alt="ID preview" />
              <div v-else class="pdf-preview">
                <span class="pdf-icon">📄</span>
                <span class="pdf-name">{{ idFileName }}</span>
              </div>
              <button type="button" class="remove-btn" @click.stop="clearId">✕</button>
            </div>
          </div>

          <!-- Accepted doc types -->
          <div class="accepted-docs">
            <p class="accepted-title">Accepted documents</p>
            <div class="accepted-list">
              <span class="accepted-badge">🛂 Passport</span>
              <span class="accepted-badge">🪪 National ID</span>
              <span class="accepted-badge">🚗 Driver's License</span>
            </div>
          </div>
          <span v-if="errors.id" class="field-error">{{ errors.id }}</span>

          <button class="btn-retro btn-pink btn-full" @click="goStep2">
            Continue to Selfie →
          </button>
        </div>

        <!-- STEP 2: Selfie -->
        <div v-else-if="currentStep === 2" key="step2" class="step-body">
          <div class="step-heading">
            <span class="step-num">Step 2 of 2</span>
            <h2 class="step-title">Take a Selfie with Your ID</h2>
          </div>

          <div
            class="upload-zone"
            :class="{ 'upload-zone--has-file': selfiePreview, 'upload-zone--drag': selfieDrag }"
            @click="triggerSelfieInput"
            @dragover.prevent="selfieDrag = true"
            @dragleave="selfieDrag = false"
            @drop.prevent="handleSelfieDrop"
          >
            <input
              ref="selfieInput"
              type="file"
              accept=".jpg,.jpeg,.png"
              class="hidden-input"
              @change="handleSelfieChange"
            />
            <div v-if="!selfiePreview" class="upload-placeholder">
              <div class="upload-icon">🤳</div>
              <p class="upload-main">Take a selfie holding your ID</p>
              <p class="upload-hint">Make sure your face and ID are both visible</p>
            </div>
            <div v-else class="upload-preview">
              <img :src="selfiePreview" class="preview-img" alt="Selfie preview" />
              <button type="button" class="remove-btn" @click.stop="clearSelfie">✕</button>
            </div>
          </div>

          <div class="tip-box">
            <span class="tip-icon">💡</span>
            <div>
              <strong>Tips for a good selfie:</strong>
              <ul class="tip-list">
                <li>Good lighting — no shadows on your face</li>
                <li>Hold your ID clearly visible next to your face</li>
                <li>Remove glasses or hats if possible</li>
              </ul>
            </div>
          </div>

          <span v-if="errors.selfie" class="field-error">{{ errors.selfie }}</span>

          <div class="step2-actions">
            <button class="btn-ghost-back" @click="currentStep = 1">← Back</button>
            <button
              class="btn-retro btn-pink"
              :disabled="loading"
              @click="handleSubmit"
            >
              <span v-if="loading" class="btn-loading">
                <span class="spinner"></span> Submitting…
              </span>
              <span v-else>Submit for Verification</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Info notice -->
      <div class="info-notice">
        <span>⏱</span>
        <span>Verification takes <strong>1–2 business days</strong>. We'll notify you by email.</span>
      </div>

      <!-- Skip -->
      <div class="skip-wrap">
        <button class="link-btn" @click="handleSkip">Skip for now</button>
      </div>
    </div>

    <!-- Snackbar -->
    <div v-if="snackbar.show" class="snackbar" :class="`snackbar--${snackbar.type}`">
      {{ snackbar.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const currentStep = ref(1)
const loading = ref(false)
const progressSteps = ['Upload ID', 'Selfie']

// ID upload
const idInput = ref(null)
const idPreview = ref('')
const idPreviewType = ref('image')
const idFileName = ref('')
const idDrag = ref(false)

// Selfie upload
const selfieInput = ref(null)
const selfiePreview = ref('')
const selfieDrag = ref(false)

const errors = reactive({ id: '', selfie: '' })
const snackbar = reactive({ show: false, message: '', type: 'success' })

function showSnack(message, type = 'success') {
  snackbar.message = message
  snackbar.type = type
  snackbar.show = true
  setTimeout(() => { snackbar.show = false }, 4000)
}

function triggerIdInput() {
  idInput.value?.click()
}
function triggerSelfieInput() {
  selfieInput.value?.click()
}

function handleIdChange(e) {
  const file = e.target.files[0]
  if (file) processIdFile(file)
}
function handleIdDrop(e) {
  idDrag.value = false
  const file = e.dataTransfer.files[0]
  if (file) processIdFile(file)
}
function processIdFile(file) {
  errors.id = ''
  idFileName.value = file.name
  if (file.type === 'application/pdf') {
    idPreviewType.value = 'pdf'
    idPreview.value = 'pdf'
  } else {
    idPreviewType.value = 'image'
    const reader = new FileReader()
    reader.onload = (e) => { idPreview.value = e.target.result }
    reader.readAsDataURL(file)
  }
}
function clearId() {
  idPreview.value = ''
  idPreviewType.value = 'image'
  idFileName.value = ''
  if (idInput.value) idInput.value.value = ''
}

function handleSelfieChange(e) {
  const file = e.target.files[0]
  if (file) processSelfieFile(file)
}
function handleSelfieDrop(e) {
  selfieDrag.value = false
  const file = e.dataTransfer.files[0]
  if (file) processSelfieFile(file)
}
function processSelfieFile(file) {
  errors.selfie = ''
  const reader = new FileReader()
  reader.onload = (e) => { selfiePreview.value = e.target.result }
  reader.readAsDataURL(file)
}
function clearSelfie() {
  selfiePreview.value = ''
  if (selfieInput.value) selfieInput.value.value = ''
}

function goStep2() {
  if (!idPreview.value) {
    errors.id = 'Please upload your government ID to continue.'
    return
  }
  errors.id = ''
  currentStep.value = 2
}

async function handleSubmit() {
  if (!selfiePreview.value) {
    errors.selfie = 'Please upload a selfie holding your ID.'
    return
  }
  errors.selfie = ''
  loading.value = true
  await new Promise((r) => setTimeout(r, 1500))
  loading.value = false
  showSnack('Documents submitted! We\'ll notify you within 48h.', 'success')
  setTimeout(() => router.push('/auth/profile-setup'), 1800)
}

function handleSkip() {
  const dest = authStore.isTraveler ? '/traveler/trips' : '/sender/search'
  router.push(dest)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');

.kyc-page {
  min-height: 100vh;
  background: #e9deea;
  background-image: repeating-linear-gradient(
    135deg,
    rgba(255, 77, 166, 0.05) 0px,
    rgba(255, 77, 166, 0.05) 1px,
    transparent 1px,
    transparent 40px
  );
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  font-family: 'Archivo', sans-serif;
}

.kyc-card {
  background: #fafaf7;
  border: 2px solid #0a0a0a;
  border-radius: 12px;
  box-shadow: 6px 6px 0 #0a0a0a;
  padding: 40px 36px;
  width: 100%;
  max-width: 500px;
}

.card-logo {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ff4da6;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.03em;
}
.card-title {
  font-size: 1.4rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 6px;
  color: #0a0a0a;
}
.card-subtitle {
  text-align: center;
  color: #666;
  font-size: 0.88rem;
  margin: 0 0 28px;
}

/* Progress */
.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 32px;
  gap: 0;
}
.progress-line {
  position: absolute;
  top: 17px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: #e0e0e0;
  z-index: 0;
}
.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  z-index: 1;
}
.progress-dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  color: #aaa;
  transition: all 0.25s;
}
.progress-step--active .progress-dot {
  border-color: #ff4da6;
  background: #ff4da6;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(255, 77, 166, 0.2);
}
.progress-step--done .progress-dot {
  border-color: #3d5b3e;
  background: #3d5b3e;
  color: #fff;
}
.progress-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #aaa;
}
.progress-step--active .progress-label { color: #ff4da6; }
.progress-step--done .progress-label { color: #3d5b3e; }

/* Step body */
.step-body { display: flex; flex-direction: column; gap: 18px; }
.step-heading { display: flex; flex-direction: column; gap: 4px; }
.step-num {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ff4da6;
  font-family: 'JetBrains Mono', monospace;
}
.step-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0a0a0a;
  margin: 0;
}

/* Upload zone */
.upload-zone {
  border: 2px dashed #bbb;
  border-radius: 10px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;
  background: #fff;
}
.upload-zone:hover {
  border-color: #ff4da6;
  background: rgba(255, 77, 166, 0.03);
}
.upload-zone--drag {
  border-color: #ff4da6;
  background: rgba(255, 77, 166, 0.06);
}
.upload-zone--has-file {
  border-style: solid;
  border-color: #3d5b3e;
}
.hidden-input {
  display: none;
}
.upload-placeholder {
  text-align: center;
  padding: 28px 20px;
}
.upload-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}
.upload-main {
  font-weight: 700;
  font-size: 0.95rem;
  color: #0a0a0a;
  margin: 0 0 6px;
}
.upload-hint {
  font-size: 0.78rem;
  color: #888;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
}
.upload-preview {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}
.preview-img {
  max-width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 6px;
}
.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
}
.pdf-icon { font-size: 3rem; }
.pdf-name {
  font-size: 0.82rem;
  color: #555;
  font-family: 'JetBrains Mono', monospace;
  word-break: break-all;
  text-align: center;
}
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #c23b3b;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: background 0.15s;
}
.remove-btn:hover { background: #a52e2e; }

/* Accepted docs */
.accepted-docs {}
.accepted-title {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin: 0 0 8px;
}
.accepted-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.accepted-badge {
  background: #f0f0ec;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #444;
}

/* Tip box */
.tip-box {
  background: rgba(200, 220, 234, 0.3);
  border: 1px solid #c8dcea;
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.tip-icon { font-size: 1.2rem; flex-shrink: 0; }
.tip-box strong { font-size: 0.85rem; display: block; margin-bottom: 6px; }
.tip-list {
  margin: 0;
  padding-left: 18px;
}
.tip-list li {
  font-size: 0.82rem;
  color: #555;
  margin-bottom: 4px;
  line-height: 1.4;
}

/* Step 2 actions */
.step2-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
.btn-ghost-back {
  background: none;
  border: 2px solid #0a0a0a;
  border-radius: 6px;
  padding: 11px 18px;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-ghost-back:hover { background: #f0f0ec; }

/* Buttons */
.btn-retro {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  padding: 13px 24px;
  border: 2px solid #0a0a0a;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #0a0a0a;
  transition: box-shadow 0.1s, transform 0.1s;
}
.btn-retro:active:not(:disabled) {
  box-shadow: 1px 1px 0 #0a0a0a;
  transform: translate(2px, 2px);
}
.btn-retro:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-pink { background: #ff4da6; color: #fff; }
.btn-full { width: 100%; text-align: center; }
.btn-loading { display: flex; align-items: center; justify-content: center; gap: 8px; }
.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.field-error {
  font-size: 0.75rem;
  color: #c23b3b;
  font-weight: 600;
}

/* Info notice */
.info-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(232, 169, 74, 0.12);
  border: 1px solid #e8a94a55;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.84rem;
  color: #555;
  margin-top: 8px;
}
.info-notice strong { color: #0a0a0a; }

/* Skip */
.skip-wrap {
  text-align: center;
  margin-top: 6px;
}
.link-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Archivo', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  padding: 0;
  text-decoration: underline;
  transition: color 0.15s;
}
.link-btn:hover { color: #0a0a0a; }

/* Transition */
.slide-fade-enter-active,
.slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-20px); }

/* Snackbar */
.snackbar {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 24px;
  border-radius: 8px;
  border: 2px solid #0a0a0a;
  box-shadow: 3px 3px 0 #0a0a0a;
  font-family: 'Archivo', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 999;
  white-space: nowrap;
  animation: slideUp 0.3s ease;
}
.snackbar--success { background: #3d5b3e; color: #fff; }
.snackbar--error { background: #c23b3b; color: #fff; }
@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
