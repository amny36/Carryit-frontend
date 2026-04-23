<template>
  <div class="lcd-card">
    <div class="lcd-title">PRICE CALCULATION</div>
    <div class="lcd-divider" />

    <div class="lcd-row calc-row">
      <span class="lcd-label">{{ kgBooked }} kg × {{ pricePerKg }} {{ currency }}</span>
    </div>
    <div class="lcd-thin-divider" />

    <div class="lcd-row">
      <span class="lcd-label">Subtotal</span>
      <span class="lcd-value">{{ subtotal.toFixed(2) }} {{ currency }}</span>
    </div>
    <div class="lcd-row">
      <span class="lcd-label">Platform fee (10%)</span>
      <span class="lcd-value fee-value">{{ displayFee.toFixed(2) }} {{ currency }}</span>
    </div>
    <div class="lcd-thick-divider" />

    <div class="lcd-row total-row">
      <span class="lcd-total-label">YOU PAY</span>
      <span class="lcd-total-value">{{ displayTotal.toFixed(2) }} {{ currency }}</span>
    </div>

    <div class="lcd-divider" />
    <div class="lcd-row earns-row">
      <span class="lcd-earns-label">Traveler earns</span>
      <span class="lcd-earns-value">{{ displayPayout.toFixed(2) }} {{ currency }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalPrice: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  travelerPayout: {
    type: Number,
    default: 0
  },
  kgBooked: {
    type: Number,
    default: 0
  },
  pricePerKg: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'TND'
  }
})

const subtotal     = computed(() => props.kgBooked * props.pricePerKg)
const displayFee   = computed(() => props.platformFee || subtotal.value * 0.1)
const displayTotal = computed(() => props.totalPrice || subtotal.value + displayFee.value)
const displayPayout = computed(() => props.travelerPayout || subtotal.value - displayFee.value)
</script>

<style scoped>
.lcd-card {
  background: #141a14;
  border: 2px solid #2a3d2a;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #0A0A0A, inset 0 0 20px rgba(0, 0, 0, 0.4);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: 'VT323', monospace;
}

.lcd-title {
  font-size: 18px;
  color: #A3D977;
  letter-spacing: 1.5px;
  text-shadow: 0 0 8px rgba(163, 217, 119, 0.7);
  font-family: 'VT323', monospace;
}

.lcd-divider {
  height: 1px;
  background: rgba(163, 217, 119, 0.25);
  margin: 2px 0;
}

.lcd-thin-divider {
  height: 1px;
  background: rgba(163, 217, 119, 0.12);
  margin: 1px 0;
}

.lcd-thick-divider {
  height: 2px;
  background: rgba(163, 217, 119, 0.4);
  margin: 4px 0;
}

.lcd-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.lcd-label {
  font-size: 16px;
  color: #7aad4e;
  letter-spacing: 0.5px;
}

.lcd-value {
  font-size: 18px;
  color: #A3D977;
  text-shadow: 0 0 6px rgba(163, 217, 119, 0.5);
  letter-spacing: 1px;
  font-family: 'VT323', monospace;
}

.fee-value {
  color: #E8A94A;
  text-shadow: 0 0 6px rgba(232, 169, 74, 0.5);
}

.calc-row .lcd-label {
  color: #A3D977;
  font-size: 17px;
}

/* Total row */
.total-row {
  margin: 4px 0;
}

.lcd-total-label {
  font-size: 22px;
  color: #A3D977;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(163, 217, 119, 0.8);
  font-family: 'VT323', monospace;
}

.lcd-total-value {
  font-size: 28px;
  color: #A3D977;
  text-shadow: 0 0 12px rgba(163, 217, 119, 0.9), 0 0 20px rgba(163, 217, 119, 0.4);
  letter-spacing: 2px;
  font-family: 'VT323', monospace;
}

/* Earns row */
.earns-row {
  margin-top: 2px;
}

.lcd-earns-label {
  font-size: 15px;
  color: #6b8b52;
  letter-spacing: 0.5px;
}

.lcd-earns-value {
  font-size: 18px;
  color: #E8A94A;
  text-shadow: 0 0 6px rgba(232, 169, 74, 0.5);
  letter-spacing: 1px;
  font-family: 'VT323', monospace;
}
</style>
