<template>
  <main class="landing">
    <!-- ── Top Nav (kept minimal — sits above sticky AppNavbar router-renders) ── -->

    <!-- ── HERO with floating draggable cutouts ── -->
    <section class="hero" ref="heroRef">
      <div class="hero-grid" aria-hidden="true" />

      <!-- Live chip -->
      <div class="hero-live">
        <span class="dot" /> LIVE · 14 PARCELS IN TRANSIT
      </div>

      <!-- Cutout stage -->
      <div class="hero-stage">
        <div
          v-for="item in items"
          :key="item.key"
          class="draggable"
          :class="{ dragging: dragging === item.key, picked: picked === item.key }"
          :style="dragStyle(item)"
          @mousedown.prevent="onDown($event, item)"
          @touchstart.prevent="onDown($event, item)"
        >
          <HeroCutout :name="item.cutout" :size="item.size" :color="item.color" />
          <div v-if="picked === item.key" class="drag-label">{{ item.label }}</div>
        </div>

        <!-- Center title (sits behind cutouts visually) -->
        <div class="hero-title">
          <h1>
            <span class="title-line">Send anything.</span>
            <span class="title-line title-b">Earn on every trip.</span>
          </h1>
          <p class="hero-sub">
            Tunis ⇄ Paris &middot; CDG &middot; Marseille. KYC-verified travelers,<br />
            escrow-protected handoffs, real-time GPS tracking.
          </p>
          <div class="hero-cta-row">
            <button class="cta-primary" @click="$router.push('/auth/signup')">
              📦 I need to send
            </button>
            <button class="cta-ghost" @click="$router.push('/auth/signup')">
              ✈️ I&rsquo;m traveling
            </button>
          </div>
          <div class="hero-hint">
            <span class="hint-arrow">↳</span>
            <em>Try it &mdash; drag the items around</em>
          </div>
        </div>
      </div>

      <!-- Corner registration marks -->
      <div class="reg reg-tl" />
      <div class="reg reg-tr" />
      <div class="reg reg-bl" />
      <div class="reg reg-br" />
      <div class="hero-serial">
        CI-MANIFEST-2026-EN-04 &middot; MASTER COPY &middot; DO NOT REMOVE
      </div>
    </section>

    <!-- ── STATS strip ── -->
    <section class="stats-strip-l">
      <div v-for="(s, i) in statRows" :key="i" class="stat-l">
        <div class="stat-label">{{ s[0] }}</div>
        <div class="stat-value">{{ s[1] }}</div>
        <div class="stat-foot">{{ s[2] }}</div>
      </div>
    </section>

    <!-- ── HOW IT WORKS — boarding-pass stubs ── -->
    <section class="how">
      <div class="section-head">
        <div class="section-tag">— THE PROCESS —</div>
        <h2>How CarryIt works</h2>
      </div>
      <div class="steps">
        <article
          v-for="(step, i) in steps"
          :key="i"
          class="step-card"
          :style="{ '--rot': `${(i % 2 ? 1 : -1) * 0.6}deg` }"
        >
          <header class="step-head">
            <span class="step-n">{{ step[0] }}</span>
            <span class="step-perfo" aria-hidden="true">· · · · · · ·</span>
            <span class="step-stamp">CARRYIT</span>
          </header>
          <h3>{{ step[1] }}</h3>
          <p>{{ step[2] }}</p>
          <footer class="step-foot">
            <span>STEP {{ step[0] }}/05</span>
            <span>QR · {{ qrCodes[i] }}</span>
          </footer>
        </article>
      </div>
    </section>

    <!-- ── DEPARTURES BOARD ── -->
    <section class="board" id="routes">
      <div class="section-head">
        <div class="section-tag">— LIVE DEPARTURES · UPDATED HOURLY —</div>
        <h2>Popular routes today</h2>
      </div>
      <div class="board-frame">
        <div class="board-row board-head">
          <span>DATE</span><span>FROM</span><span>TO</span><span>KG</span><span>€/KG</span><span>STATUS</span><span></span>
        </div>
        <div v-for="(row, i) in trips" :key="i" class="board-row">
          <span v-for="(cell, j) in row" :key="j"
                :class="j === 5 ? `cell-status status-${cell.toLowerCase()}` : ''">
            <i v-if="j === 5" class="status-dot" />{{ cell }}
          </span>
          <button class="board-book" @click="$router.push('/auth/signup')">BOOK →</button>
        </div>
        <div class="board-foot">SUBJECT TO CUSTOMS &middot; PRICES INDICATIVE &middot; NEXT REFRESH 14:00</div>
      </div>
    </section>

    <!-- ── TRUST ── -->
    <section class="trust" id="trust">
      <div class="section-head">
        <div class="section-tag">— WHY CARRYIT —</div>
        <h2>Built on trust</h2>
      </div>
      <div class="trust-grid">
        <div v-for="(item, i) in trustItems" :key="i" class="trust-card">
          <div class="trust-num">0{{ i + 1 }}</div>
          <h3>{{ item[0] }}</h3>
          <p>{{ item[1] }}</p>
        </div>
      </div>
    </section>

    <!-- ── CTA Banner ── -->
    <section class="cta-banner">
      <div class="cta-banner-inner">
        <p class="cta-tag">— READY TO SHIP SMARTER —</p>
        <h2>Join 1,200+ users already on CarryIt</h2>
        <div class="cta-row">
          <button class="cta-primary" @click="$router.push('/auth/signup')">Create account</button>
          <button class="cta-ghost cta-ghost-dark" @click="$router.push('/sender/search')">Search trips</button>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="site-foot">
      <div class="foot-line">
        <span>CI-2026 &middot; ALL RIGHTS RESERVED</span>
        <span class="foot-mid">CarryIt &middot; Cargo Trust Co.</span>
        <span>TUNIS &middot; PARIS &middot; MARSEILLE</span>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import HeroCutout from '@/components/HeroCutouts.vue'

