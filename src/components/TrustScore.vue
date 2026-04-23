<template>
  <span class="trust-score" :class="`size-${size}`">
    <v-icon :size="iconSize" color="#E8A94A" style="vertical-align: middle;">mdi-star</v-icon>
    <span class="score-num">{{ formattedScore }}</span>
    <span v-if="showCount && count != null" class="review-count">({{ count }})</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  showCount: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: null
  }
})

const formattedScore = computed(() => {
  const n = Number(props.score)
  return isNaN(n) ? '—' : n.toFixed(1)
})

const iconSize = computed(() => ({ sm: 14, md: 16, lg: 20 }[props.size]))
</script>

<style scoped>
.trust-score {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: #0A0A0A;
}

.size-sm .score-num  { font-size: 12px; }
.size-md .score-num  { font-size: 14px; }
.size-lg .score-num  { font-size: 18px; }

.size-sm .review-count { font-size: 11px; }
.size-md .review-count { font-size: 13px; }
.size-lg .review-count { font-size: 16px; }

.score-num {
  line-height: 1;
}

.review-count {
  color: #6B7280;
  font-weight: 400;
  line-height: 1;
}
</style>
