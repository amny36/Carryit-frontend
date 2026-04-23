<template>
  <div class="base-input-wrap">
    <label v-if="label" class="input-label" :for="inputId">{{ label }}</label>
    <div class="input-field-wrap" :class="{ error: !!errorMsg, focused }">
      <slot name="prepend" />
      <component
        :is="type === 'textarea' ? 'textarea' : 'input'"
        :id="inputId"
        class="input-field"
        :class="{ 'with-prepend': $slots.prepend, 'with-append': $slots.append }"
        v-bind="$attrs"
        :type="type !== 'textarea' ? type : undefined"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="type === 'textarea' ? rows : undefined"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
      />
      <slot name="append" />
    </div>
    <span v-if="hint && !errorMsg" class="input-hint">{{ hint }}</span>
    <span v-if="errorMsg" class="input-error-msg">{{ errorMsg }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label:      { type: String, default: '' },
  placeholder:{ type: String, default: '' },
  type:       { type: String, default: 'text' },
  hint:       { type: String, default: '' },
  errorMsg:   { type: String, default: '' },
  disabled:   { type: Boolean, default: false },
  rows:       { type: Number, default: 3 },
})
defineEmits(['update:modelValue'])

const focused = ref(false)
const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 7)}`)
</script>

<style scoped>
.base-input-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.input-field-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  background: var(--bg-surface);
  transition: box-shadow var(--dur-micro) var(--ease-out);
}
.input-field-wrap.focused { box-shadow: 3px 3px 0 0 var(--tnh-pink); }
.input-field-wrap.error   { box-shadow: 3px 3px 0 0 var(--ci-stamp-red); }

.input-field {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--fg-1);
  background: transparent;
  border: none;
  outline: none;
  resize: vertical;
  line-height: var(--lh-body);
  -webkit-appearance: none;
  appearance: none;
}
.input-field::placeholder { color: var(--fg-3); font-weight: 400; }
.input-field:disabled { opacity: 0.5; cursor: not-allowed; }

.input-field.with-prepend { padding-left: var(--space-2); }
.input-field.with-append  { padding-right: var(--space-2); }
</style>
