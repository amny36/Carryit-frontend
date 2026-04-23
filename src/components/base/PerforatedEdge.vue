<template>
  <!--
    Perforated ticket edge — creates a row of punched holes.
    Place .perf-top at top of a section, .perf-bottom at bottom.
    Pass bgColor matching the page/parent background so holes appear cut out.
  -->
  <div
    class="perf-edge"
    :class="position === 'top' ? 'perf-top-edge' : 'perf-bottom-edge'"
    :style="{ '--hole-color': bgColor }"
  />
</template>

<script setup>
defineProps({
  position: { type: String, default: 'top' },   // 'top' | 'bottom'
  bgColor:  { type: String, default: 'var(--bg)' },
})
</script>

<style scoped>
.perf-edge {
  width: 100%;
  height: 14px;
  background-image: radial-gradient(
    circle at 7px 7px,
    var(--hole-color) 5px,
    transparent 5.5px
  );
  background-size: 14px 14px;
  background-repeat: repeat-x;
  position: relative;
  z-index: 1;
}
.perf-top-edge    { margin-top: -7px;    }
.perf-bottom-edge { margin-bottom: -7px; }
</style>
