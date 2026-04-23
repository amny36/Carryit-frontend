<template>
  <v-dialog
    :model-value="modelValue"
    max-width="400"
    @update:model-value="$emit('update:modelValue', $event)"
    @click:outside="handleCancel"
  >
    <div class="retro-dialog">
      <!-- Title bar -->
      <div class="dialog-titlebar">
        <span class="dialog-title">{{ title }}</span>
        <button class="close-btn" @click="handleCancel" :disabled="loading">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <!-- Message -->
      <div class="dialog-body">
        <p class="dialog-message">{{ message }}</p>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <button class="btn-cancel" @click="handleCancel" :disabled="loading">
          {{ cancelText }}
        </button>
        <button
          class="btn-confirm"
          :class="confirmColor === 'error' ? 'btn-danger' : 'btn-primary-confirm'"
          @click="handleConfirm"
          :disabled="loading"
        >
          <v-progress-circular v-if="loading" size="16" width="2" indeterminate color="white" />
          <span v-else>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmColor: {
    type: String,
    default: 'error'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const handleCancel = () => {
  if (props.loading) return
  emit('cancel')
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  if (props.loading) return
  emit('confirm')
}
</script>

<style scoped>
.retro-dialog {
  background: #FAFAF7;
  border: 2px solid #0A0A0A;
  border-radius: 8px;
  box-shadow: 6px 6px 0 #0A0A0A;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Title bar */
.dialog-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 2px solid #0A0A0A;
  background: #F3F4F6;
}

.dialog-title {
  font-family: 'Archivo', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #0A0A0A;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  color: #6B7280;
  transition: background 0.12s, color 0.12s;
}
.close-btn:hover { background: rgba(0,0,0,0.08); color: #0A0A0A; }
.close-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Body */
.dialog-body {
  padding: 20px 18px;
}

.dialog-message {
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* Actions */
.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel {
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #0A0A0A;
  background: transparent;
  border: 2px solid #0A0A0A;
  border-radius: 6px;
  padding: 7px 18px;
  cursor: pointer;
  transition: background 0.12s;
}
.btn-cancel:hover { background: rgba(0,0,0,0.05); }
.btn-cancel:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-confirm {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: white;
  border: 2px solid #0A0A0A;
  border-radius: 6px;
  padding: 7px 18px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #0A0A0A;
  transition: transform 0.1s, box-shadow 0.1s;
  min-width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-confirm:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 #0A0A0A; }
.btn-confirm:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #0A0A0A; }
.btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: 2px 2px 0 #0A0A0A; }

.btn-danger         { background: #C23B3B; }
.btn-primary-confirm { background: #FF4DA6; }
</style>
