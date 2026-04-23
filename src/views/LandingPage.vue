<template>
  <div class="landing">

    <!-- ── Navbar ── -->
    <nav class="l-nav">
      <div class="l-nav-inner">
        <!-- Brand -->
        <router-link to="/" class="l-brand">
          <CourierLogo :size="32" state="idle" />
          <div class="l-brand-text">
            <span class="l-wordmark">CarryIt</span>
            <span class="l-serial serial">v2.0</span>
          </div>
        </router-link>

        <!-- Links (hidden on mobile) -->
        <div class="l-nav-links hide-mobile">
          <a href="#how" class="l-nav-link lbl-sm">How It Works</a>
          <a href="#routes" class="l-nav-link lbl-sm">Routes</a>
          <a href="#trust" class="l-nav-link lbl-sm">Trust</a>
        </div>

        <!-- CTA -->
        <div class="l-nav-actions">
          <button class="btn btn-ghost btn-sm" @click="$router.push('/auth/signin')">Sign In</button>
          <button class="btn btn-primary btn-sm" @click="$router.push('/auth/signup')">Get Started →</button>
        </div>
      </div>
    </nav>

    <!-- ── Hero ── -->
    <section class="l-hero">
      <div class="l-hero-inner">

        <!-- Left: content -->
        <div class="l-hero-content animate-rise-in">
          <!-- Metadata strip -->
          <div class="l-meta hairline-bot" style="margin-bottom: var(--space-5); padding-bottom: var(--space-3);">
            <span class="serial" style="font-size:10px;">48.8566° N, 2.3522° E — PARIS HUB</span>
            <span class="pill pill-live" style="margin-left: auto;">
              <span class="pill-dot" />Live
            </span>
          </div>

          <h1 class="l-headline display">
            Ship<br />Anything.<br />
            <span style="color: var(--tnh-pink);">Earn on<br />Every Trip.</span>
          </h1>

          <p class="l-sub" style="margin: var(--space-5) 0;">
            Connect with KYC-verified travelers going your route.<br />
            Senders save. Travelers earn. Everyone wins.
          </p>

          <!-- CTAs -->
          <div class="l-ctas">
            <button class="btn btn-primary btn-lg" @click="$router.push('/auth/signup')">
              📦 I Need to Send
            </button>
            <button class="btn btn-lg" style="border-color: var(--tnh-meadow); box-shadow: 3px 3px 0 0 var(--tnh-meadow);" @click="$router.push('/auth/signup')">
              ✈️ I'm Traveling
            </button>
          </div>

          <!-- Stats strip -->
          <div class="l-stats-strip stats-strip" style="grid-template-columns: repeat(3, 1fr); margin-top: var(--space-6); border: 1.5px solid var(--border);">
            <div v-for="s in stats" :key="s.label" class="stats-cell">
              <div class="stat" style="font-size: 22px;">{{ s.number }}</div>
              <div class="lbl-sm" style="color: var(--fg-2); margin-top: 4px;">{{ s.label }}</div>
            </div>
          </div>

          <!-- Trust badges -->
          <p class="serial" style="font-size: 10px; color: var(--fg-3); margin-top: var(--space-4);">
            🔒 ESCROW PROTECTED · KYC VERIFIED · 48H DISPUTE WINDOW
          </p>
        </div>

        <!-- Right: LCD boarding pass device -->
        <div class="l-hero-device animate-rise-in" style="animation-delay: 120ms;">
          <div class="l-device">
            <!-- Device casing -->
            <div class="l-device-casing">
              <!-- LCD screen -->
              <div class="l-screen lcd">
                <div class="l-screen-header">
                  <CourierLogo :size="36" state="idle" />
                  <div class="lbl-sm" style="color: var(--ci-phosphor);">CARRYIT OS</div>
                </div>

                <!-- Boarding pass on screen -->
                <div class="l-pass">
                  <div class="l-pass-header lbl-sm" style="color: var(--ci-phosphor); border-bottom: 1px solid rgba(163,217,119,0.25); padding-bottom: 8px; margin-bottom: 8px;">
                    BOARDING PASS
                  </div>
                  <div class="l-pass-route">
                    <div>
                      <div class="lcd-text" style="font-size: 36px; line-height:1;">CDG</div>
                      <div class="lbl-sm" style="color: var(--ci-phosphor-dim);">PARIS</div>
                    </div>
                    <div class="lcd-text" style="font-size: 20px; opacity: 0.5;">──→</div>
                    <div style="text-align:right;">
                      <div class="lcd-text" style="font-size: 36px; line-height:1;">TUN</div>
                      <div class="lbl-sm" style="color: var(--ci-phosphor-dim);">TUNIS</div>
                    </div>
                  </div>
                  <div class="l-pass-specs" style="border-top: 1px dashed rgba(163,217,119,0.25); margin-top: 10px; padding-top: 10px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
                    <div v-for="spec in passSpecs" :key="spec.label">
                      <div class="lbl-sm" style="color: var(--ci-phosphor-dim); font-size: 8px;">{{ spec.label }}</div>
                      <div class="lcd-text" style="font-size: 14px; margin-top: 2px;">{{ spec.value }}</div>
                    </div>
                  </div>
                  <!-- Fake progress bars -->
                  <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 5px;">
                    <div v-for="bar in progressBars" :key="bar.label" style="display: flex; align-items: center; gap: 6px;">
                      <div class="lbl-sm" style="color: var(--ci-phosphor-dim); font-size: 8px; width: 40px; flex-shrink:0;">{{ bar.label }}</div>
                      <div style="flex:1; height: 5px; border: 1px solid rgba(163,217,119,0.3);">
                        <div :style="{ width: bar.fill + '%', height:'100%', background: bar.color || 'var(--ci-phosphor)' }" />
                      </div>
                      <div class="lcd-text" style="font-size: 11px; width: 28px; text-align:right;">{{ bar.fill }}%</div>
                    </div>
                  </div>
                </div>

                <!-- Status pill -->
                <div style="margin-top: 12px; text-align: center;">
                  <span class="pill pill-live" style="font-size: 9px;">
                    <span class="pill-dot" />TRACKING LIVE
                  </span>
                </div>
              </div>

              <!-- D-pad -->
              <div class="l-dpad">
                <div class="l-dpad-h" />
                <div class="l-dpad-v" />
              </div>

              <!-- A/B buttons -->
              <div class="l-buttons">
                <div class="l-btn-b lbl-sm">B</div>
                <div class="l-btn-a lbl-sm">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── How It Works ── -->
    <section class="l-section l-how" id="how">
      <div class="l-section-inner">
        <div class="l-section-header">
          <p class="lbl" style="color: var(--tnh-pink);">The Process</p>
          <h2 style="margin-top: var(--space-2);">How CarryIt Works</h2>
        </div>
        <!-- Steps grid — ink gaps between cells like template -->
        <div class="l-steps-grid">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="l-step-cell"
          >
            <div class="lbl-sm" style="color: var(--tnh-pink); margin-bottom: var(--space-3);">0{{ i + 1 }}</div>
            <div class="l-step-icon">{{ step.icon }}</div>
            <h3 style="font-size: 16px; margin: var(--space-3) 0 var(--space-2);">{{ step.title }}</h3>
            <p style="color: var(--fg-2); font-size: 13px; line-height: var(--lh-body);">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Routes Board (LCD) ── -->
    <section class="l-routes" id="routes">
      <div class="l-section-inner">
        <div class="l-section-header">
          <p class="lbl" style="color: var(--ci-phosphor);">Live Departures · Updated Hourly</p>
          <h2 class="lcd-text" style="font-size: clamp(28px, 5vw, 48px); margin-top: var(--space-2);">Popular Routes</h2>
        </div>

        <!-- Route rows -->
        <div class="l-routes-board">
          <div class="l-routes-header">
            <span class="lbl-sm" style="color: var(--ci-phosphor-dim);">Traveler</span>
            <span class="lbl-sm" style="color: var(--ci-phosphor-dim);">Route</span>
            <span class="lbl-sm hide-mobile" style="color: var(--ci-phosphor-dim);">Date</span>
            <span class="lbl-sm hide-mobile" style="color: var(--ci-phosphor-dim);">Capacity</span>
            <span class="lbl-sm" style="color: var(--ci-phosphor-dim);">Price/kg</span>
            <span class="lbl-sm" style="color: var(--ci-phosphor-dim);">Status</span>
          </div>
          <div
            v-for="(r, i) in routes"
            :key="i"
            class="l-route-row"
            @click="$router.push('/auth/signup')"
          >
            <div>
              <div class="serial" style="color: var(--ci-phosphor); font-size: 11px;">{{ r.traveler }}</div>
              <div class="lbl-sm" style="color: var(--ci-phosphor-dim); font-size: 9px;">★ {{ r.rating }}</div>
            </div>
            <div>
              <div class="lcd-text" style="font-size: 18px; line-height:1.1;">{{ r.from }} → {{ r.to }}</div>
            </div>
            <div class="hide-mobile serial" style="color: var(--ci-phosphor); font-size: 11px;">{{ r.date }}</div>
            <div class="hide-mobile serial" style="color: var(--ci-phosphor); font-size: 11px;">{{ r.kg }} kg</div>
            <div class="lcd-text" style="font-size: 16px;">{{ r.price }}</div>
            <div>
              <span class="pill pill-live" style="font-size: 9px;">
                <span class="pill-dot" />Open
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Trust Signals ── -->
    <section class="l-section" id="trust" style="background: var(--bg-surface);">
      <div class="l-section-inner">
        <div class="l-section-header">
          <p class="lbl" style="color: var(--tnh-meadow);">Why CarryIt</p>
          <h2 style="margin-top: var(--space-2);">Built on Trust</h2>
        </div>
        <div class="l-trust-grid">
          <div v-for="(item, i) in trustItems" :key="item.label" class="l-trust-cell card-stack">
            <div class="stamp stamp-green" style="margin-bottom: var(--space-4); display:inline-flex;">{{ item.stamp }}</div>
            <h3 style="margin-bottom: var(--space-2);">{{ item.label }}</h3>
            <p style="color: var(--fg-2); font-size: 13px; line-height: var(--lh-body);">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA Banner ── -->
    <section class="l-cta-banner" style="background: var(--tnh-ink); border-top: 1.5px solid var(--border);">
      <div class="l-section-inner" style="text-align: center; padding-top: 60px; padding-bottom: 60px;">
        <p class="lbl" style="color: var(--tnh-pink); margin-bottom: var(--space-3);">Ready to ship smarter?</p>
        <h2 style="color: var(--tnh-paper); font-size: clamp(28px, 4vw, 44px); margin-bottom: var(--space-6);">
          Join 1,200+ users already on CarryIt
        </h2>
        <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-pink btn-lg" @click="$router.push('/auth/signup')">Create Account</button>
          <button class="btn btn-ghost btn-lg" style="border-color: rgba(250,250,247,0.3); color: var(--tnh-paper);" @click="$router.push('/sender/search')">Search Trips</button>
        </div>
      </div>
    </section>

    <!-- ── Footer ── -->
    <footer class="l-footer">
      <div class="l-footer-inner">
        <div class="l-footer-brand">
          <div class="flex-center gap-2" style="justify-content: flex-start; margin-bottom: var(--space-3);">
            <CourierLogo :size="28" />
            <span style="font-weight:800; font-size:18px; letter-spacing:-0.02em;">CarryIt</span>
          </div>
          <p class="serial" style="color: var(--fg-3); font-size: 10px;">Ship anything. Earn on every trip.</p>
          <p class="serial" style="color: var(--fg-3); font-size: 10px; margin-top: 4px;">© 2026 CarryIt · All rights reserved.</p>
        </div>
        <div>
          <p class="lbl-sm" style="color: var(--fg-2); margin-bottom: var(--space-3);">Product</p>
          <div style="display:flex; flex-direction: column; gap: var(--space-2);">
            <router-link to="/about" class="l-footer-link">How It Works</router-link>
            <router-link to="/auth/signup" class="l-footer-link">Sign Up</router-link>
            <router-link to="/sender/search" class="l-footer-link">Search Trips</router-link>
          </div>
        </div>
        <div>
          <p class="lbl-sm" style="color: var(--fg-2); margin-bottom: var(--space-3);">Company</p>
          <div style="display:flex; flex-direction: column; gap: var(--space-2);">
            <a href="#" class="l-footer-link">Privacy</a>
            <a href="#" class="l-footer-link">Terms</a>
            <a href="#" class="l-footer-link">Help</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import CourierLogo from '@/components/base/CourierLogo.vue'

