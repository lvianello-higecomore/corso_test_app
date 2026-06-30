<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStationStore } from '@/stores/stations'
import { useTariffStore } from '@/stores/tariffs'
import { useSessionStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'
import { formatTimeAgo } from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const stationStore = useStationStore()
const tariffStore = useTariffStore()
const sessionStore = useSessionStore()
const authStore = useAuthStore()

const stationId = parseInt(route.params.id)
const station = computed(() => stationStore.getStationById(stationId))

const kwhInput = ref(20)

const estimatedCost = computed(() => {
  if (!station.value) return 0
  return tariffStore.getEstimatedCost(station.value.location, kwhInput.value)
})

const currentTariffSlot = computed(() => {
  if (!station.value) return null
  return tariffStore.getCurrentTariffSlot(station.value.location)
})

const activeSession = computed(() => {
  return sessionStore.activeSessions.find(
    s => s.stationId === stationId && s.userId === authStore.currentUser?.id
  )
})

const startCharging = () => {
  if (station.value && station.value.status === 'disponibile') {
    sessionStore.startSession(stationId, authStore.currentUser.id)
    router.push('/driver')
  }
}

const stopCharging = () => {
  if (activeSession.value) {
    const sessionId = activeSession.value.id
    sessionStore.endSession(sessionId)
    router.push(`/driver/payment/${sessionId}`)
  }
}

const statusBadgeClass = (status) => {
  switch (status) {
    case 'disponibile': return 'badge-success'
    case 'occupata': return 'badge-warning'
    case 'guasta': return 'badge-danger'
    case 'offline': return 'badge-neutral'
    default: return 'badge-neutral'
  }
}
</script>

<template>
  <div v-if="station">
    <router-link to="/driver" class="back-link" data-cy="back-to-stations">
      ← Torna alle colonnine
    </router-link>
    
    <div class="card">
      <div class="detail-header">
        <div>
          <h1 class="page-title mb-1">{{ station.name }}</h1>
          <p class="text-secondary">{{ station.location }} - {{ station.address }}</p>
        </div>
        <div class="text-right">
          <span class="badge mb-1" :class="statusBadgeClass(station.status)">{{ station.status }}</span>
          <div v-if="station.offlineSince" class="text-xs text-danger mt-1">
            Offline da: {{ formatTimeAgo(station.offlineSince) }}
          </div>
        </div>
      </div>
      
      <div class="detail-grid mb-3">
        <div class="detail-item">
          <div class="detail-label">Potenza Massima</div>
          <div class="detail-value">{{ station.power }} kW</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Connettore</div>
          <div class="detail-value">{{ station.connector }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Ultimo Segnale</div>
          <div class="detail-value">{{ formatTimeAgo(station.lastTelemetry) }}</div>
        </div>
        <div class="detail-item" v-if="currentTariffSlot">
          <div class="detail-label">Tariffa Attuale ({{ currentTariffSlot.label }})</div>
          <div class="detail-value">€{{ currentTariffSlot.pricePerKWh.toFixed(2) }} / kW</div>
        </div>
      </div>
      
      <div class="border-t pt-3 mb-3">
        <h3 class="section-title mb-2">Simulatore di Costo</h3>
        <div class="flex gap-2">
          <div class="form-group mb-0 flex-1">
            <label class="form-label" for="kwh">Energia stimata (kW)</label>
            <input type="number" id="kwh" v-model="kwhInput" class="form-input" min="1" max="100" data-cy="kwh-input" />
          </div>
          <div class="form-group mb-0 flex-1">
            <label class="form-label">Costo stimato</label>
            <div class="form-input text-primary font-bold bg-secondary" data-cy="estimated-cost">
              €{{ estimatedCost.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex-center border-t pt-3 mt-2">
        <button v-if="station.status === 'disponibile' && !activeSession" 
                @click="startCharging" 
                class="btn btn-success w-full" 
                data-cy="start-charging-btn">
          Avvia Ricarica
        </button>
        <button v-else-if="activeSession" 
                @click="stopCharging" 
                class="btn btn-danger w-full" 
                data-cy="stop-charging-btn">
          Termina Ricarica
        </button>
        <div v-else-if="station.status === 'occupata'" class="text-warning text-center w-full p-2 bg-warning-light rounded">
          Colonnina occupata da un altro utente
        </div>
        <div v-else class="text-danger text-center w-full p-2 bg-danger-light rounded">
          Colonnina attualmente non disponibile per la ricarica
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-3">
    Caricamento colonnina...
  </div>
</template>

<style scoped>
.border-t { border-top: 1px solid var(--border-color); }
.pt-3 { padding-top: 1.5rem; }
.pb-3 { padding-bottom: 1.5rem; }
.py-3 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.mb-0 { margin-bottom: 0; }
.flex-1 { flex: 1; }
.font-bold { font-weight: 700; }
.bg-secondary { background-color: var(--bg-secondary); }
.text-right { text-align: right; }
.text-danger { color: var(--accent-red); }
.text-warning { color: var(--accent-amber); }
.p-2 { padding: 0.75rem; }
.bg-warning-light { background-color: rgba(245, 158, 11, 0.1); border-radius: var(--radius-sm); border: 1px solid rgba(245, 158, 11, 0.3);}
.bg-danger-light { background-color: rgba(239, 68, 68, 0.1); border-radius: var(--radius-sm); border: 1px solid rgba(239, 68, 68, 0.3);}
.rounded { border-radius: var(--radius-sm); }
</style>
