<template>
  <!--
    BaseTicketCard — Boarding pass style card.
    Slots: header, route, specs, body, stub, footer, total
    Props control visual variant and whether stub/perf edges appear.
  -->
  <div class="ticket-card" :class="[`ticket-${variant}`, { 'has-stub': !!$slots.stub }]">

    <!-- Header slot -->
    <div v-if="$slots.header" class="tc-header">
      <slot name="header" />
    </div>

    <!-- Route slot -->
    <div v-if="$slots.route" class="tc-route">
      <slot name="route" />
    </div>

    <!-- Specs slot (grid row) -->
    <div v-if="$slots.specs" class="tc-specs" :style="specsStyle">
      <slot name="specs" />
    </div>

    <!-- Main layout: body + optional stub -->
    <div class="tc-body-row">
      <!-- Body slot -->
      <div class="tc-body">
        <slot />
      </div>

      <!-- Stub slot (right side, dashed separator) -->
      <div v-if="$slots.stub" class="tc-stub">
        <slot name="stub" />
      </div>
    </div>

    <!-- Perforated divider before footer -->
    <PerforatedEdge v-if="showPerf" position="top" :bgColor="perfColor" />

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="tc-footer">
      <slot name="footer" />
    </div>

    <!-- Dark total footer -->
    <div v-if="$slots.total" class="tc-total">
      <slot name="total" />
    </div>
  </div>
</template>

<script setup>
import PerforatedEdge from './PerforatedEdge.vue'

const props = defineProps({
  variant:   { type: String, default: 'default' }, // 'default' | 'warm' | 'dark'
  specsCol:  { type: Number, default: 4 },
  showPerf:  { type: Boolean, default: false },
  perfColor: { type: String, default: 'var(--bg)' },
})

const specsStyle = { gridTemplateColumns: `repeat(${props.specsCol}, 1fr)` }
</script>

<style scoped>
.ticket-card {
  border: 1.5px solid var(--border);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: box-shadow var(--dur-micro) var(--ease-out),
              transform var(--dur-micro) var(--ease-out);
}
.ticket-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translate(-1px, -1px);
}

/* Variants */
.ticket-default { background: var(--bg-surface); }
.ticket-warm    { background: var(--bg-ticket); }
.ticket-dark    { background: var(--tnh-ink); color: var(--tnh-paper); }

/* Sections */
.tc-header {
  padding: 16px 20px;
  border-bottom: 1.5px solid var(--border);
}
.tc-route {
  padding: 20px 24px;
  border-bottom: 1.5px dashed var(--border);
}
.tc-specs {
  display: grid;
  border-top: 1px solid var(--border-soft);
}
.tc-specs :slotted(.spec-cell) {
  padding: 14px 16px;
  border-right: 1px solid var(--border-soft);
}
.tc-specs :slotted(.spec-cell:last-child) { border-right: none; }

/* Body row: main content + optional stub */
.tc-body-row {
  display: flex;
}
.tc-body { flex: 1; }
.tc-stub {
  width: 180px;
  flex-shrink: 0;
  border-left: 2px dashed var(--border);
  padding: 16px;
}

/* Footers */
.tc-footer {
  padding: 14px 20px;
  border-top: 1px dashed var(--border);
}
.tc-total {
  padding: 18px 20px;
  background: var(--tnh-ink);
  color: var(--tnh-paper);
}

/* Without stub: body is full width */
.ticket-card:not(.has-stub) .tc-body {
  padding: 0; /* let consumer add padding inside slot */
}
</style>
