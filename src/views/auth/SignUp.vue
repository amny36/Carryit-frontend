<template>
  <div class="signup-page">
    <div class="signup-card">
      <!-- Logo -->
      <div class="card-logo">CarryIt</div>
      <h1 class="card-title">Join CarryIt</h1>
      <p class="card-subtitle">Send packages or earn on your trips</p>

      <!-- Step 1: Role selection -->
      <div class="role-section">
        <p class="role-label">I want to…</p>
        <div class="role-grid">
          <button
            class="role-card"
            :class="{ 'role-card--active': form.role === 'sender' }"
            type="button"
            @click="form.role = 'sender'"
          >
            <span class="role-icon">📦</span>
            <strong class="role-name">I'm a Sender</strong>
            <span class="role-desc">I want to ship packages</span>
          </button>
          <button
            class="role-card"
            :class="{ 'role-card--active': form.role === 'traveler' }"
            type="button"
            @click="form.role = 'traveler'"
          >
            <span class="role-icon">✈️</span>
            <strong class="role-name">I'm a Traveler</strong>
            <span class="role-desc">I want to earn carrying packages</span>
          </button>
        </div>
        <span v-if="errors.role" class="field-error">{{ errors.role }}</span>
      </div>

      <!-- Step 2: Form fields -->
      <transition name="form-slide">
        <form v-if="form.role" @submit.prevent="handleSubmit" class="signup-form" novalidate>
          <div class="fields-grid">
            <!-- Full Name -->
            <div class="field-group">
              <label class="field-label">Full Name <span class="req">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="field-input"
                :class="{ 'field-input--error': errors.name }"
                placeholder="Your full name"
              />
              <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
            </div>

            <!-- Email -->
            <div class="field-group">
              <label class="field-label">Email <span class="req">*</span></label>
              <input
                v-model="form.email"
                type="email"
                class="field-input"
                :class="{ 'field-input--error': errors.email }"
                placeholder="you@example.com"
              />
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <!-- Phone -->
            <div class="field-group">
              <label class="field-label">Phone Number <span class="req">*</span></label>
              <input
                v-model="form.phone"
                type="tel"
                class="field-input"
                :class="{ 'field-input--error': errors.phone }"
                placeholder="+33 6 12 34 56 78"
              />
              <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
            </div>

            <!-- City -->
            <div class="field-group">
              <label class="field-label">City</label>
              <input
                v-model="form.city"
                type="text"
                class="field-input"
                placeholder="Your city"
              />
            </div>

            <!-- Password -->
            <div class="field-group">
              <label class="field-label">Password <span class="req">*</span></label>
              <div class="field-input-wrap">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input"
                  :class="{ 'field-input--error': errors.password }"
                  placeholder="Min. 6 characters"
                  @input="checkStrength"
                />
                <button type="button" class="field-toggle" @click="showPassword = !showPassword">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
              <!-- Strength indicator -->
              <div v-if="form.password" class="strength-bar-wrap">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    :style="{ width: strengthPct + '%' }"
                    :class="`strength-fill--${strengthLevel}`"
                  ></div>
                </div>
                <span class="strength-label" :class="`strength-label--${strengthLevel}`">{{ strengthText }}</span>
              </div>
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </div>

            <!-- Confirm Password -->
            <div class="field-group">
              <label class="field-label">Confirm Password <span class="req">*</span></label>
              <div class="field-input-wrap">
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  class="field-input"
                  :class="{ 'field-input--error': errors.confirmPassword }"
                  placeholder="Repeat your password"
                />
                <button type="button" class="field-toggle" @click="showConfirm = !showConfirm">
                  {{ showConfirm ? '🙈' : '👁️' }}
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
            </div>
          </div>

          <!-- Terms -->
          <label class="terms-label">
            <input v-model="form.terms" type="checkbox" class="terms-check" />
            <span class="terms-text">
              I agree to the
              <button type="button" class="link-btn link-btn--pink">Terms of Service</button>
              and
              <button type="button" class="link-btn link-btn--pink">Privacy Policy</button>
            </span>
          </label>
          <span v-if="errors.terms" class="field-error">{{ errors.terms }}</span>

          <!-- Submit -->
          <button
            type="submit"
            class="btn-retro btn-pink btn-full"
            :disabled="loading"
          >
            <span v-if="loading" class="btn-loading">
              <span class="spinner"></span> Creating account…
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>
      </transition>

      <!-- Sign in link -->
      <p class="signin-link">
        Already have an account?
        <button class="link-btn link-btn--pink" @click="$router.push('/auth/signin')">Sign In</button>
      </p>
    </div>

    <!-- Snackbar -->
    <div v-if="snackbar.show" class="snackbar" :class="`snackbar--${snackbar.type}`">
      {{ snackbar.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)

const form = reactive({
  role: '',
  name: '',
  email: '',
  phone: '',
  city: '',
  password: '',
  confirmPassword: '',
  terms: false,
})

const errors = reactive({
  role: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  terms: '',
})

const snackbar = reactive({ show: false, message: '', type: 'error' })

// Password strength
const strengthPct = ref(0)
const strengthLevel = ref('weak')
const strengthText = ref('Weak')

function checkStrength() {
  const p = form.password
  let score = 0
  if (p.length >= 6) score++
  if (p.length >= 10) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++

  const map = [
    { pct: 20, level: 'weak', text: 'Weak' },
    { pct: 40, level: 'weak', text: 'Weak' },
    { pct: 60, level: 'fair', text: 'Fair' },
    { pct: 80, level: 'good', text: 'Good' },
    { pct: 100, level: 'strong', text: 'Strong' },
  ]
  const entry = map[Math.max(0, score - 1)] || map[0]
  strengthPct.value = entry.pct
  strengthLevel.value = entry.level
  strengthText.value = entry.text
}

function showSnack(message, type = 'error') {
  snackbar.message = message
  snackbar.type = type
  snackbar.show = true
  setTimeout(() => { snackbar.show = false }, 3500)
}

function validate() {
  let valid = true
  Object.keys(errors).forEach((k) => (errors[k] = ''))

  if (!form.role) {
    errors.role = 'Please select a role.'
    valid = false
  }
  if (!form.name.trim()) {
    errors.name = 'Full name is required.'
    valid = false
  }
  if (!form.email) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email.'
    valid = false
  }
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.'
    valid = false
  }
  if (!form.password) {
    errors.password = 'Password is required.'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
    valid = false
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
    valid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
    valid = false
  }
  if (!form.terms) {
    errors.terms = 'You must agree to the terms.'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      city: form.city,
      role: form.role,
      password: form.password,
    })
    router.push('/auth/verify')
  } catch (e) {
    showSnack('Registration failed. Please check your details and try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');

.signup-page {
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

.signup-card {
  background: #fafaf7;
  border: 2px solid #0a0a0a;
  border-radius: 12px;
  box-shadow: 6px 6px 0 #0a0a0a;
  padding: 40px 36px;
  width: 100%;
  max-width: 500px;
}

.card-logo {
  font-size: 2rem;
  font-weight: 800;
  color: #ff4da6;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.03em;
}
.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  margin: 0 0 6px;
  color: #0a0a0a;
}
.card-subtitle {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 28px;
}

/* Role selection */
.role-section { margin-bottom: 24px; }
.role-label {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0a0a0a;
  margin-bottom: 10px;
  display: block;
}
.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 14px;
  background: #fff;
  border: 2px solid #0a0a0a;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.1s;
  box-shadow: 3px 3px 0 #0a0a0a;
}
.role-card:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #0a0a0a;
}
.role-card:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #0a0a0a;
}
.role-card--active {
  border-color: #ff4da6;
  background: rgba(255, 77, 166, 0.07);
  box-shadow: 3px 3px 0 #ff4da6;
}
.role-icon { font-size: 2rem; }
.role-name {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0a0a0a;
}
.role-desc {
  font-size: 0.76rem;
  color: #777;
}