// ── Cutout layout (positions relative to a 1280×800 stage) ───────────
const items = reactive([
  { key: 'passport', cutout: 'passport',  size: 150, color: 'burgundy', x: 80,   y: 60,  rot: -8,  z: 4, label: 'PASSPORT' },
  { key: 'harissa',  cutout: 'harissa',   size: 130, x: 220,  y: 280, rot: 12,  z: 5, label: 'HARISSA · CAP BON' },
  { key: 'olive',    cutout: 'olive_oil', size: 150, x: 60,   y: 420, rot: -6,  z: 3, label: 'OLIVE OIL · SFAX' },
  { key: 'sneakers', cutout: 'sneaker',   size: 160, x: 920,  y: 80,  rot: 6,   z: 3, label: 'SNEAKERS' },
  { key: 'croissant',cutout: 'croissant', size: 170, x: 1020, y: 280, rot: -10, z: 4, label: 'CROISSANT' },
  { key: 'iphone',   cutout: 'iphone',    size: 110, x: 1080, y: 440, rot: 4,   z: 5, label: 'iPhone 15 Pro' },
  { key: 'envelope', cutout: 'envelope',  size: 170, x: 880,  y: 560, rot: -4,  z: 2, label: 'DOCUMENTS · PAR AVION' },
  { key: 'perfume',  cutout: 'perfume',   size: 130, x: 200,  y: 540, rot: -14, z: 4, label: 'PERFUME · NUIT DE TUNIS' },
  { key: 'makroudh', cutout: 'makroudh',  size: 110, x: 380,  y: 580, rot: 8,   z: 3, label: 'MAKROUDH' },
  { key: 'gold_box', cutout: 'gold_box',  size: 110, x: 1060, y: 620, rot: -8,  z: 3, label: 'JEWELLERY' },
  { key: 'medicine', cutout: 'medicine',  size: 110, x: 60,   y: 600, rot: 6,   z: 2, label: 'PHARMACY' },
  { key: 'keychain', cutout: 'keychain',  size: 130, x: 760,  y: 640, rot: -16, z: 2, label: 'KEYCHAIN · PARIS' },
  { key: 'tea',      cutout: 'tea',       size: 110, x: 1140, y: 130, rot: 8,   z: 2, label: 'MINT TEA' },
  { key: 'suitcase', cutout: 'suitcase',  size: 130, x: 760,  y: 440, rot: 4,   z: 1, label: 'CABIN BAG' },
  { key: 'ticket',   cutout: 'ticket',    size: 180, x: 350,  y: 180, rot: -6,  z: 6, label: 'BOARDING PASS · TUN→CDG' },
  { key: 'stamp',    cutout: 'stamp',     size: 110, x: 580,  y: 80,  rot: 14,  z: 7, label: 'CUSTOMS STAMP' },
])

