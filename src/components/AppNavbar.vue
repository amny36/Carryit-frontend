<template>
  <div>
    <!-- DESKTOP NAVBAR -->
    <nav v-if="!isMobile" class="desktop-nav">
      <div class="nav-inner">
        <!-- Logo -->
        <router-link to="/" class="nav-logo">
          <CourierLogo :size="28" />
          <span class="nav-wordmark">CarryIt</span>
          <span class="nav-version serial">v2.0</span>
        </router-link>

        <!-- Nav links (role-aware) -->
        <div class="nav-links" v-if="authStore.isLoggedIn">
          <template v-if="authStore.isTraveler">
            <router-link to="/traveler/trips"    class="nav-link">My Trips</router-link>
            <router-link to="/traveler/requests" class="nav-link">
              Requests
              <span v-if="pendingCount > 0" class="nav-badge">{{ pendingCount }}</span>
            </router-link>
            <router-link to="/traveler/earnings" class="nav-link">Earnings</router-link>
          </template>
          <template v-else>
            <router-link to="/sender/search"   class="nav-link">Search Trips</router-link>
            <router-link to="/sender/bookings" class="nav-link">My Bookings</router-link>
          </template>
        </div>
        <div class="nav-links" v-else>
          <router-link to="/about" class="nav-link">How It Works</router-link>
        </div>

        <!-- Right: actions -->
        <div class="nav-actions">
          <template v-if="authStore.isLoggedIn">
            <!-- Role pill -->
            <span class="role-pill lbl" :class="authStore.isTraveler ? 'role-traveler' : 'role-sender'">
              {{ authStore.isTraveler ? 'Traveler' : 'Sender' }}
            </span>

            <!-- Notifications -->
            <router-link to="/notifications" class="icon-btn" title="Notifications">
              <v-badge :content="notifCount" :model-value="notifCount > 0" color="#FF4DA6">
                <v-icon size="20">mdi-bell-outline</v-icon>
              </v-badge>
            </router-link>

            <!-- Profile dropdown -->
            <div class="profile-wrapper" @click.stop="toggleMenu" ref="menuRef">
              <div class="avatar" :title="authStore.userName">{{ authStore.userInitials }}</div>

              <transition name="scale">
                <div v-if="menuOpen" class="dropdown">
                  <div class="dropdown-user">
                    <span class="lbl" style="color: var(--fg-2)">{{ authStore.userName }}</span>
                    <span class="serial" style="font-size:10px">{{ authStore.user?.email }}</span>
                  </div>
                  <div class="dropdown-divider" />
                  <router-link to="/profile"  class="dropdown-item" @click="menuOpen = false">
                    <v-icon size="14">mdi-account-outline</v-icon> Profile
                  </router-link>
                  <router-link to="/settings" class="dropdown-item" @click="menuOpen = false">
                    <v-icon size="14">mdi-cog-outline</v-icon> Settings
                  </router-link>
                  <div class="dropdown-divider" />
                  <button class="dropdown-item danger" @click="handleLogout">
                    <v-icon size="14">mdi-logout</v-icon> Logout
                  </button>
                </div>
              </transition>
            </div>
          </template>

          <template v-else>
            <router-link to="/auth/signin" class="btn btn-ghost btn-sm">Login</router-link>
            <router-link to="/auth/signup" class="btn btn-primary btn-sm">Sign Up</router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- MOBILE BOTTOM NAV -->
    <nav v-else class="mobile-nav">
      <router-link
        v-for="tab in mobileTabs"
        :key="tab.to"
        :to="tab.to"
        class="mobile-tab"
        :class="{ active: isActive(tab.to) }"
      >
        <div class="tab-icon">
          <v-badge v-if="tab.badge > 0" :content="tab.badge" color="#FF4DA6" floating>
            <v-icon size="20">{{ tab.icon }}</v-icon>
          </v-badge>
          <v-icon v-else size="20">{{ tab.icon }}</v-icon>
        </div>
        <span class="tab-label lbl-sm">{{ tab.label }}</span>
      </router-link>
    </nav>

    <!-- Spacers -->
    <div v-if="!isMobile" class="desktop-spacer" />
    <div v-else class="mobile-spacer" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import CourierLogo from '@/components/base/CourierLogo.vue'

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()
const appStore  = useAppStore()

// Responsive
const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

// Dropdown
const menuOpen = ref(false)
const menuRef  = ref(null)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const onOutsideClick = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick))

// Counts
const notifCount  = ref(0)
const pendingCount = ref(0)

