<template>
  <v-container fluid class="search-page pa-0" style="background:#E9DEEA; min-height:100vh;">
    <div class="search-wrapper">
      <!-- Header -->
      <div class="page-header text-center pa-6 pb-2">
        <div class="brand-label mb-1">CARRYIT</div>
        <h1 class="page-title">Find a Traveler</h1>
        <p class="page-subtitle">Send your package with a trusted traveler</p>
      </div>

      <!-- Search Form Card -->
      <v-card class="retro-card search-card mx-4 mb-4" elevation="0">
        <v-card-text class="pa-5">
          <!-- Origin -->
          <div class="field-label mb-1">FROM</div>
          <v-autocomplete
            v-model="form.origin"
            :items="cities"
            placeholder="Origin city"
            variant="outlined"
            density="comfortable"
            class="retro-input mb-3"
            prepend-inner-icon="mdi-map-marker"
            hide-details
          />

          <!-- Swap button -->
          <div class="text-center my-1">
            <v-btn icon size="small" variant="flat" class="swap-btn" @click="swapCities">
              <v-icon>mdi-swap-vertical</v-icon>
            </v-btn>
          </div>

          <!-- Destination -->
          <div class="field-label mb-1">TO</div>
          <v-autocomplete
            v-model="form.destination"
            :items="cities"
            placeholder="Destination city"
            variant="outlined"
            density="comfortable"
            class="retro-input mb-3"
            prepend-inner-icon="mdi-map-marker-check"
            hide-details
          />

          <!-- Date -->
          <div class="field-label mb-1">DATE</div>
          <v-text-field
            v-model="form.date"
            type="date"
            variant="outlined"
            density="comfortable"
            class="retro-input mb-3"
            prepend-inner-icon="mdi-calendar"
            hide-details
          />

          <!-- Weight Slider -->
          <div class="field-label mb-1">WEIGHT NEEDED</div>
          <div class="weight-display mb-2">
            <span class="lcd-weight">{{ form.weight.toFixed(1) }}</span>
            <span class="lcd-unit">KG</span>
          </div>
          <v-slider
            v-model="form.weight"
            :min="0.5"
            :max="30"
            :step="0.5"
            color="#FF4DA6"
            track-color="#ddd"
            thumb-color="#FF4DA6"
            class="retro-slider mb-2"
            hide-details
          />
          <div class="slider-labels">
            <span>0.5 kg</span>
            <span>30 kg</span>
          </div>

          <!-- Search Button -->
          <v-btn
            block
            size="large"
            class="retro-btn mt-4"
            :loading="loading"
            @click="handleSearch"
          >
            <v-icon left class="mr-2">mdi-magnify</v-icon>
            SEARCH TRIPS
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Popular Routes -->
      <div class="mx-4 mb-4">
        <div class="section-label mb-2">POPULAR ROUTES</div>
        <div class="chips-row">
          <v-chip
            v-for="route in popularRoutes"
            :key="route.label"
            class="retro-chip mr-2 mb-2"
            @click="selectRoute(route)"
          >
            {{ route.label }}
          </v-chip>
        </div>
      </div>

      <!-- Recent Searches -->
      <div v-if="recentSearches.length > 0" class="mx-4 mb-6">
        <div class="section-label mb-2">
          RECENT SEARCHES
          <v-btn variant="text" size="x-small" class="clear-btn ml-2" @click="clearRecent">clear</v-btn>
        </div>
        <div class="chips-row">
          <v-chip
            v-for="(search, i) in recentSearches"
            :key="i"
            class="retro-chip recent-chip mr-2 mb-2"
            @click="loadRecent(search)"
            closable
            @click:close="removeRecent(i)"
          >
            <v-icon start size="12">mdi-history</v-icon>
            {{ search.origin }} → {{ search.destination }}
          </v-chip>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTripsStore } from '@/stores/trips'

const router = useRouter()
const tripsStore = useTripsStore()

const loading = ref(false)

const cities = [
  'Paris', 'Lyon', 'Tunis', 'Madrid', 'London',
  'Barcelona', 'Amsterdam', 'Cairo', 'Marseille', 'Rome'
]

const popularRoutes = [
  { label: 'Paris → Lyon', origin: 'Paris', destination: 'Lyon' },
  { label: 'Tunis → Paris', origin: 'Tunis', destination: 'Paris' },
  { label: 'London → Madrid', origin: 'London', destination: 'Madrid' },
  { label: 'Cairo → Paris', origin: 'Cairo', destination: 'Paris' },
]