/* Form */
.signup-form { display: flex; flex-direction: column; gap: 16px; }
.fields-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 480px) {
  .fields-grid { grid-template-columns: 1fr 1fr; }
}

.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0a0a0a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.req { color: #ff4da6; }
.field-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #0a0a0a;
  border-radius: 6px;
  background: #fff;
  font-family: 'Archivo', sans-serif;
  font-size: 0.9rem;
  color: #0a0a0a;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus {
  border-color: #ff4da6;
  box-shadow: 0 0 0 3px rgba(255, 77, 166, 0.15);
}
.field-input--error { border-color: #c23b3b; }
.field-input-wrap { position: relative; }
.field-input-wrap .field-input { padding-right: 42px; }
.field-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 2px;
}
.field-error {
  font-size: 0.75rem;
  color: #c23b3b;
  font-weight: 600;
}

/* Strength */
.strength-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.strength-bar {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background 0.3s;
}
.strength-fill--weak { background: #c23b3b; }
.strength-fill--fair { background: #e8a94a; }
.strength-fill--good { background: #3d8c3f; }
.strength-fill--strong { background: #a3d977; }
.strength-label {
  font-size: 0.72rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  min-width: 44px;
}
.strength-label--weak { color: #c23b3b; }
.strength-label--fair { color: #e8a94a; }
.strength-label--good { color: #3d8c3f; }
.strength-label--strong { color: #a3d977; }

/* Terms */
.terms-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}
.terms-check {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
  accent-color: #ff4da6;
  cursor: pointer;
}
.terms-text {
  font-size: 0.84rem;
  color: #444;
  line-height: 1.5;
}

/* Buttons */
.btn-retro {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 1rem;
  padding: 13px 28px;
  border: 2px solid #0a0a0a;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #0a0a0a;
  transition: box-shadow 0.1s, transform 0.1s;
  letter-spacing: 0.02em;
}
.btn-retro:active:not(:disabled) {
  box-shadow: 1px 1px 0 #0a0a0a;
  transform: translate(2px, 2px);
}
.btn-retro:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-pink { background: #ff4da6; color: #fff; }
.btn-full { width: 100%; text-align: center; }

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
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

.link-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Archivo', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #555;
  padding: 0;
  text-decoration: underline;
  transition: color 0.15s;
}
.link-btn:hover { color: #0a0a0a; }
.link-btn--pink { color: #ff4da6; }
.link-btn--pink:hover { color: #d63d8a; }

.signin-link {
  text-align: center;
  font-size: 0.88rem;
  color: #555;
  margin-top: 20px;
  margin-bottom: 0;
}

/* Transition */
.form-slide-enter-active { transition: all 0.35s ease; }
.form-slide-enter-from { opacity: 0; transform: translateY(16px); }

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
.snackbar--error { background: #c23b3b; color: #fff; }
.snackbar--info { background: #3d5b3e; color: #fff; }
@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
