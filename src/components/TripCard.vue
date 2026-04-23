<template>
  <div
    class="trip-card"
    :class="{ clickable, compact }"
    @click="handleClick"
    role="article"
  >
    <!-- Transport mode + Status row -->
    <div class="card-top-row">
      <div class="transport-badge">
        <v-icon :icon="transportIcon" size="16" />
        <span>{{ transportLabel }}</span>
      </div>
      <StatusPill :status="trip.status" small />
    </div>

    <!-- Route -->
    <div class="route-row">
      <span class="origin">{{ trip.origin?.toUpperCase() }}</span>
      <v-icon size="20" color="#9CA3AF">mdi-arrow-right</v-icon>
      <span class="destination">{{ trip.destination?.toUpperCase() }}</span>
    </div>

    <!-- Date + Weight row -->
    <div class="meta-row" v-if="!compact">
      <div class="meta-item">
        <v-icon size="14" color="#6B7280">mdi-calendar</v-icon>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="meta-item">
        <v-icon size="14" color="#6B7280">mdi-weight-kilogram</v-icon>
        <span>{{ trip.availableKg }} kg available</span>
      </div>
    </div>

    <!-- Price -->
    <div class="price-row">
      <span class="price">{{ trip.pricePerKg }} {{ 'TND' }}/kg</span>
    </div>

    <!-- Description -->
    <p v-if="trip.description && !compact" class="description">
      {{ trip.description }}
    </p>

    <!-- Traveler info footer -->
    <div class="card-footer">
      <div class="traveler-info">
        <div class="traveler-avatar">{{ travelerInitials }}</div>
        <div class="traveler-details">
          <span class="traveler-name">{{ trip.travelerName }}</span>
          <TrustScore :score="trip.travelerScore ?? 0" size="sm" />
        </div>
      </div>
      <div v-if="compact" class="meta-compact">
        <v-icon size="13" color="#6B7280">mdi-calendar</v-icon>
        <span>{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusPill from './StatusPill.vue'
import TrustScore from './TrustScore.vue'

const props = defineProps({
  trip: {
    type: Object,
    required: true
  },
  clickable: {
    type: Boolean,
    default: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
const router = useRouter()

const TRANSPORT_MAP = {
  plane: { icon: 'mdi-airplane',   label: 'Plane'  },
  train: { icon: 'mdi-train',      label: 'Train'  },
  bus:   { icon: 'mdi-bus',        label: 'Bus'    },
  car:   { icon: 'mdi-car',        label: 'Car'    },
}

const transportIcon  = computed(() => TRANSPORT_MAP[props.trip.transportMode]?.icon  ?? 'mdi-airplane')
const transportLabel = computed(() => TRANSPORT_MAP[props.trip.transportMode]?.label ?? props.trip.transportMode)

const formattedDate = computed(() => {
  if (!props.trip.date) return '—'
  return new Date(props.trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const travelerInitials = computed(() => {
  const name = props.trip.travelerName || 'T'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleClick = () => {
  if (!props.clickable) return
  emit('click', props.trip)
  router.push(`/sender/trip/${props.trip.id}`)
}
</script>

<style scoped>
.trip-card {
  background: #ffffff;
  border: 2px solid #0A0A0A;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #0A0A0A;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.trip-card.clickable {
  cursor: pointer;
}

.trip-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 0 #0A0A0A;
}

.trip-card.compact {
  padding: 12px;
  gap: 8px;
}

/* Top row */
.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.transport-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 3px 8px;
}

/* Route */
.route-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.origin,
.destination {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: #0A0A0A;
  letter-spacing: 0.5px;
}

.compact .origin,
.compact .destination {
  font-size: 15px;
}

/* Meta */
.meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #6B7280;
}

/* Price */
.price-row {
  display: flex;
  align-items: center;
}

.price {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 20px;
  color: #FF4DA6;
}

.compact .price { font-size: 16px; }

/* Description */
.description {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid #F3F4F6;
}

.traveler-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.traveler-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E9DEEA;
  border: 2px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 11px;
  color: #0A0A0A;
  flex-shrink: 0;
}

.traveler-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.traveler-name {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0A0A0A;
  line-height: 1.2;
}

.meta-compact {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  color: #6B7280;
}
</style>