const stats = [
  { number: '1,200+', label: 'Trips Completed' },
  { number: '98%',    label: 'On-time Delivery' },
  { number: '4.8★',   label: 'Avg. Rating' },
]

const passSpecs = [
  { label: 'DATE',   value: '26 APR' },
  { label: 'KG',     value: '5 KG' },
  { label: 'PRICE',  value: '€22' },
]

const progressBars = [
  { label: 'TRUST',  fill: 98,  color: 'var(--ci-phosphor)' },
  { label: 'SPACE',  fill: 62,  color: 'var(--ci-amber)' },
  { label: 'ESCROW', fill: 100, color: 'var(--tnh-pink)' },
]

const steps = [
  { icon: '📦', title: 'Post Your Package',  desc: 'Describe your item — size, weight, destination — and set a fair price.' },
  { icon: '🔍', title: 'Find a Traveler',    desc: 'Browse KYC-verified travelers already heading your route.' },
  { icon: '💳', title: 'Book & Escrow',      desc: 'Pay securely. Funds held in escrow until confirmed delivery.' },
  { icon: '📍', title: 'Track in Real Time', desc: 'QR code handoffs with GPS timestamps at every stage.' },
  { icon: '⭐', title: 'Rate & Release',     desc: 'OTP confirms delivery. Funds release. Build your trust score.' },
]

