<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useStationStore } from '@/stores/stations'
import { useSessionStore } from '@/stores/sessions'
import StationCard from '@/components/StationCard.vue'
import { formatDateTime } from '@/data/mockData'

const router = useRouter()
const authStore = useAuthStore()
const stationStore = useStationStore()
const sessionStore = useSessionStore()

const currentFilter = ref('tutte')

const filteredStationsByLocation = computed(() => {
  const result = {}
  
  for (const [location, stations] of Object.entries(stationStore.stationsByLocation)) {
    let filtered = stations
    if (currentFilter.value === 'disponibili') {
      filtered = stations.filter(s => s.status === 'disponibile')
    } else if (currentFilter.value === 'occupate') {
      filtered = stations.filter(s => s.status === 'occupata')
    } else if (currentFilter.value === 'guaste') {
      filtered = stations.filter(s => s.status === 'guasta' || s.status === 'offline')
    }
    
    if (filtered.length > 0) {
      result[location] = filtered
    }
  }
  
  return result
})

const myActiveSessions = computed(() => {
  return sessionStore.getSessionsByUser(authStore.currentUser?.id).filter(s => s.status === 'in_corso')
})

const myPastSessions = computed(() => {
  return sessionStore.getSessionsByUser(authStore.currentUser?.id).filter(s => s.status === 'completata')
})

const navigateToStation = (id) => {
  router.push(`/driver/station/${id}`)
}
</script>

<template>
  <div data-cy="driver-dashboard">
    <div class="flex-between mb-3">
      <h1 class="page-title">Colonnine di Ricarica</h1>
      
      <div class="flex gap-1">
        <button @click="currentFilter = 'tutte'" class="btn btn-sm" :class="currentFilter === 'tutte' ? 'btn-primary' : 'btn-ghost'" data-cy="filter-tutte">Tutte</button>
        <button @click="currentFilter = 'disponibili'" class="btn btn-sm" :class="currentFilter === 'disponibili' ? 'btn-success' : 'btn-ghost'" data-cy="filter-disponibili">Disponibili</button>
        <button @click="currentFilter = 'occupate'" class="btn btn-sm" :class="currentFilter === 'occupate' ? 'btn-warning' : 'btn-ghost'" data-cy="filter-occupate">Occupate</button>
        <button @click="currentFilter = 'guaste'" class="btn btn-sm" :class="currentFilter === 'guaste' ? 'btn-danger' : 'btn-ghost'" data-cy="filter-guaste">Guaste/Offline</button>
      </div>
    </div>
    
    <div v-if="myActiveSessions.length > 0" class="mb-3">
      <div v-for="session in myActiveSessions" :key="session.id" class="card" style="border-color: var(--accent-blue);">
        <div class="flex-between">
          <div>
            <h3 class="section-title text-blue mb-1">Ricarica in corso su {{ session.stationName }}</h3>
            <p class="text-sm text-secondary">Iniziata: {{ formatDateTime(session.startTime) }}</p>
          </div>
          <router-link :to="`/driver/station/${session.stationId}`" class="btn btn-primary">
            Gestisci
          </router-link>
        </div>
      </div>
    </div>
    
    <div data-cy="station-list">
      <div v-for="(stations, location) in filteredStationsByLocation" :key="location" class="mb-3">
        <h2 class="section-title mb-2">{{ location }}</h2>
        <div class="grid-4">
          <StationCard 
            v-for="station in stations" 
            :key="station.id" 
            :station="station" 
            @click="navigateToStation(station.id)"
          />
        </div>
      </div>
      
      <div v-if="Object.keys(filteredStationsByLocation).length === 0" class="text-center text-muted mt-3 py-3">
        Nessuna colonnina trovata per questo filtro.
      </div>
    </div>
    
    <div class="mt-3 pt-3 border-t">
      <h2 class="section-title mb-2">Cronologia Ricariche</h2>
      <div class="table-container" data-cy="session-history">
        <table>
          <thead>
            <tr>
              <th>Colonnina</th>
              <th>Data</th>
              <th>Energia</th>
              <th>Costo</th>
              <th>Stato / Pagamento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in myPastSessions" :key="session.id">
              <td>{{ session.stationName }}</td>
              <td>{{ formatDateTime(session.startTime) }}</td>
              <td>{{ session.kWh }} kW</td>
              <td>€{{ session.totalCost.toFixed(2) }}</td>
              <td>
                <span class="badge badge-success mb-1">Completata</span>
                <div class="text-xs text-muted" v-if="session.paid">Pagato con {{ session.paymentMethod || 'Metodo non registrato' }}</div>
                <div class="text-xs text-danger" v-else>Non pagato</div>
              </td>
            </tr>
            <tr v-if="myPastSessions.length === 0">
              <td colspan="5" class="text-center">Nessuna ricarica passata</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-blue { color: var(--accent-blue); }
.border-t { border-top: 1px solid var(--border-color); }
.pt-3 { padding-top: 1.5rem; }
.py-3 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.text-danger { color: var(--accent-red); }
</style>