// ── Drag handling ─────────────────────────────────────────────────────
const heroRef = ref(null)
const dragging = ref(null)
const picked = ref(null)
let dragOffset = { x: 0, y: 0 }
let activeItem = null

function dragStyle(it) {
  const isDragging = dragging.value === it.key
  return {
    left: it.x + 'px',
    top: it.y + 'px',
    transform: `rotate(${isDragging ? it.rot * 0.4 : it.rot}deg) scale(${isDragging ? 1.06 : 1})`,
    zIndex: isDragging ? 999 : (picked.value === it.key ? 100 + it.z : it.z),
    filter: isDragging
      ? 'drop-shadow(0 24px 24px rgba(20,17,13,0.35))'
      : 'drop-shadow(0 4px 6px rgba(20,17,13,0.18))',
    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(.2,.8,.2,1)',
    cursor: isDragging ? 'grabbing' : 'grab',
  }
}

function getEvent(e) { return e.touches ? e.touches[0] : e }

function onDown(e, item) {
  const t = getEvent(e)
  const target = e.currentTarget
  const rect = target.getBoundingClientRect()
  dragOffset = { x: t.clientX - rect.left, y: t.clientY - rect.top }
  activeItem = item
  dragging.value = item.key
  picked.value = item.key
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onUp)
}
function onMove(e) {
  if (!activeItem) return
  e.preventDefault?.()
  const t = getEvent(e)
  const stage = heroRef.value?.querySelector('.hero-stage')
  if (!stage) return
  const parent = stage.getBoundingClientRect()
  activeItem.x = t.clientX - parent.left - dragOffset.x
  activeItem.y = t.clientY - parent.top - dragOffset.y
}
function onUp() {
  dragging.value = null
  activeItem = null
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend', onUp)
}
onBeforeUnmount(onUp)

// ── Content data ──────────────────────────────────────────────────────
const statRows = [
  ['001', '1,200+', 'TRIPS COMPLETED'],
  ['002', '98%',     'ON-TIME DELIVERY'],
  ['003', '4.8★',    'AVG. RATING'],
  ['004', '€18/kg',  'AVG. PRICE'],
]

const steps = [
  ['01', 'Post your package',   'Describe item, weight, destination, ideal arrival window. We suggest a fair price.'],
  ['02', 'Match a traveler',    'Browse KYC-verified travelers already heading your route. See their stamps and reviews.'],
  ['03', 'Book & escrow',       'Pay securely. Funds are held in escrow until both parties confirm delivery.'],
  ['04', 'Track in real time',  'Live GPS, QR-coded handoffs, automatic timestamps at every leg.'],
  ['05', 'Rate & release',      'OTP confirms delivery. Funds release. Build your trust score for next time.'],
]
const qrCodes = ['8721', '4490', '1156', '7203', '9384']

const trips = [
  ['22 APR', 'TUN', 'CDG', '5.0',  '18', 'OPEN'],
  ['22 APR', 'TUN', 'MRS', '8.0',  '14', 'OPEN'],
  ['23 APR', 'CDG', 'TUN', '3.5',  '22', 'FILLING'],
  ['24 APR', 'TUN', 'FCO', '12.0', '11', 'OPEN'],
  ['24 APR', 'ALG', 'CDG', '6.0',  '16', 'OPEN'],
  ['25 APR', 'TUN', 'BRU', '4.0',  '20', 'BOARDING'],
]

