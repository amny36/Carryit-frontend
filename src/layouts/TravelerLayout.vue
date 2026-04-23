<template>
  <div class="traveler-layout">
    <!-- Role indicator strip -->
    <div class="role-strip">
      <div class="app-container flex-between" style="height:100%">
        <div class="flex-center gap-2">
          <span class="role-dot" />
          <span class="lbl" style="font-size:10px; color: var(--tnh-meadow)">TRAVELER MODE</span>
        </div>
        <div class="flex-center gap-3">
          <router-link to="/traveler/trips"    class="strip-link lbl-sm">My Trips</router-link>
          <router-link to="/traveler/requests" class="strip-link lbl-sm">Requests</router-link>
          <router-link to="/traveler/earnings" class="strip-link lbl-sm">Earnings</router-link>
          <router-link to="/traveler/post-trip" class="strip-cta lbl-sm">+ Post Trip</router-link>
        </div>
      </div>
    </div>

    <!-- Page content -->
    <main class="traveler-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.traveler-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.role-strip {
  height: 32px;
  background: var(--tnh-meadow);
  border-bottom: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.role-dot {
  width: 6px;
  height: 6px;
  background: var(--ci-phosphor);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite;
}

.strip-link {
  color: rgba(250, 250, 247, 0.75);
  text-decoration: none;
  transition: color var(--dur-micro);
}
.strip-link:hover          { color: var(--tnh-paper); }
.strip-link.router-link-active { color: var(--tnh-paper); text-decoration: underline; }

.strip-cta {
  padding: 4px 10px;
  background: var(--ci-phosphor);
  color: var(--tnh-ink);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  transition: opacity var(--dur-micro);
}
.strip-cta:hover { opacity: 0.85; }

.traveler-main { flex: 1; }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.3); }
}
</style>