const routes = [
  { traveler: 'A. BENALI',   rating: '4.9', from: 'CDG', to: 'TUN', date: '28 APR', kg: '8',  price: '€22/kg' },
  { traveler: 'M. HASSAN',   rating: '4.8', from: 'MAD', to: 'CDG', date: '29 APR', kg: '5',  price: '€20/kg' },
  { traveler: 'S. MARTIN',   rating: '5.0', from: 'LHR', to: 'AMS', date: '30 APR', kg: '10', price: '£16/kg' },
  { traveler: 'K. IBRAHIM',  rating: '4.7', from: 'BCN', to: 'MXP', date: '01 MAY', kg: '6',  price: '€19/kg' },
  { traveler: 'L. CHEN',     rating: '4.9', from: 'CDG', to: 'LYS', date: '01 MAY', kg: '4',  price: '€18/kg' },
]

const trustItems = [
  { stamp: 'KYC',    label: 'Identity Verified',  desc: 'Every traveler uploads a government-issued ID. We verify before they can accept any booking.' },
  { stamp: 'ESCROW', label: 'Secure Payments',    desc: 'Your payment is held safely and only released once you confirm your package arrived.' },
  { stamp: 'TRACK',  label: 'Real-time Tracking', desc: 'QR code scans at pickup, transit, and delivery — you always know exactly where things stand.' },
  { stamp: 'RATED',  label: 'Community Trust',    desc: 'Stars, reviews, and trust scores earned over hundreds of deliveries. No fake profiles.' },
]
</script>