// Mobile tabs
const mobileTabs = computed(() => {
  const tabs = [{ to: '/', label: 'Home', icon: 'mdi-home-outline', badge: 0 }]
  if (authStore.isLoggedIn) {
    if (authStore.isTraveler) {
      tabs.push({ to: '/traveler/trips',    label: 'Trips',    icon: 'mdi-airplane-takeoff', badge: 0 })
      tabs.push({ to: '/traveler/requests', label: 'Requests', icon: 'mdi-inbox-outline',    badge: pendingCount.value })
      tabs.push({ to: '/traveler/earnings', label: 'Earnings', icon: 'mdi-cash-multiple',    badge: 0 })
    } else {
      tabs.push({ to: '/sender/search',   label: 'Search',   icon: 'mdi-magnify',           badge: 0 })
      tabs.push({ to: '/sender/bookings', label: 'Bookings', icon: 'mdi-package-variant',   badge: 0 })
    }
    tabs.push({ to: '/notifications', label: 'Alerts', icon: 'mdi-bell-outline', badge: notifCount.value })
  }
  tabs.push({ to: '/profile', label: 'Profile', icon: 'mdi-account-outline', badge: 0 })
  return tabs
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  menuOpen.value = false
  authStore.logout()
  appStore.showSnackbar('Logged out successfully', 'success')
  router.push('/auth/signin')
}
</script>

<style scoped>
/* ---- Desktop ---- */
.desktop-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-surface);
  border-bottom: 1.5px solid var(--border);
  z-index: var(--z-sticky);
  backdrop-filter: blur(8px);
}

.nav-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 var(--container-pad);
  gap: var(--space-6);
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  flex-shrink: 0;
}
.nav-wordmark {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 18px;
  color: var(--fg-1);
  letter-spacing: -0.02em;
}
.nav-version {
  font-size: 9px;
  color: var(--fg-3);
  margin-top: 2px;
}

/* Nav links */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--fg-2);
  text-decoration: none;
  transition: color var(--dur-micro) var(--ease-out),
              background var(--dur-micro) var(--ease-out);
}
.nav-link:hover { color: var(--accent); }
.nav-link.router-link-active { color: var(--fg-1); border-bottom: 2px solid var(--accent); }

.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--tnh-pink);
  color: var(--tnh-paper);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 0;
}

/* Right actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

.role-pill {
  padding: 4px 8px;
  border: 1.5px solid var(--border);
  font-size: 9px;
  color: var(--fg-2);
}
.role-traveler { border-color: var(--tnh-meadow); color: var(--tnh-meadow); }
.role-sender   { border-color: var(--tnh-pink);   color: var(--tnh-pink);   }

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-2);
  text-decoration: none;
  padding: 6px;
  transition: color var(--dur-micro);
}
.icon-btn:hover { color: var(--fg-1); }

/* Avatar + dropdown */
.profile-wrapper { position: relative; }

.avatar {
  width: 32px;
  height: 32px;
  background: var(--tnh-ink);
  color: var(--tnh-paper);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-xs);
  user-select: none;
  transition: transform var(--dur-micro) var(--ease-out),
              box-shadow var(--dur-micro) var(--ease-out);
}
.avatar:hover {
  transform: translate(-1px, -1px);
  box-shadow: var(--shadow-sm);
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-surface);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-md);
  min-width: 200px;
  z-index: var(--z-dropdown);
  padding: var(--space-2);
}

.dropdown-user {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px 10px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--fg-1);
  text-decoration: none;
  cursor: pointer;
  transition: background var(--dur-micro);
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
}
.dropdown-item:hover { background: rgba(10, 10, 10, 0.05); }
.dropdown-item.danger { color: var(--ci-stamp-red); }
.dropdown-item.danger:hover { background: rgba(194, 59, 59, 0.06); }

.dropdown-divider {
  height: 1px;
  background: var(--border-soft);
  margin: var(--space-1) 0;
}

.desktop-spacer { height: 60px; }

/* ---- Mobile ---- */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background: var(--bg-surface);
  border-top: 1.5px solid var(--border);
  display: flex;
  align-items: stretch;
  z-index: var(--z-sticky);
}

.mobile-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--fg-3);
  gap: 3px;
  padding: 6px 0 4px;
  transition: color var(--dur-micro);
  border-right: 1px solid var(--border-soft);
}
.mobile-tab:last-child { border-right: none; }
.mobile-tab.active,
.mobile-tab.router-link-active { color: var(--tnh-pink); }

.tab-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-label { font-size: 9px; }

.mobile-spacer { height: var(--bottom-nav-height); }

/* Scale transition for dropdown */
.scale-enter-active, .scale-leave-active {
  transition: opacity var(--dur-micro) var(--ease-out),
              transform var(--dur-micro) var(--ease-out);
  transform-origin: top right;
}
.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}
</style>
