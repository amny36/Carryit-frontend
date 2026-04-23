<template>
  <div class="not-found-page">
    <!-- Scanlines overlay -->
    <div class="scanlines" aria-hidden="true"></div>

    <div class="content">
      <!-- 404 with glow -->
      <div class="error-code-wrap">
        <span class="error-code">404</span>
        <span class="cursor-blink">_</span>
      </div>

      <!-- Page not found label -->
      <div class="page-not-found-label">PAGE_NOT_FOUND.exe</div>

      <!-- Divider -->
      <div class="green-divider"></div>

      <!-- ASCII Art -->
      <pre class="ascii-art">
  ╔═══════╗
  ║  📦   ║
  ╚═══╤═══╝
      │
  ~~~~┴~~~~
  </pre>
      <div class="ascii-caption">The package fell off the truck.</div>

      <!-- Message -->
      <p class="not-found-message">
        The page you're looking for has left the building.
      </p>

      <!-- Buttons -->
      <div class="btn-row">
        <button class="green-retro-btn" @click="goHome">← Go Home</button>
        <button class="ghost-btn" @click="goSearch">Search Trips</button>
      </div>

      <!-- Footer -->
      <div class="error-footer">
        ERR: 0x00000404 // CarryIt Runtime v1.0.0
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goSearch() {
  router.push('/search')
}
</script>

<style scoped>
/* Full page dark background */
.not-found-page {
  position: relative;
  min-height: 100vh;
  background: #141a14;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Scanlines */
.scanlines {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.05) 3px,
    rgba(0, 0, 0, 0.05) 4px
  );
}

/* Content centered */
.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 24px;
  max-width: 480px;
  width: 100%;
}

/* 404 Error Code */
.error-code-wrap {
  display: flex;
  align-items: baseline;
  justify-content: center;
  line-height: 1;
  margin-bottom: 8px;
}

.error-code {
  font-family: 'VT323', monospace;
  font-size: 140px;
  color: #A3D977;
  text-shadow:
    0 0 20px #A3D977,
    0 0 40px #A3D977,
    0 0 60px rgba(163, 217, 119, 0.4);
  line-height: 1;
  display: block;
}

.cursor-blink {
  font-family: 'VT323', monospace;
  font-size: 100px;
  color: #A3D977;
  text-shadow: 0 0 20px #A3D977;
  animation: blink 1s step-end infinite;
  margin-left: 4px;
  line-height: 1;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Page not found label */
.page-not-found-label {
  font-family: 'VT323', monospace;
  font-size: 24px;
  color: #A3D977;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(163, 217, 119, 0.6);
  margin-bottom: 24px;
}

/* Divider */
.green-divider {
  width: 100%;
  max-width: 300px;
  height: 1px;
  background: #A3D977;
  margin: 0 auto 24px;
  box-shadow: 0 0 6px #A3D977;
}

/* ASCII Art */
.ascii-art {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 14px;
  color: #A3D977;
  text-align: center;
  margin: 0 0 4px;
  line-height: 1.5;
  text-shadow: 0 0 8px rgba(163, 217, 119, 0.5);
  white-space: pre;
}

.ascii-caption {
  font-family: 'VT323', monospace;
  font-size: 18px;
  color: #A3D977;
  opacity: 0.8;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

/* Message */
.not-found-message {
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 280px;
  line-height: 1.6;
  margin: 0 auto 32px;
}

/* Button Row */
.btn-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
}

/* Green Retro Button */
.green-retro-btn {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  padding: 11px 24px;
  background: #3D5B3E;
  color: #A3D977;
  border: 2px solid #A3D977;
  box-shadow: 3px 3px 0 #A3D977;
  border-radius: 4px;
  cursor: pointer;
  transition: box-shadow 0.1s, transform 0.1s;
}
.green-retro-btn:hover {
  background: #4a6f4b;
}
.green-retro-btn:active {
  box-shadow: 1px 1px 0 #A3D977;
  transform: translate(2px, 2px);
}

/* Ghost Button */
.ghost-btn {
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 15px;
  padding: 11px 24px;
  background: transparent;
  color: #A3D977;
  border: 2px solid #A3D977;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.ghost-btn:hover {
  background: rgba(163, 217, 119, 0.08);
}

/* Footer */
.error-footer {
  font-family: 'VT323', monospace;
  font-size: 14px;
  color: #6B7280;
  letter-spacing: 1px;
  text-shadow: none;
}
</style>
