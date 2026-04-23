<template>
  <v-app :theme="appStore.darkMode ? 'carryitDark' : 'carryit'">
    <div :class="{ 'dark-mode': appStore.darkMode }">
      <AppNavbar v-if="showNavbar" />

      <v-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </v-main>

      <!-- Global snackbar -->
      <v-snackbar
        v-model="appStore.snackbar.show"
        :color="appStore.snackbar.color || 'primary'"
        :timeout="appStore.snackbar.timeout || 3000"
        location="bottom center"
      >
        <span class="lbl" style="font-size: 11px;">{{ appStore.snackbar.message }}</span>
        <template #actions>
          <v-btn
            variant="text"
            icon="mdi-close"
            size="small"
            @click="appStore.snackbar.show = false"
          />
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import AppNavbar from '@/components/AppNavbar.vue'

const route    = useRoute()
const appStore = useAppStore()

const NAVBAR_HIDDEN = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/verify',
  '/auth/profile-setup',
]
const showNavbar = computed(() => !NAVBAR_HIDDEN.includes(route.path))

// Sync dark mode class to <html> so CSS vars apply globally
watch(
  () => appStore.darkMode,
  (v) => {
    document.documentElement.classList.toggle('dark-mode', v)
  },
  { immediate: true }
)
</script>

<style>
/* Page transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Apply bg token globally */
.v-application__wrap {
  background-color: var(--bg) !important;
}
</style>
