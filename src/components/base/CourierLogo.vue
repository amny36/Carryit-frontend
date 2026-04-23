<template>
  <!-- Courier mascot head — compact logo variant for navbar/branding -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="['courier-logo', state]"
  >
    <!-- Body/head base -->
    <rect x="8" y="10" width="28" height="24" rx="0" fill="#FAFAF7" stroke="#0A0A0A" stroke-width="2.5"/>
    <!-- Cap brim -->
    <rect x="6" y="8" width="32" height="5" rx="0" fill="#FF4DA6" stroke="#0A0A0A" stroke-width="2"/>
    <!-- Cap top -->
    <rect x="10" y="4" width="24" height="6" rx="0" fill="#FF4DA6" stroke="#0A0A0A" stroke-width="2"/>
    <!-- Cap badge -->
    <rect x="18" y="5" width="8" height="4" rx="0" fill="#0A0A0A"/>
    <!-- Eyes -->
    <rect x="15" y="18" width="5" height="5" rx="0" fill="#0A0A0A"/>
    <rect x="24" y="18" width="5" height="5" rx="0" fill="#0A0A0A"/>
    <!-- Mouth / smile indicator -->
    <rect x="17" y="27" width="10" height="2" rx="0" fill="#0A0A0A" opacity="0.4"/>
    <!-- Belly plate accent -->
    <rect x="13" y="24" width="18" height="8" rx="0" fill="#EFE8E0" stroke="#0A0A0A" stroke-width="1"/>
    <!-- Backpack hint — amber square on right side -->
    <rect x="34" y="14" width="6" height="10" rx="0" fill="#E8A94A" stroke="#0A0A0A" stroke-width="1.5"/>
  </svg>
</template>

<script setup>
defineProps({
  size:  { type: Number, default: 32 },
  state: { type: String, default: 'idle' }, // idle | happy | walking
})
</script>

<style scoped>
.courier-logo {
  display: block;
  flex-shrink: 0;
}
.courier-logo.idle    { animation: breathe 2.8s ease-in-out infinite; }
.courier-logo.walking { animation: walk 0.5s ease-in-out infinite; }
.courier-logo.happy {
  animation: breathe 2.8s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-1px) scale(1.02); }
}
@keyframes walk {
  0%, 100% { transform: translateY(0); }
  25%       { transform: translateY(-1px) rotate(-1deg); }
  75%       { transform: translateY(-1px) rotate(1deg); }
}
</style>
