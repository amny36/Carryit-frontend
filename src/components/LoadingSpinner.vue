<template>
  <transition name="fade">
    <div v-if="show" :class="['spinner-wrap', { fullscreen, 'with-overlay': overlay }]">
      <div class="spinner-inner">
        <v-progress-circular
          indeterminate
          color="#FF4DA6"
          :size="spinnerSize"
          :width="3"
        />
        <span v-if="text" class="spinner-text">{{ text }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Loading...'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: true
  }
})

const spinnerSize = computed(() => props.fullscreen ? 56 : 40)
</script>

<style scoped>
.spinner-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* Overlay / fullscreen variants */
.spinner-wrap.with-overlay {
  background: rgba(233, 222, 234, 0.75);
  backdrop-filter: blur(2px);
}

.spinner-wrap.fullscreen {
  position: fixed;
  inset: 0;
}

.spinner-wrap:not(.fullscreen) {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

/* Inner centered column */
.spinner-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.spinner-text {
  font-family: 'VT323', monospace;
  font-size: 22px;
  color: #FF4DA6;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(255, 77, 166, 0.4);
  animation: blink-text 1.2s step-start infinite;
}

@keyframes blink-text {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