const trustItems = [
  ['KYC verified',   'Every traveler uploads government-issued ID. We verify before they can accept any booking.'],
  ['Escrow protected', 'Your payment is held safely and only released once you confirm your package arrived intact.'],
  ['Real-time tracking', 'QR code scans at pickup, transit, and delivery. You always know exactly where things stand.'],
  ['Community trust',   'Stars, reviews, and trust scores earned over hundreds of deliveries. No fake profiles.'],
]
</script>

<style scoped>
/* ============================================================
   LandingPage — uses tokens from main.css (now indigo/cream/gold/red)
   ============================================================ */

.landing {
  background: var(--bg);
  color: var(--fg-1);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

/* ── HERO ─────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 880px;
  background:
    radial-gradient(circle at 20% 30%, rgba(201,162,74,0.12), transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(176,57,46,0.08), transparent 55%),
    var(--tnh-twilight);
  border-bottom: 1.5px solid var(--border);
  overflow: hidden;
}

/* faint grid */
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(20,17,13,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(20,17,13,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.hero-live {
  position: absolute;
  top: 24px; left: 50%; transform: translateX(-50%);
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--tnh-ink); color: var(--tnh-paper);
  font-family: var(--font-mono); font-size: 10px; font-weight: 600;
  letter-spacing: 0.18em; padding: 6px 14px;
  z-index: 5;
}
.hero-live .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--ci-amber); animation: pulse 1.4s ease-in-out infinite;
}

.hero-stage {
  position: relative;
  width: 1280px; max-width: 100%;
  height: 800px;
  margin: 0 auto;
  z-index: 2;
}

@media (max-width: 1300px) {
  .hero-stage { transform-origin: top center; transform: scale(0.78); }
  .hero { min-height: 700px; }
}
@media (max-width: 980px) {
  .hero-stage { transform: scale(0.55); height: 800px; }
  .hero { min-height: 520px; }
}
@media (max-width: 640px) {
  .hero-stage { transform: scale(0.4); }
  .hero { min-height: 380px; }
}

.draggable {
  position: absolute;
  user-select: none;
  touch-action: none;
}

.drag-label {
  position: absolute; top: 100%; left: 50%;
  transform: translateX(-50%) translateY(4px);
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em;
  background: var(--tnh-ink); color: var(--tnh-paper);
  padding: 3px 8px; white-space: nowrap;
  text-transform: uppercase;
}

.hero-title {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  width: 720px; max-width: 90%;
  text-align: center;
  pointer-events: none;
  z-index: 1;
}
.hero-title h1 {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: clamp(48px, 7vw, 96px);
  line-height: 0.95;
  letter-spacing: -0.035em;
}
.title-line { display: block; }
.title-b { color: var(--tnh-pink); font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700; font-style: italic; letter-spacing: -0.02em; }

.hero-sub {
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--fg-2);
  margin: 18px 0 22px;
  line-height: 1.6;
}

.hero-cta-row {
  display: inline-flex; gap: 10px; pointer-events: auto;
}

/* CTA buttons */
.cta-primary, .cta-ghost {
  pointer-events: auto;
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 14px 22px;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: transform var(--dur-micro), box-shadow var(--dur-micro);
}
.cta-primary {
  background: var(--tnh-ink); color: var(--tnh-paper);
  box-shadow: 4px 4px 0 0 var(--tnh-pink);
}
.cta-primary:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 0 var(--tnh-pink);
}
.cta-ghost {
  background: transparent; color: var(--fg-1);
  box-shadow: 4px 4px 0 0 var(--tnh-meadow);
}
.cta-ghost:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 0 var(--tnh-meadow);
}

.hero-hint {
  margin-top: 14px;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  color: var(--fg-3);
}
.hint-arrow {
  font-family: var(--font-mono);
  margin-right: 4px;
}

/* corner registration marks */
.reg {
  position: absolute; width: 18px; height: 18px;
  border: 1.5px solid var(--tnh-ink);
  z-index: 6; opacity: 0.55;
}
.reg-tl { top: 14px; left: 14px; border-right: none; border-bottom: none; }
.reg-tr { top: 14px; right: 14px; border-left: none; border-bottom: none; }
.reg-bl { bottom: 14px; left: 14px; border-right: none; border-top: none; }
.reg-br { bottom: 14px; right: 14px; border-left: none; border-top: none; }