<style scoped>
/* ── Base ── */
.landing {
  font-family: var(--font-sans);
  color: var(--fg-1);
  background: var(--bg);
  overflow-x: hidden;
}

/* ── Navbar ── */
.l-nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: var(--bg);
  border-bottom: 1.5px solid var(--border);
  backdrop-filter: blur(8px);
}
.l-nav-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 12px var(--container-pad);
  display: flex;
  align-items: center;
  gap: var(--space-6);
}
.l-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  flex-shrink: 0;
}
.l-brand-text { display: flex; flex-direction: column; line-height: 1; }
.l-wordmark { font-weight: 800; font-size: 17px; letter-spacing: -0.02em; color: var(--fg-1); }
.l-serial   { font-size: 9px; color: var(--fg-3); margin-top: 1px; }

.l-nav-links {
  display: flex;
  gap: 0;
  flex: 1;
}
.l-nav-link {
  padding: 8px 14px;
  color: var(--fg-2);
  text-decoration: none;
  transition: color var(--dur-micro);
}
.l-nav-link:hover { color: var(--fg-1); }

.l-nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

/* ── Hero ── */
.l-hero {
  min-height: calc(100vh - 57px);
  background: var(--bg);
  display: flex;
  align-items: center;
  border-bottom: 1.5px solid var(--border);
}
.l-hero-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 60px var(--container-pad);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
}
@media (max-width: 960px) {
  .l-hero-inner { grid-template-columns: 1fr; }
}

