<template>
  <div class="sender-layout">
    <!-- Role indicator strip -->
    <div class="role-strip">
      <div class="app-container flex-between" style="height:100%">
        <div class="flex-center gap-2">
          <span class="role-dot" />
          <span class="lbl" style="font-size:10px; color: var(--tnh-pink)">SENDER MODE</span>
        </div>
        <div class="flex-center gap-3">
          <router-link to="/sender/search"   class="strip-link lbl-sm">Search</router-link>
          <router-link to="/sender/bookings" class="strip-link lbl-sm">My Bookings</router-link>
        </div>
      </div>
    </div>

    <!-- Page content -->
    <main class="sender-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.sender-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.role-strip {
  height: 32px;
  background: var(--tnh-pink);
  border-bottom: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.role-dot {
  width: 6px;
  height: 6px;
  background: var(--tnh-paper);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite;
}

.strip-link {
  color: var(--tnh-paper);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity var(--dur-micro);
}
.strip-link:hover          { opacity: 1; }
.strip-link.router-link-active { opacity: 1; text-decoration: underline; }

.sender-main {
  flex: 1;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.3); }
}
</style>
