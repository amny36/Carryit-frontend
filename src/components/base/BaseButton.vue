<template>
  <component
    :is="to ? 'router-link' : tag"
    :to="to"
    :type="!to && tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    class="base-btn"
    :class="[`btn-variant-${variant}`, `btn-size-${size}`, { loading }]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner animate-spin">◌</span>
    <slot v-else />
  </component>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  variant:  { type: String, default: 'default' }, // default | primary | pink | ghost
  size:     { type: String, default: 'md' },       // sm | md | lg
  to:       { type: [String, Object], default: null },
  tag:      { type: String, default: 'button' },
  type:     { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading:  { type: Boolean, default: false },
})
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  line-height: 1;
  border-radius: var(--radius-0);
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  white-space: nowrap;
  transition: transform var(--dur-micro) var(--ease-out),
              box-shadow var(--dur-micro) var(--ease-out),
              background var(--dur-micro) var(--ease-out),
              color var(--dur-micro) var(--ease-out);
}
.base-btn:disabled,
.base-btn.loading { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

/* Sizes */
.btn-size-sm { padding: 8px 12px;  font-size: 10px; box-shadow: var(--shadow-xs); border: 1.5px solid var(--border); }
.btn-size-md { padding: 13px 20px; font-size: 12px; box-shadow: var(--shadow-sm); border: 1.5px solid var(--border); }
.btn-size-lg { padding: 16px 28px; font-size: 13px; box-shadow: var(--shadow-sm); border: 1.5px solid var(--border); }

/* Variants */
.btn-variant-default {
  color: var(--fg-1);
  background: var(--bg-surface);
}
.btn-variant-default:hover { transform: translate(-1px,-1px); box-shadow: var(--shadow-md); }
.btn-variant-default:active { transform: translate(3px,3px); box-shadow: none; }

.btn-variant-primary {
  color: var(--tnh-paper);
  background: var(--tnh-ink);
  box-shadow: 3px 3px 0 0 var(--tnh-pink);
}
.btn-variant-primary:hover { background: var(--tnh-pink); box-shadow: var(--shadow-sm); transform: translate(-1px,-1px); }
.btn-variant-primary:active { transform: translate(3px,3px); box-shadow: none; }

.btn-variant-pink {
  color: var(--tnh-paper);
  background: var(--tnh-pink);
}
.btn-variant-pink:hover { background: var(--tnh-pink-deep); transform: translate(-1px,-1px); box-shadow: var(--shadow-md); }
.btn-variant-pink:active { transform: translate(3px,3px); box-shadow: none; }

.btn-variant-ghost {
  background: transparent;
  box-shadow: none;
}
.btn-variant-ghost:hover { background: rgba(10,10,10,0.06); box-shadow: var(--shadow-sm); transform: translate(-1px,-1px); }

.btn-spinner { font-family: var(--font-mono); }
</style>
