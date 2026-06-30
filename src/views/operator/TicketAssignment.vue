<script setup>
import { ref, computed } from 'vue'
import { useTicketStore } from '@/stores/tickets'
import { useStationStore } from '@/stores/stations'
import { users, formatTimeAgo, formatDateTime } from '@/data/mockData'

const ticketStore = useTicketStore()
const stationStore = useStationStore()

const suggestedTechs = ref({})

const openTickets = computed(() => {
  return ticketStore.tickets.filter(t => t.status === 'aperto')
})

const priorityClass = (priority) => {
  switch (priority) {
    case 'alta': return 'priority-alta'
    case 'media': return 'priority-media'
    case 'bassa': return 'priority-bassa'
    default: return 'badge-neutral'
  }
}

const statusClass = (status) => {
  switch (status) {
    case 'aperto': return 'badge-danger'
    case 'assegnato': return 'badge-warning'
    case 'risolto': return 'badge-success'
    case 'assistenza_necessaria': return 'badge-purple'
    case 'falso_allarme': return 'badge-neutral'
    default: return 'badge-neutral'
  }
}

const techName = (id) => {
  if (!id) return 'Nessuno'
  const tech = users.find(u => u.id === id)
  return tech ? tech.name : 'Sconosciuto'
}

const findNearest = (ticketId, stationId) => {
  const station = stationStore.getStationById(stationId)
  if (station) {
    const tech = ticketStore.findNearestTechnician(station)
    if (tech) {
      suggestedTechs.value[ticketId] = tech
    }
  }
}

const assignTicket = (ticketId) => {
  if (suggestedTechs.value[ticketId]) {
    ticketStore.assignTicket(ticketId, suggestedTechs.value[ticketId].id)
    delete suggestedTechs.value[ticketId]
  }
}
</script>

<template>
  <div data-cy="ticket-assignment">
    <h1 class="page-title mb-3">Gestione Ticket</h1>
    
    <div class="mb-3" data-cy="open-tickets">
      <h2 class="section-title mb-2">Ticket da Assegnare ({{ openTickets.length }})</h2>
      
      <div v-if="openTickets.length > 0" class="grid-2">
        <div v-for="ticket in openTickets" :key="ticket.id" class="card">
          <div class="card-header">
            <div>
              <h3 class="font-bold">Ticket #{{ ticket.id }}</h3>
              <div class="text-sm text-secondary">{{ ticket.stationName }} - {{ ticket.locationName }}</div>
            </div>
            <span class="badge" :class="priorityClass(ticket.priority)">Priorità {{ ticket.priority }}</span>
          </div>
          <div class="card-body mb-2 text-sm">
            <p class="mb-1"><strong>Descrizione:</strong> {{ ticket.description }}</p>
            <p><strong>Creato:</strong> {{ formatTimeAgo(ticket.createdAt) }}</p>
          </div>
          
          <div class="border-t pt-2 mt-2">
            <div v-if="suggestedTechs[ticket.id]" class="bg-secondary p-2 rounded flex-between mb-2">
              <div>
                <div class="text-xs text-muted mb-1">Tecnico suggerito (più vicino)</div>
                <div class="font-bold">{{ suggestedTechs[ticket.id].name }}</div>
              </div>
              <button @click="assignTicket(ticket.id)" class="btn btn-success btn-sm" :data-cy="`assign-ticket-${ticket.id}`">
                Assegna
              </button>
            </div>
            <button v-else @click="findNearest(ticket.id, ticket.stationId)" class="btn btn-primary w-full" :data-cy="`find-nearest-${ticket.id}`">
              Trova Tecnico Più Vicino
            </button>
          </div>
        </div>
      </div>
      <div v-else class="card text-center text-muted p-4">
        Nessun ticket in attesa di assegnazione.
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h2 class="section-title">Tutti i Ticket</h2>
      </div>
      <div class="table-container" data-cy="all-tickets-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Colonnina</th>
              <th>Priorità</th>
              <th>Stato</th>
              <th>Assegnato a</th>
              <th>Apertura</th>
              <th>Aggiornamento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in ticketStore.sortedByPriority" :key="`all-${ticket.id}`">
              <td class="font-bold">#{{ ticket.id }}</td>
              <td>
                <div>{{ ticket.stationName }}</div>
                <div class="text-xs text-muted">{{ ticket.locationName }}</div>
              </td>
              <td><span class="badge" :class="priorityClass(ticket.priority)">{{ ticket.priority }}</span></td>
              <td><span class="badge" :class="statusClass(ticket.status)">{{ ticket.status.replace('_', ' ') }}</span></td>
              <td>{{ techName(ticket.assignedTo) }}</td>
              <td class="text-xs">{{ formatDateTime(ticket.createdAt) }}</td>
              <td class="text-xs">{{ formatTimeAgo(ticket.updatedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-bold { font-weight: 700; }
.border-t { border-top: 1px solid var(--border-color); }
.pt-2 { padding-top: 0.75rem; }
.mt-2 { margin-top: 0.75rem; }
.bg-secondary { background-color: var(--bg-secondary); }
.p-2 { padding: 0.75rem; }
.p-4 { padding: 2rem; }
.rounded { border-radius: var(--radius-sm); }
</style>
