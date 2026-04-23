<template>
  <div class="booking-card" @click="handleClick">
    <!-- Header: Route + Status -->
    <div class="card-header">
      <div class="route">
        <span class="origin">{{ booking.origin?.toUpperCase() }}</span>
        <v-icon size="16" color="#9CA3AF">mdi-arrow-right</v-icon>
        <span class="destination">{{ booking.destination?.toUpperCase() }}</span>
      </div>
      <StatusPill :status="booking.status" small />
    </div>

    <!-- Booking ID -->
    <div class="booking-id">{{ bookingLabel }}</div>

    <!-- Meta row: date, weight, price -->
    <div class="meta-row">
      <div class="meta-item">
        <v-icon size="13" color="#6B7280">mdi-calendar</v-icon>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="meta-item">
        <v-icon size="13" color="#6B7280">mdi-weight-kilogram</v-icon>
        <span>{{ booking.kgBooked }} kg</span>
      </div>
      <div class="meta-item price-item">
        <v-icon size="13" color="#FF4DA6">mdi-cash</v-icon>
        <span>{{ booking.totalPrice }} TND</span>
      </div>
    </div>

    <!-- Package description -->
    <p v-if="booking.packageDescription" class="pkg-desc">
      {{ truncatedDesc }}
    </p>

    <!-- Counter-party info -->
    <div class="party-row">
      <div class="party-avatar">{{ partyInitials }}</div>
      <div class="party-info">
        <span class="party-label">{{ userRole === 'sender' ? 'Traveler' : 'Sender' }}</span>
        <span class="party-name">{{ partyName }}</span>
      </div>
    </div>

    <!-- Action bar -->
    <div class="action-bar" v-if="showActions">
      <button v-if="isActive" class="action-btn track-btn" @click.stop="handleTrack">
        <v-icon size="15">mdi-map-marker-path</v-icon>
        Track
      </button>
      <button v-if="isDelivered && userRole === 'sender'" class="action-btn rate-btn" @click.stop="handleRate">
        <v-icon size="15">mdi-star-outline</v-icon>
        Rate
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusPill from './StatusPill.vue'

const props = defineProps({
  booking: {
    type: Object,
    required: true
  },
  userRole: {
    type: String,
    default: 'sender',
    validator: (v) => ['sender', 'traveler'].includes(v)
  }
})

const emit = defineEmits(['click', 'track', 'rate'])
const router = useRouter()

const bookingLabel = computed(() => {
  const id = props.booking.id
  if (!id) return 'B-???'
  const str = String(id).padStart(4, '0')
  return `#PCK-${str}`
})

const formattedDate = computed(() => {
  if (!props.booking.date) return '—'
  return new Date(props.booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const truncatedDesc = computed(() => {
  const d = props.booking.packageDescription || ''
  return d.length > 50 ? d.slice(0, 50) + '…' : d
})

const partyName = computed(() =>
  props.userRole === 'sender' ? props.booking.travelerName : props.booking.senderName
)

const partyInitials = computed(() => {
  const name = partyName.value || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const isActive   = computed(() => ['accepted', 'picked_up', 'in_transit'].includes(props.booking.status))
const isDelivered = computed(() => props.booking.status === 'delivered')
const showActions = computed(() => isActive.value || (isDelivered.value && props.userRole === 'sender'))

const handleClick = () => {
  emit('click', props.booking)
  const base = props.userRole === 'sender' ? '/sender/booking' : '/traveler/booking'
  router.push(`${base}/${props.booking.id}`)
}

const handleTrack = () => {
  emit('track', props.booking)
  router.push(`/tracking/${props.booking.id}`)
}

const handleRate = () => {
  emit('rate', props.booking)
  router.push(`/rate/${props.booking.id}`)
}
</script>

<style scoped>
.booking-card {
  background: #ffffff;
  border: 2px solid #0A0A0A;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #0A0A0A;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 0 #0A0A0A;
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.route {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.origin,
.destination {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #0A0A0A;
}

/* Booking ID */
.booking-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Meta */
.meta-row {
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
  font-size: 13px;
  color: #6B7280;
}

.price-item {
  color: #FF4DA6;
  font-weight: 700;
}

/* Package desc */
.pkg-desc {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

/* Party */
.party-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #F3F4F6;
}

.party-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #E9DEEA;
  border: 2px solid #0A0A0A;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 10px;
  color: #0A0A0A;
  flex-shrink: 0;
}

.party-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.party-label {
  font-family: 'Archivo', sans-serif;
  font-size: 10px;
  color: #9CA3AF;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.party-name {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0A0A0A;
}

/* Actions */
.action-bar {
  display: flex;
  gap: 8px;
  padding-top: 4px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 2px solid #0A0A0A;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}
.action-btn:active { transform: translate(2px, 2px); box-shadow: none; }

.track-btn {
  background: #FF4DA6;
  color: white;
  box-shadow: 3px 3px 0 #0A0A0A;
}
.track-btn:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #0A0A0A; }

.rate-btn {
  background: #E8A94A;
  color: #0A0A0A;
  box-shadow: 3px 3px 0 #0A0A0A;
}
.rate-btn:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #0A0A0A; }
</style>
