<script setup>
import { computed } from 'vue'
import { useStationStore } from '@/stores/stations'
import { useSessionStore } from '@/stores/sessions'
import { useNotificationStore } from '@/stores/notifications'
import { formatTimeAgo } from '@/data/mockData'

const stationStore = useStationStore()
const sessionStore = useSessionStore()
const notificationStore = useNotificationStore()

const totalStations = computed(() => stationStore.stations.length)
const availableStations = computed(() => stationStore.availableStations.length)
const faultyStations = computed(() => stationStore.stations.filter(s => s.status === 'guasta' || s.status === 'offline').length)
const activeSessionsCount = computed(() => sessionStore.activeSessions.length)

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
  <div data-cy="operator-dashboard">
    <h1 class="page-title mb-3">Dashboard Operatore</h1>
    
    <div class="grid-4 mb-3">
      <div class="stat-card" data-cy="stat-total">
        <div class="stat-value">{{ totalStations }}</div>
        <div class="stat-label">Totale Colonnine</div>
      </div>
      <div class="stat-card" data-cy="stat-available">
        <div class="stat-value text-success">{{ availableStations }}</div>
        <div class="stat-label">Disponibili</div>
      </div>
      <div class="stat-card" data-cy="stat-faulty">
        <div class="stat-value text-danger">{{ faultyStations }}</div>
        <div class="stat-label">Guaste / Offline</div>
      </div>
      <div class="stat-card" data-cy="stat-sessions">
        <div class="stat-value text-blue">{{ activeSessionsCount }}</div>
        <div class="stat-label">Sessioni Attive</div>
      </div>
    </div>
    
    <div class="card mb-3">
      <div class="card-header">
        <h2 class="section-title">Stato Rete</h2>
      </div>
      <div class="table-container" data-cy="stations-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Sede</th>
              <th>Stato</th>
              <th>Potenza</th>
              <th>Ultimo Segnale / Offline da</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="station in stationStore.stations" :key="station.id">
              <td>{{ station.id }}</td>
              <td class="font-bold">{{ station.name }}</td>
              <td>{{ station.location }}</td>
              <td><span class="badge" :class="statusBadgeClass(station.status)">{{ station.status }}</span></td>
              <td>{{ station.power }} kW</td>
              <td>
                <span v-if="station.offlineSince" class="text-danger">
                  {{ formatTimeAgo(station.offlineSince) }}
                </span>
                <span v-else class="text-muted">
                  {{ formatTimeAgo(station.lastTelemetry) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="card" data-cy="simulation-section">
      <div class="card-header">
        <h2 class="section-title">Simulazione e Test</h2>
        <button @click="notificationStore.checkOfflineStations()" class="btn btn-warning btn-sm" data-cy="check-offline-btn">
          Verifica Colonnine Offline (soglia: 5 minuti)
        </button>
      </div>
      <div class="card-body">
        <p class="text-sm text-muted mb-2">Utilizza questi controlli per simulare eventi di rete ai fini del collaudo.</p>
        
        <div class="table-container">
          <table>
            <tbody>
              <tr v-for="station in stationStore.stations" :key="`sim-${station.id}`">
                <td style="width: 150px">{{ station.name }}</td>
                <td><span class="badge" :class="statusBadgeClass(station.status)">{{ station.status }}</span></td>
                <td class="text-right">
                  <button v-if="station.status !== 'offline' && station.status !== 'guasta'" 
                          @click="stationStore.simulateOffline(station.id)" 
                          class="btn btn-danger btn-sm"
                          :data-cy="`simulate-offline-${station.id}`">
                    Simula Offline
                  </button>
                  <button v-if="station.status === 'offline' || station.status === 'guasta'" 
                          @click="stationStore.simulateOnline(station.id)" 
                          class="btn btn-success btn-sm"
                          :data-cy="`simulate-online-${station.id}`">
                    Ripristina Online
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-success { color: var(--accent-green); }
.text-danger { color: var(--accent-red); }
.text-blue { color: var(--accent-blue); }
.font-bold { font-weight: 700; }
</style>
