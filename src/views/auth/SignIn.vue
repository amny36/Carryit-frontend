<template>
  <div class="auth-page">
    <!-- Background pattern -->
    <div class="auth-bg" />

    <!-- Card -->
    <div class="auth-card card-stack animate-pop-in">

      <!-- Logo -->
      <div class="auth-logo">
        <CourierLogo :size="48" state="idle" />
        <div>
          <div style="font-weight:800; font-size:20px; letter-spacing:-0.02em;">CarryIt</div>
          <div class="serial" style="font-size:9px; color: var(--fg-3);">PASSPORT SYSTEM v2.0</div>
        </div>
      </div>

      <!-- Header -->
      <div class="auth-header hairline-bot">
        <p class="lbl" style="color: var(--fg-2);">Welcome back</p>
        <h1 style="font-size: 28px; margin-top: 4px;">Sign In</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="auth-form" novalidate>
        <!-- Email -->
        <div class="field">
          <label class="input-label" for="email">Email Address</label>
          <div class="input-field-wrap" :class="{ focused: focusedField === 'email', error: errors.email }">
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input-field"
              placeholder="you@example.com"
              autocomplete="email"
              @focus="focusedField = 'email'"
              @blur="focusedField = ''"
            />
          </div>
          <span v-if="errors.email" class="input-error-msg">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="field">
          <label class="input-label" for="password">Password</label>
          <div class="input-field-wrap" :class="{ focused: focusedField === 'password', error: errors.password }">
            <input
              id="password"
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              class="input-field"
              placeholder="••••••••"
              autocomplete="current-password"
              @focus="focusedField = 'password'"
              @blur="focusedField = ''"
            />
            <button type="button" class="field-eye" @click="showPwd = !showPwd" tabindex="-1">
              <v-icon size="16" style="color: var(--fg-3);">{{ showPwd ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}</v-icon>
            </button>
          </div>
          <span v-if="errors.password" class="input-error-msg">{{ errors.password }}</span>
        </div>

        <!-- Forgot -->
        <div style="text-align: right; margin-top: -4px;">
          <button type="button" class="link-btn" @click="handleForgot">Forgot password?</button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn-primary"
          style="width: 100%; justify-content: center; margin-top: var(--space-2);"
          :disabled="loading"
        >
          <span v-if="loading" class="lbl-sm">◌ Signing in…</span>
          <span v-else class="lbl-sm">Sign In →</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="auth-divider">
        <div class="auth-divider-line" />
        <span class="lbl-sm" style="color: var(--fg-3); padding: 0 var(--space-3);">or try demo</span>
        <div class="auth-divider-line" />
      </div>

      <!-- Demo buttons -->
      <div class="demo-group">
        <button class="demo-btn" @click="demoLogin('traveler')" :disabled="loading">
          <div class="demo-icon">✈️</div>
          <div>
            <div class="lbl-sm">Demo as Traveler</div>
            <div class="serial" style="font-size:10px; color: var(--fg-3);">Alex · ★ 4.9</div>
          </div>
          <v-icon size="14" style="color: var(--fg-3); margin-left: auto;">mdi-chevron-right</v-icon>
        </button>
        <button class="demo-btn" @click="demoLogin('sender')" :disabled="loading">
          <div class="demo-icon">📦</div>
          <div>
            <div class="lbl-sm">Demo as Sender</div>
            <div class="serial" style="font-size:10px; color: var(--fg-3);">Marie · ★ 4.7</div>
          </div>
          <v-icon size="14" style="color: var(--fg-3); margin-left: auto;">mdi-chevron-right</v-icon>
        </button>
      </div>

      <!-- Sign up link -->
      <p class="auth-switch serial" style="font-size:11px;">
        Don't have an account?
        <router-link to="/auth/signup" class="link-btn link-btn-pink">Create one →</router-link>
      </p>
    </div>

    <!-- Inline snackbar -->
    <transition name="slide-up">
      <div v-if="snack.show" class="auth-snack" :class="`auth-snack--${snack.type}`">
        {{ snack.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CourierLogo from '@/components/base/CourierLogo.vue'

const router    = useRouter()
const authStore = useAuthStore()

const showPwd     = ref(false)
const loading     = ref(false)
const focusedField = ref('')
const form   = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const snack  = reactive({ show: false, message: '', type: 'error' })

function showSnack(msg, type = 'error') {
  snack.message = msg; snack.type = type; snack.show = true
  setTimeout(() => { snack.show = false }, 3500)
}

function validate() {
  let ok = true
  errors.email = errors.password = ''
  if (!form.email)                               { errors.email = 'Email is required.'; ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Enter a valid email.'; ok = false }
  if (!form.password)                            { errors.password = 'Password is required.'; ok = false }
  return ok
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  try {
    const ok = authStore.login(form.email, form.password)
    if (ok) redirectAfterLogin()
    else showSnack('No account found. Try the demo buttons below.')
  } finally { loading.value = false }
}

async function demoLogin(role) {
  loading.value = true
  const email = role === 'traveler' ? 'alex@demo.carryit.com' : 'marie@demo.carryit.com'
  form.email = email
  try {
    const ok = authStore.login(email, 'demo')
    if (ok) redirectAfterLogin()
    else showSnack('Demo login failed. Please try again.')
  } finally { loading.value = false }
}

function redirectAfterLogin() {
  if (authStore.isTraveler) router.push('/traveler/trips')
  else router.push('/sender/search')
}

function handleForgot() {
  showSnack('Feature coming soon — stay tuned!', 'info')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  position: relative;
  overflow: hidden;
}

/* Subtle diagonal pattern */
.auth-bg {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    135deg,
    rgba(255, 77, 166, 0.04) 0px,
    rgba(255, 77, 166, 0.04) 1px,
    transparent 1px,
    transparent 40px
  );
  pointer-events: none;
}

/* Card */
.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Logo */
.auth-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5) 0;
  margin-bottom: var(--space-4);
}

/* Header */
.auth-header {
  padding: 0 var(--space-5) var(--space-5);
  margin-bottom: var(--space-5);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: 0 var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

/* Input field wrap (matching global .input-field-wrap) */
.input-field-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  background: var(--bg-surface);
  transition: box-shadow var(--dur-micro) var(--ease-out);
}
.input-field-wrap.focused { box-shadow: 3px 3px 0 0 var(--tnh-pink); }
.input-field-wrap.error   { box-shadow: 3px 3px 0 0 var(--ci-stamp-red); }

.input-field {
  flex: 1;
  padding: 12px 14px;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 500;
  color: var(--fg-1);
  background: transparent;
  border: none;
  outline: none;
}
.input-field::placeholder { color: var(--fg-3); font-weight: 400; }

.field-eye {
  padding: 0 12px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* Links */
.link-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--fg-2);
  padding: 0;
  text-decoration: underline;
  transition: color var(--dur-micro);
}
.link-btn:hover { color: var(--fg-1); }
.link-btn-pink { color: var(--tnh-pink); text-decoration: none; }
.link-btn-pink:hover { color: var(--tnh-pink-deep); }