const form = ref({
  origin: '',
  destination: '',
  date: '',
  weight: 5,
})

const recentSearches = ref([])

onMounted(() => {
  try {
    const stored = localStorage.getItem('carryit_recent_searches')
    if (stored) recentSearches.value = JSON.parse(stored)
  } catch {}
})

function swapCities() {
  const tmp = form.value.origin
  form.value.origin = form.value.destination
  form.value.destination = tmp
}

function selectRoute(route) {
  form.value.origin = route.origin
  form.value.destination = route.destination
}

function loadRecent(search) {
  form.value.origin = search.origin
  form.value.destination = search.destination
  form.value.date = search.date || ''
  form.value.weight = search.weight || 5
}

function removeRecent(index) {
  recentSearches.value.splice(index, 1)
  saveRecent()
}

function clearRecent() {
  recentSearches.value = []
  localStorage.removeItem('carryit_recent_searches')
}

function saveRecent() {
  const entry = {
    origin: form.value.origin,
    destination: form.value.destination,
    date: form.value.date,
    weight: form.value.weight,
  }
  const existing = recentSearches.value.filter(
    s => !(s.origin === entry.origin && s.destination === entry.destination)
  )
  recentSearches.value = [entry, ...existing].slice(0, 5)
  localStorage.setItem('carryit_recent_searches', JSON.stringify(recentSearches.value))
}

async function handleSearch() {
  if (!form.value.origin || !form.value.destination) return

  loading.value = true
  saveRecent()

  try {
    tripsStore.setSearchParams({
      origin: form.value.origin,
      destination: form.value.destination,
      date: form.value.date,
      weight: form.value.weight,
    })
    await tripsStore.searchTrips()
    router.push('/sender/results')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&family=VT323&display=swap');

.search-page {
  font-family: 'Archivo', sans-serif;
}

.search-wrapper {
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.brand-label {
  font-family: 'VT323', monospace;
  font-size: 14px;
  letter-spacing: 4px;
  color: #FF4DA6;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #0A0A0A;
  line-height: 1.1;
}

.page-subtitle {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
}

.retro-card {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 4px 4px 0 #0A0A0A !important;
  border-radius: 4px !important;
}

.search-card {
  border-radius: 6px !important;
}

.field-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #0A0A0A;
}

.retro-input :deep(.v-field) {
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  font-family: 'Archivo', sans-serif;
  font-weight: 600;
  background: #FAFAF7;
}

.retro-input :deep(.v-field--focused) {
  border-color: #FF4DA6;
  box-shadow: 2px 2px 0 #FF4DA6;
}

.swap-btn {
  background: #FF4DA6 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
  border-radius: 50% !important;
  color: white !important;
}

.weight-display {
  text-align: center;
  background: #141a14;
  border: 2px solid #0A0A0A;
  border-radius: 4px;
  padding: 12px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.lcd-weight {
  font-family: 'VT323', monospace;
  font-size: 52px;
  color: #A3D977;
  line-height: 1;
  text-shadow: 0 0 8px #A3D977;
}

.lcd-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  color: #A3D977;
  opacity: 0.7;
}

.retro-slider :deep(.v-slider-thumb__surface) {
  border: 2px solid #0A0A0A;
  box-shadow: 2px 2px 0 #0A0A0A;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #888;
  margin-top: -4px;
}

.retro-btn {
  background: #FF4DA6 !important;
  color: #0A0A0A !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 3px 3px 0 #0A0A0A !important;
  border-radius: 4px !important;
  font-family: 'Archivo', sans-serif !important;
  font-weight: 900 !important;
  font-size: 15px !important;
  letter-spacing: 1px;
  transition: all 0.1s;
}

.retro-btn:active {
  box-shadow: 1px 1px 0 #0A0A0A !important;
  transform: translate(2px, 2px);
}

.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #0A0A0A;
  display: flex;
  align-items: center;
}

.retro-chip {
  background: #FAFAF7 !important;
  border: 2px solid #0A0A0A !important;
  box-shadow: 2px 2px 0 #0A0A0A !important;
  border-radius: 4px !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  cursor: pointer;
  transition: all 0.1s;
}

.retro-chip:hover {
  background: #FF4DA6 !important;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 #0A0A0A !important;
}

.recent-chip {
  background: #E9DEEA !important;
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
}

.clear-btn {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 10px !important;
  color: #FF4DA6 !important;
  text-decoration: underline;
}
</style>
