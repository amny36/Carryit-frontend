<template>
  <div
    class="notif-item"
    :class="{ unread: !notification.read, [`type-${notification.type}`]: true }"
    @click="handleClick"
    role="listitem"
    :aria-label="notification.title"
  >
    <!-- Left type border (via CSS) -->

    <!-- Icon -->
    <div class="notif-icon" :class="`icon-${notification.type}`">
      <v-icon :icon="typeIcon" :color="typeColor" size="20" />
    </div>

    <!-- Content -->
    <div class="notif-content">
      <div class="notif-header">
        <span class="notif-title">{{ notification.title }}</span>
        <span class="notif-time">{{ relativeTime }}</span>
      </div>
      <p class="notif-message">{{ notification.message }}</p>
    </div>

    <!-- Unread dot -->
    <div v-if="!notification.read" class="unread-dot" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    required: true
    // { id, type, title, message, time, read }
  }
})

const emit = defineEmits(['mark-read'])

const TYPE_MAP = {
  success: { icon: 'mdi-check-circle',   color: '#3D5B3E', border: '#A3D977' },
  info:    { icon: 'mdi-information',    color: '#3B82F6', border: '#3B82F6' },
  warning: { icon: 'mdi-alert',          color: '#E8A94A', border: '#E8A94A' },
  error:   { icon: 'mdi-alert-circle',   color: '#C23B3B', border: '#C23B3B' },
}

const typeIcon  = computed(() => TYPE_MAP[props.notification.type]?.icon  ?? 'mdi-information')
const typeColor = computed(() => TYPE_MAP[props.notification.type]?.color ?? '#3B82F6')

const relativeTime = computed(() => {
  const raw = props.notification.time
  if (!raw) return ''

  const now  = Date.now()
  const then = new Date(raw).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hrs < 24)   return `${hrs}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7)   return `${days}d ago`

  return new Date(raw).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

const handleClick = () => {
  emit('mark-read', props.notification.id)
}
</script>

<style scoped>
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1.5px solid transparent;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
  background: #ffffff;
  overflow: hidden;
}

/* Left colored border via pseudo-element */
.notif-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.notif-item.type-success::before { background: #A3D977; }
.notif-item.type-info::before    { background: #3B82F6; }
.notif-item.type-warning::before { background: #E8A94A; }
.notif-item.type-error::before   { background: #C23B3B; }

.notif-item.unread {
  background: rgba(255, 77, 166, 0.04);
  border-color: rgba(255, 77, 166, 0.15);
}

.notif-item:hover { background: rgba(0, 0, 0, 0.03); }
.notif-item.unread:hover { background: rgba(255, 77, 166, 0.07); }

/* Icon */
.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-success { background: rgba(163, 217, 119, 0.18); }
.icon-info    { background: rgba(59, 130, 246, 0.12);  }
.icon-warning { background: rgba(232, 169, 74, 0.15);  }
.icon-error   { background: rgba(194, 59, 59, 0.12);   }

/* Content */
.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 3px;
}

.notif-title {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #0A0A0A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread .notif-title {
  font-weight: 700;
}

.notif-time {
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  color: #9CA3AF;
  white-space: nowrap;
  flex-shrink: 0;
}

.notif-message {
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

/* Unread dot */
.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FF4DA6;
  flex-shrink: 0;
  margin-top: 4px;
}
</style>
