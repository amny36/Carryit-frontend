<template>
  <span class="pill" :class="pillClass">
    <span v-if="status === 'in_transit' || status === 'transit'" class="pill-dot" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  small:  { type: Boolean, default: false },
})

const map = {
  pending:    { cls: 'pill-pending',   label: 'Pending'    },
  accepted:   { cls: 'pill-accepted',  label: 'Accepted'   },
  active:     { cls: 'pill-active',    label: 'Active'     },
  in_transit: { cls: 'pill-live',      label: 'In Transit' },
  transit:    { cls: 'pill-live',      label: 'In Transit' },
  delivered:  { cls: 'pill-delivered', label: 'Delivered'  },
  cancelled:  { cls: 'pill-cancelled', label: 'Cancelled'  },
  rejected:   { cls: 'pill-rejected',  label: 'Rejected'   },
  disputed:   { cls: 'pill-pending',   label: 'Disputed'   },
  completed:  { cls: 'pill-delivered', label: 'Completed'  },
}

const pillClass = computed(() => map[props.status]?.cls || 'pill-pending')
const label     = computed(() => map[props.status]?.label || props.status)
</script>
