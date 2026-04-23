<template>
  <div class="about-page">
    <!-- Breadcrumb strip -->
    <div class="breadcrumb-strip hairline-bot">
      <div class="app-container flex-between" style="height: 100%;">
        <span class="serial" style="font-size:10px;">CarryIt / About</span>
        <span class="serial" style="font-size:10px;">52.3741° N, 4.8897° E</span>
      </div>
    </div>

    <div class="app-container">
      <!-- Hero -->
      <section class="about-hero animate-rise-in">
        <p class="lbl" style="color: var(--tnh-pink); margin-bottom: var(--space-3);">How CarryIt Works</p>
        <h1 class="about-headline">
          People travel.<br />
          Packages need to move.<br />
          <span style="color: var(--tnh-pink);">We connect both.</span>
        </h1>
        <p class="about-sub" style="margin-top: var(--space-5); max-width: 560px;">
          CarryIt is a peer-to-peer package delivery platform that turns travelers into couriers.
          Senders find real travelers going their route. Travelers earn money for space they already have.
        </p>
      </section>

      <!-- Steps grid -->
      <section class="steps-section">
        <p class="lbl" style="color: var(--fg-2); margin-bottom: var(--space-5);">The Process</p>
        <div class="steps-grid">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="step-cell animate-rise-in"
            :style="{ animationDelay: i * 80 + 'ms' }"
          >
            <div class="step-number lbl" style="color: var(--tnh-pink); margin-bottom: var(--space-3);">0{{ i + 1 }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <h3 class="step-title" style="margin-top: var(--space-3); margin-bottom: var(--space-2);">{{ step.title }}</h3>
            <p class="step-desc" style="color: var(--fg-2); font-size: var(--fs-body-s); line-height: var(--lh-body);">{{ step.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Trust section -->
      <section class="trust-section">
        <p class="lbl" style="color: var(--fg-2); margin-bottom: var(--space-5);">Why CarryIt</p>
        <div class="trust-grid">
          <div v-for="(item, i) in trust" :key="item.title" class="trust-cell card-stack animate-rise-in" :style="{ animationDelay: i * 80 + 'ms' }">
            <div class="stamp stamp-green" style="margin-bottom: var(--space-4);">{{ item.stamp }}</div>
            <h3 style="margin-bottom: var(--space-2);">{{ item.title }}</h3>
            <p style="color: var(--fg-2); font-size: var(--fs-body-s); line-height: var(--lh-body);">{{ item.desc }}</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-card card-dark">
          <p class="lbl" style="color: var(--tnh-pink); margin-bottom: var(--space-3);">Ready to start?</p>
          <h2 style="color: var(--tnh-paper); margin-bottom: var(--space-5);">Join CarryIt today</h2>
          <div class="flex-center gap-4" style="flex-wrap: wrap;">
            <router-link to="/auth/signup" class="btn btn-pink btn-lg">Create Account</router-link>
            <router-link to="/sender/search" class="btn btn-ghost btn-lg" style="border-color: var(--tnh-paper); color: var(--tnh-paper);">Search Trips</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const steps = [
  { icon: '📦', title: 'Post Your Package', desc: 'Senders describe their item — size, weight, destination — and set a budget.' },
  { icon: '✈️', title: 'Find a Traveler',   desc: 'Browse real travelers going your route. Check their trust score and KYC badge.' },
  { icon: '🤝', title: 'Book & Escrow',     desc: 'Pay securely. Funds are held in escrow until delivery is confirmed.' },
  { icon: '📍', title: 'Track in Real Time',desc: 'Follow your package through every stage with live status updates.' },
  { icon: '⭐', title: 'Rate & Release',    desc: 'Confirm delivery with an OTP code. Funds release. Leave a review.' },
]

const trust = [
  { stamp: 'KYC',      title: 'Identity Verified',  desc: 'Every traveler passes government ID verification before accepting bookings.' },
  { stamp: 'ESCROW',   title: 'Secure Payments',    desc: 'Money never goes directly to traveler until you confirm delivery.' },
  { stamp: 'INSURED',  title: 'Package Protection', desc: 'Items are covered during transit. Raise a dispute if anything goes wrong.' },
  { stamp: 'RATED',    title: 'Trust Score System', desc: 'Community ratings build accountability. High scores unlock more routes.' },
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  padding-bottom: var(--space-10);
}

.breadcrumb-strip {
  height: 36px;
  display: flex;
  align-items: center;
  margin-bottom: var(--space-8);
}

/* Hero */
.about-hero {
  padding: var(--space-8) 0 var(--space-8);
  border-bottom: 1.5px solid var(--border);
  margin-bottom: var(--space-8);
}
.about-headline {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.about-sub {
  font-size: var(--fs-body-l);
  color: var(--fg-2);
  line-height: var(--lh-loose);
}

/* Steps */
.steps-section {
  margin-bottom: var(--space-8);
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border: 1.5px solid var(--border);
  background: var(--border);
  gap: 1.5px;
}
.step-cell {
  background: var(--bg);
  padding: 28px 20px;
}
.step-icon { font-size: 28px; line-height: 1; }
.step-title { font-size: var(--fs-body-l); font-weight: 700; }

@media (max-width: 960px) {
  .steps-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .steps-grid { grid-template-columns: 1fr; }
}

/* Trust */
.trust-section { margin-bottom: var(--space-8); }
.trust-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-5);
}
.trust-cell { padding: var(--space-6); }

@media (max-width: 960px) { .trust-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .trust-grid { grid-template-columns: 1fr; } }

/* CTA */
.cta-section { margin-top: var(--space-6); }
.cta-card {
  padding: var(--space-8);
  text-align: center;
}
</style>
