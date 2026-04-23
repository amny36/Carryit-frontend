<template>
  <div class="page-container has-bottom-nav animate-rise-in">

    <!-- Page header -->
    <div class="page-header hairline-bot" style="padding-bottom: var(--space-5); margin-bottom: var(--space-6);">
      <p class="serial">CarryIt / Settings</p>
      <h1 style="font-size: var(--fs-h1); margin-top: var(--space-2);">Settings</h1>
    </div>

    <!-- Settings sections -->
    <div class="settings-list">

      <!-- Appearance -->
      <section class="settings-section">
        <p class="section-title lbl" style="color: var(--fg-2); margin-bottom: var(--space-3);">Appearance</p>

        <div class="settings-card card-stack">
          <!-- Dark mode row -->
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">
                <v-icon size="16" style="margin-right: 6px;">mdi-weather-night</v-icon>
                Dark Mode
              </div>
              <p class="setting-desc serial" style="font-size:10px; margin-top: 2px;">
                Travel-themed dark UI, stored locally
              </p>
            </div>
            <div class="toggle-group">
              <button
                class="toggle-option lbl-sm"
                :class="{ active: !appStore.darkMode }"
                @click="appStore.setDarkMode(false)"
              >Light</button>
              <button
                class="toggle-option lbl-sm"
                :class="{ active: appStore.darkMode }"
                @click="appStore.setDarkMode(true)"
              >Dark</button>
            </div>
          </div>

          <div class="setting-divider" />

          <!-- Accent color row (visual only — future feature) -->
          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">
                <v-icon size="16" style="margin-right: 6px;">mdi-palette-outline</v-icon>
                Accent Color
              </div>
              <p class="setting-desc serial" style="font-size:10px; margin-top: 2px;">
                Choose your brand accent
              </p>
            </div>
            <div class="accent-swatches">
              <button
                v-for="swatch in swatches"
                :key="swatch.value"
                class="swatch"
                :class="{ active: selectedAccent === swatch.value }"
                :style="{ background: swatch.value }"
                :title="swatch.name"
                @click="selectedAccent = swatch.value"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Account -->
      <section class="settings-section">
        <p class="section-title lbl" style="color: var(--fg-2); margin-bottom: var(--space-3);">Account</p>

        <div class="settings-card card-stack">
          <router-link to="/profile" class="setting-row setting-link">
            <div class="setting-info">
              <div class="setting-name">
                <v-icon size="16" style="margin-right: 6px;">mdi-account-outline</v-icon>
                Edit Profile
              </div>
            </div>
            <v-icon size="16" style="color: var(--fg-3);">mdi-chevron-right</v-icon>
          </router-link>

          <div class="setting-divider" />

          <div class="setting-row setting-link" style="cursor: default;">
            <div class="setting-info">
              <div class="setting-name">
                <v-icon size="16" style="margin-right: 6px;">mdi-shield-account-outline</v-icon>
                KYC Verification
              </div>
              <p class="setting-desc serial" style="font-size:10px; margin-top: 2px;">
                Identity documents
              </p>
            </div>
            <span class="pill pill-pending" style="font-size:9px; padding: 3px 8px;">
              {{ authStore.user?.kycStatus || 'pending' }}
            </span>
          </div>

          <div class="setting-divider" />

          <div class="setting-row" style="cursor: default;">
            <div class="setting-info">
              <div class="setting-name">
                <v-icon size="16" style="margin-right: 6px;">mdi-bell-outline</v-icon>
                Notifications
              </div>
            </div>
            <span class="serial" style="font-size:10px; color: var(--fg-3);">Coming soon</span>
          </div>
        </div>
      </section>

      <!-- About -->
      <section class="settings-section">
        <p class="section-title lbl" style="color: var(--fg-2); margin-bottom: var(--space-3);">About</p>

        <div class="settings-card card-stack">
          <router-link to="/about" class="setting-row setting-link">
            <div class="setting-info">
              <div class="setting-name">
                <v-icon size="16" style="margin-right: 6px;">mdi-information-outline</v-icon>
                How CarryIt Works
              </div>
            </div>
            <v-icon size="16" style="color: var(--fg-3);">mdi-chevron-right</v-icon>
          </router-link>

          <div class="setting-divider" />

          <div class="setting-row">
            <div class="setting-info">
              <div class="setting-name">
                <v-icon size="16" style="margin-right: 6px;">mdi-tag-outline</v-icon>
                Version
              </div>
            </div>
            <span class="serial" style="font-size:10px; color: var(--fg-3);">v2.0.0-beta</span>
          </div>
        </div>
      </section>

      <!-- Danger zone -->
      <section class="settings-section">
        <p class="section-title lbl" style="color: var(--ci-stamp-red); margin-bottom: var(--space-3);">Danger Zone</p>

        <div class="settings-card card-stack" style="border-color: var(--ci-stamp-red);">
          <button class="setting-row setting-link" style="width:100%; text-align:left;" @click="handleLogout">
            <div class="setting-info">
              <div class="setting-name" style="color: var(--ci-stamp-red);">
                <v-icon size="16" style="margin-right: 6px; color: var(--ci-stamp-red);">mdi-logout</v-icon>
                Log Out
              </div>
            </div>
            <v-icon size="16" style="color: var(--ci-stamp-red);">mdi-chevron-right</v-icon>
          </button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const router    = useRouter()
const authStore = useAuthStore()
const appStore  = useAppStore()

const swatches = [
  { name: 'Pink',    value: '#FF4DA6' },
  { name: 'Meadow',  value: '#3D5B3E' },
  { name: 'Amber',   value: '#E8A94A' },
  { name: 'Phosphor',value: '#A3D977' },
]
const selectedAccent = ref('#FF4DA6')

const handleLogout = () => {
  authStore.logout()
  appStore.showSnackbar('Logged out successfully', 'success')
  router.push('/auth/signin')
}
</script>

<style scoped>
.settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.settings-section { display: flex; flex-direction: column; }

.settings-card {
  padding: 0;
  overflow: hidden;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: var(--space-4);
  background: transparent;
  border: none;
  color: var(--fg-1);
  text-decoration: none;
}

.setting-link { cursor: pointer; transition: background var(--dur-micro); }
.setting-link:hover { background: var(--border-soft); }

.setting-info { flex: 1; }

.setting-name {
  display: flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--fg-1);
}

.setting-divider {
  height: 1px;
  background: var(--border-soft);
}

/* Accent swatches */
.accent-swatches {
  display: flex;
  gap: var(--space-2);
}
.swatch {
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: transform var(--dur-micro), box-shadow var(--dur-micro);
}
.swatch.active,
.swatch:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--shadow-xs);
}
</style>