/* Divider */
.auth-divider {
  display: flex;
  align-items: center;
  padding: var(--space-5) var(--space-5) 0;
}
.auth-divider-line {
  flex: 1;
  height: 1px;
  background: var(--border-soft);
}

/* Demo buttons */
.demo-group {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: var(--space-3) var(--space-5) 0;
}
.demo-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px var(--space-3);
  background: transparent;
  border: 1.5px solid var(--border);
  border-bottom: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background var(--dur-micro);
  color: var(--fg-1);
}
.demo-btn:last-child { border-bottom: 1.5px solid var(--border); }
.demo-btn:hover:not(:disabled) { background: var(--border-soft); }
.demo-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.demo-icon { font-size: 20px; line-height: 1; flex-shrink: 0; }

/* Switch link */
.auth-switch {
  text-align: center;
  color: var(--fg-2);
  padding: var(--space-4) var(--space-5) var(--space-5);
  margin: 0;
}

/* Snack */
.auth-snack {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  z-index: 500;
  white-space: nowrap;
}
.auth-snack--error   { background: var(--ci-stamp-red); color: var(--tnh-paper); }
.auth-snack--info    { background: var(--tnh-meadow);   color: var(--tnh-paper); }
.auth-snack--success { background: var(--tnh-meadow);   color: var(--tnh-paper); }

/* Transition */
.slide-up-enter-active, .slide-up-leave-active {
  transition: opacity var(--dur-std) var(--ease-out), transform var(--dur-std) var(--ease-out);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