.hero-serial {
  position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%);
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.22em; color: var(--fg-3);
  z-index: 6;
}

/* ── STATS strip ─────────────────────────────────────────── */
.stats-strip-l {
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: var(--tnh-ink); color: var(--tnh-paper);
  border-bottom: 1.5px solid var(--border);
}
.stat-l {
  padding: 28px 24px;
  border-right: 1px solid rgba(250,246,236,0.12);
  display: flex; flex-direction: column; gap: 6px;
}
.stat-l:last-child { border-right: none; }
.stat-label {
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.2em; color: var(--ci-amber);
}
.stat-value {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: 38px; line-height: 1;
  color: var(--tnh-paper);
}
.stat-foot {
  font-family: var(--font-mono); font-size: 10px;
  letter-spacing: 0.16em; color: rgba(250,246,236,0.6);
  text-transform: uppercase;
}
@media (max-width: 720px) {
  .stats-strip-l { grid-template-columns: repeat(2, 1fr); }
  .stat-l:nth-child(2) { border-right: none; }
  .stat-l:nth-child(1), .stat-l:nth-child(2) {
    border-bottom: 1px solid rgba(250,246,236,0.12);
  }
}

/* ── Section header ───────────────────────────────────────── */
.section-head { text-align: center; margin-bottom: 48px; }
.section-tag {
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 0.24em; color: var(--ci-amber-deep);
  margin-bottom: 14px; text-transform: uppercase;
}
.section-head h2 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: clamp(36px, 5vw, 64px); line-height: 1;
  letter-spacing: -0.02em;
}

