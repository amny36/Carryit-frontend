<template>
  <div class="request-card" :class="{ loading }">
    <!-- Amber top border accent -->
    <div class="amber-bar" />

    <div class="card-body">
      <!-- Sender info -->
      <div class="sender-row">
        <div class="sender-avatar">{{ senderInitials }}</div>
        <div class="sender-details">
          <span class="sender-name">{{ request.senderName }}</span>
          <TrustScore :score="request.senderScore ?? 0" size="sm" />
        </div>
        <StatusPill :status="request.status" small />
      </div>

      <!-- Route + Date -->
      <div class="route-section">
        <div class="route-row">
          <span class="origin">{{ request.origin?.toUpperCase() }}</span>
          <v-icon size="18" color="#9CA3AF">mdi-arrow-right</v-icon>
          <span class="destination">{{ request.destination?.toUpperCase() }}</span>
        </div>
        <div class="date-row">
          <v-icon size="13" color="#6B7280">mdi-calendar</v-icon>
          <span class="date-text">{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Package details -->
      <div class="pkg-section">
        <div class="pkg-header">
          <div class="category-badge">
            <v-icon :icon="categoryIcon" size="15" />
            <span>{{ request.packageCategory || 'General' }}</span>
          </div>
          <span v-if="request.isFragile" class="fragile-badge">
            <v-icon size="13">mdi-glass-fragile</v-icon>
            Fragile
          </span>
        </div>

        <p class="pkg-desc">{{ request.packageDescription || '—' }}</p>

        <div class="pkg-meta">
          <div class="meta-item">
            <v-icon size="13" color="#6B7280">mdi-weight-kilogram</v-icon>
            <span>{{ request.kgBooked }} kg</span>
          </div>
          <div v-if="request.declaredValue" class="meta-item">
            <v-icon size="13" color="#6B7280">mdi-shield-check-outline</v-icon>
            <span>Declared: {{ request.declaredValue }} TND</span>
          </div>
        </div>
      </div>

      <!-- Earnings callout -->
      <div class="earnings-box">
        <span class="earnings-label">You earn</span>
        <span class="earnings-amount">{{ travelerEarns.toFixed(2) }} TND</span>
      </div>

      <!-- Action buttons -->
      <div class="action-row">
        <button
          class="btn-reject"
          @click.stop="$emit('reject', request)"
          :disabled="loading"
        >
          <v-icon size="16">mdi-close</v-icon>
          REJECT
        </button>
        <button
          class="btn-accept"
          @click.stop="$emit('accept', request)"
          :disabled="loading"
        >
          <v-progress-circular v-if="loading" size="16" width="2" indeterminate color="white" />
          <template v-else>
            <v-icon size="16">mdi-check</v-icon>
            ACCEPT
          </template>
        </button>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <v-progress-circular indeterminate color="#FF4DA6" size="36" width="3" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusPill from './StatusPill.vue'
import TrustScore from './TrustScore.vue'

const props = defineProps({
  request: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['accept', 'reject'])

const CATEGORY_ICONS = {
  electronics:  'mdi-laptop',
  clothing:     'mdi-hanger',
  food:         'mdi-food',
  documents:    'mdi-file-document',
  cosmetics:    'mdi-bottle-tonic',
  books:        'mdi-book-open-variant',
  toys:         'mdi-teddy-bear',
  medicine:     'mdi-pill',
  jewelry:      'mdi-diamond-stone',
  general:      'mdi-package-variant',
}

const senderInitials = computed(() => {
  const name = props.request.senderName || 'S'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const formattedDate = computed(() => {
  if (!props.request.date) return '—'
  return new Date(props.request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const categoryIcon = computed(() => {
  const cat = (props.request.packageCategory || 'general').toLowerCase()
  return CATEGORY_ICONS[cat] ?? 'mdi-package-variant'
})

const travelerEarns = computed(() => {
  if (props.request.travelerPayout != null) return props.request.travelerPayout
  // Fallback: 90% of total
  return (props.request.totalPrice ?? 0) * 0.9
})
</script>

<style scoped>
.request-card {
  background: #ffffff;
  border: 2px solid #0A0A0A;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #0A0A0A;
  overflow: hidden;
  position: relative;
  transition: transform 0.15s, box-shadow 0.15s;
}
.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 0 #0A0A0A;
}
.request-card.loading { pointer-events: none; }

/* Amber top accent bar */
.amber-bar {
  height: 4px;
  background: #E8A94A;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Sender row */
.sender-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sender-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #E9DEEA;
  border: 2px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: #0A0A0A;
  flex-shrink: 0;
}

.sender-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.sender-name {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #0A0A0A;
  line-height: 1.2;
}

/* Route */
.route-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  background: #F9FAFB;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
}

.route-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.origin,
.destination {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 15px;
  color: #0A0A0A;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #6B7280;
  white-space: nowrap;
}

.date-text { line-height: 1; }

/* Package */
.pkg-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pkg-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 3px 8px;
  text-transform: capitalize;
}

.fragile-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #C23B3B;
  background: rgba(194, 59, 59, 0.09);
  border: 1.5px solid #C23B3B;
  border-radius: 6px;
  padding: 3px 8px;
}

.pkg-desc {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pkg-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #6B7280;
}

/* Earnings */
.earnings-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #141a14;
  border-radius: 6px;
  border: 1.5px solid #2a3d2a;
}

.earnings-label {
  font-family: 'VT323', monospace;
  font-size: 16px;
  color: #7aad4e;
  letter-spacing: 1px;
}

.earnings-amount {
  font-family: 'VT323', monospace;
  font-size: 24px;
  color: #A3D977;
  text-shadow: 0 0 8px rgba(163, 217, 119, 0.6);
  letter-spacing: 1.5px;
}

/* Actions */
.action-row {
  display: flex;
  gap: 10px;
}

.btn-reject,
.btn-accept {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 9px 12px;
  border-radius: 6px;
  border: 2px solid #0A0A0A;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}
.btn-reject:active,
.btn-accept:active { transform: translate(2px, 2px); box-shadow: none; }
.btn-reject:disabled,
.btn-accept:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.btn-reject {
  background: transparent;
  color: #C23B3B;
  border-color: #C23B3B;
}
.btn-reject:hover:not(:disabled) {
  background: rgba(194, 59, 59, 0.06);
}

.btn-accept {
  background: #3D5B3E;
  color: white;
  box-shadow: 3px 3px 0 #0A0A0A;
}
.btn-accept:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #0A0A0A;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(250, 250, 247, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
</style>