.l-meta { display: flex; align-items: center; }

.l-headline {
  font-size: clamp(40px, 7vw, 88px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: var(--lh-tight);
}
.l-sub {
  font-size: var(--fs-body-l);
  color: var(--fg-2);
  line-height: var(--lh-loose);
}
.l-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

/* ── LCD Device ── */
.l-hero-device { display: flex; justify-content: center; }
.l-device { perspective: 1000px; }

.l-device-casing {
  background: #2a2a2a;
  border: 2px solid #1a1a1a;
  box-shadow: 6px 6px 0 0 var(--tnh-ink);
  padding: 20px 16px 28px;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.l-screen {
  padding: 14px;
  min-height: 220px;
}
.l-screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(163,217,119,0.2);
}

.l-pass-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* D-pad */
.l-dpad {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto;
}
.l-dpad-h, .l-dpad-v {
  position: absolute;
  background: #3a3a3a;
  border: 1px solid #222;
}
.l-dpad-h { width: 100%; height: 33%; top: 33%; left: 0; }
.l-dpad-v { width: 33%; height: 100%; left: 33%; top: 0; }

/* A/B buttons */
.l-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: -48px;
}
.l-btn-a, .l-btn-b {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3a3a3a;
  border: 1px solid #222;
  box-shadow: 0 3px 0 #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: rgba(255,255,255,0.5);
}
.l-btn-a { background: #7b1d5a; }

/* ── Section commons ── */
.l-section {
  border-bottom: 1.5px solid var(--border);
}
.l-section-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 64px var(--container-pad);
}
.l-section-header {
  margin-bottom: var(--space-6);
}

/* ── Steps (ink grid gaps) ── */
.l-steps-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: var(--border);
  border: 1.5px solid var(--border);
  gap: 1.5px;
}
.l-step-cell {
  background: var(--bg);
  padding: 28px 20px;
}
.l-step-icon { font-size: 28px; line-height: 1; }

@media (max-width: 960px) {
  .l-steps-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .l-steps-grid { grid-template-columns: 1fr; }
}

/* ── Routes Board ── */
.l-routes {
  background: #0e1410;
  border-top: 1.5px solid var(--border);
  border-bottom: 1.5px solid var(--border);
}
.l-routes .l-section-inner { padding-bottom: 48px; }

.l-routes-board {
  border: 1.5px solid rgba(163,217,119,0.3);
  overflow: hidden;
}
.l-routes-header {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1fr 1fr 1fr 1fr;
  padding: 10px 16px;
  background: rgba(163,217,119,0.06);
  border-bottom: 1px solid rgba(163,217,119,0.2);
  gap: 12px;
}
.l-route-row {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1fr 1fr 1fr 1fr;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(163,217,119,0.1);
  gap: 12px;
  align-items: center;
  cursor: pointer;
  transition: background 120ms;
}
.l-route-row:last-child { border-bottom: none; }
.l-route-row:hover { background: rgba(163,217,119,0.04); }

@media (max-width: 720px) {
  .l-routes-header { grid-template-columns: 1.2fr 1.5fr 1fr 1fr; }
  .l-route-row     { grid-template-columns: 1.2fr 1.5fr 1fr 1fr; }
}

/* ── Trust ── */
.l-trust-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}
.l-trust-cell { padding: var(--space-6); }
@media (max-width: 960px) { .l-trust-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .l-trust-grid { grid-template-columns: 1fr; } }

/* ── Footer ── */
.l-footer {
  background: var(--tnh-ink);
  border-top: 1.5px solid var(--border);
  padding: 48px var(--container-pad) 32px;
}
.l-footer-inner {
  max-width: var(--container-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-8);
  color: var(--tnh-paper);
}
@media (max-width: 720px) {
  .l-footer-inner { grid-template-columns: 1fr; gap: var(--space-6); }
}
.l-footer-brand { color: var(--tnh-paper); }
.l-footer-link {
  display: block;
  color: rgba(250,250,247,0.55);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  transition: color var(--dur-micro);
}
.l-footer-link:hover { color: var(--tnh-paper); }
</style>