/* ── HOW IT WORKS ─────────────────────────────────────────── */
.how {
  padding: 96px 28px;
  border-bottom: 1.5px solid var(--border);
}
.steps {
  max-width: var(--container-max); margin: 0 auto;
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}
.step-card {
  background: var(--tnh-paper);
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-md);
  padding: 22px 18px 16px;
  transform: rotate(var(--rot, 0deg));
  transition: transform var(--dur-std) var(--ease-out);
  display: flex; flex-direction: column; gap: 10px;
}
.step-card:hover { transform: rotate(0) translateY(-3px); }
.step-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1.5px dashed var(--border);
}
.step-n {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: 26px; color: var(--tnh-pink);
}
.step-perfo { color: var(--fg-3); font-family: var(--font-mono); font-size: 8px; flex: 1; text-align: center; }
.step-stamp {
  font-family: var(--font-mono); font-size: 8px;
  letter-spacing: 0.2em; color: var(--ci-amber-deep);
  border: 1px solid var(--ci-amber-deep); padding: 2px 6px;
}
.step-card h3 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: 22px; line-height: 1.1;
}
.step-card p {
  font-size: 13px; color: var(--fg-2); line-height: 1.55;
  flex: 1;
}
.step-foot {
  display: flex; justify-content: space-between;
  font-family: var(--font-mono); font-size: 8px;
  letter-spacing: 0.16em; color: var(--fg-3);
  padding-top: 8px; border-top: 1px solid var(--border-soft);
}
@media (max-width: 1100px) { .steps { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px)  { .steps { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px)  { .steps { grid-template-columns: 1fr; } }

/* ── DEPARTURES BOARD ─────────────────────────────────────── */
.board {
  padding: 96px 28px;
  background: var(--ci-lcd-bg);
  color: var(--ci-phosphor);
  border-bottom: 1.5px solid var(--border);
}
.board .section-tag { color: var(--ci-amber); }
.board .section-head h2 { color: var(--ci-phosphor); }

.board-frame {
  max-width: var(--container-max); margin: 0 auto;
  border: 1.5px solid rgba(226,200,131,0.3);
  background: rgba(20,25,20,0.6);
}
.board-row {
  display: grid;
  grid-template-columns: 0.8fr 0.6fr 0.6fr 0.5fr 0.5fr 0.9fr 0.9fr;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(226,200,131,0.12);
  font-family: var(--font-mono); font-size: 13px;
  letter-spacing: 0.06em;
}
.board-row:last-child { border-bottom: none; }
.board-head {
  background: rgba(226,200,131,0.06);
  font-size: 10px; letter-spacing: 0.22em;
  color: var(--ci-phosphor-dim);
}
.cell-status {
  display: inline-flex; align-items: center; gap: 6px;
}
.status-open    { color: var(--ci-phosphor); }
.status-filling { color: var(--ci-amber); }
.status-boarding { color: var(--tnh-pink); }
.status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor;
  animation: pulse 1.4s ease-in-out infinite;
}
.board-book {
  font-family: var(--font-mono); font-size: 10px;
  letter-spacing: 0.18em; padding: 6px 12px;
  background: transparent; color: var(--ci-amber);
  border: 1px solid var(--ci-amber);
  cursor: pointer;
  transition: background var(--dur-micro);
  justify-self: end;
}
.board-book:hover { background: var(--ci-amber); color: var(--ci-lcd-bg); }
.board-foot {
  padding: 14px 20px;
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.18em; color: var(--ci-phosphor-dim);
  border-top: 1px solid rgba(226,200,131,0.12);
  text-align: center;
}
@media (max-width: 720px) {
  .board-row { grid-template-columns: 0.8fr 0.5fr 0.5fr 0.6fr 0.8fr; font-size: 11px; padding: 10px 12px; }
  .board-row > span:nth-child(4), .board-row > span:nth-child(5) { display: none; }
}

/* ── TRUST ─────────────────────────────────────────────────── */
.trust {
  padding: 96px 28px;
  background: var(--tnh-paper);
  border-bottom: 1.5px solid var(--border);
}
.trust-grid {
  max-width: var(--container-max); margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1.5px solid var(--border);
}
.trust-card {
  padding: 32px 24px;
  border-right: 1.5px solid var(--border);
  display: flex; flex-direction: column; gap: 10px;
}
.trust-card:last-child { border-right: none; }
.trust-num {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: 56px; line-height: 1;
  color: var(--ci-amber);
}
.trust-card h3 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: 22px;
  color: var(--tnh-meadow);
}
.trust-card p {
  font-size: 13px; color: var(--fg-2); line-height: 1.6;
}
@media (max-width: 920px) {
  .trust-grid { grid-template-columns: 1fr 1fr; }
  .trust-card:nth-child(2) { border-right: none; }
  .trust-card:nth-child(1), .trust-card:nth-child(2) { border-bottom: 1.5px solid var(--border); }
}
@media (max-width: 560px) {
  .trust-grid { grid-template-columns: 1fr; }
  .trust-card { border-right: none !important; border-bottom: 1.5px solid var(--border); }
  .trust-card:last-child { border-bottom: none; }
}

/* ── CTA banner ─────────────────────────────────────────────── */
.cta-banner {
  background: var(--tnh-ink);
  color: var(--tnh-paper);
  border-bottom: 1.5px solid var(--border);
}
.cta-banner-inner {
  max-width: 880px; margin: 0 auto;
  text-align: center;
  padding: 80px 28px;
}
.cta-tag {
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 0.24em; color: var(--tnh-pink);
  margin-bottom: 16px;
}
.cta-banner h2 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: clamp(32px, 4vw, 52px); line-height: 1.05;
  margin-bottom: 32px;
}
.cta-row {
  display: inline-flex; gap: 12px; flex-wrap: wrap;
  justify-content: center;
}
.cta-ghost-dark {
  color: var(--tnh-paper);
  border-color: rgba(250,246,236,0.3);
  box-shadow: 4px 4px 0 0 rgba(226,200,131,0.5);
}

/* ── FOOTER ─────────────────────────────────────────────────── */
.site-foot {
  background: var(--tnh-twilight-deep);
  color: var(--fg-1);
  border-top: 1.5px solid var(--border);
}
.foot-line {
  max-width: var(--container-max); margin: 0 auto;
  padding: 22px 28px;
  display: flex; align-items: center; justify-content: space-between;
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--fg-2);
  flex-wrap: wrap; gap: 8px;
}
.foot-mid {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic; font-weight: 700;
  font-size: 14px; letter-spacing: 0; text-transform: none;
  color: var(--fg-1);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(1.3); }
}
</style>
