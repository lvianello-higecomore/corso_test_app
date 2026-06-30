<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTicketStore } from '@/stores/tickets'
import { formatDateTime, formatTimeAgo } from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const ticketStore = useTicketStore()

const ticketId = parseInt(route.params.id)
const ticket = computed(() => ticketStore.getTicketById(ticketId))

const newStatus = ref('risolto')
const updateSuccess = ref(false)

const priorityClass = computed(() => {
  if (!ticket.value) return ''
  switch (ticket.value.priority) {
    case 'alta': return 'priority-alta'
    case 'media': return 'priority-media'
    case 'bassa': return 'priority-bassa'
    default: return 'badge-neutral'
  }
})

const statusClass = computed(() => {
  if (!ticket.value) return ''
  switch (ticket.value.status) {
    case 'aperto': return 'badge-danger'
    case 'assegnato': return 'badge-warning'
    case 'risolto': return 'badge-success'
    case 'assistenza_necessaria': return 'badge-purple'
    case 'falso_allarme': return 'badge-neutral'
    default: return 'badge-neutral'
  }
})

const handleUpdateStatus = () => {
  ticketStore.updateTicketStatus(ticketId, newStatus.value)
  updateSuccess.value = true
  setTimeout(() => {
    updateSuccess.value = false
  }, 3000)
}
</script>

<template>
  <div v-if="ticket">
    <router-link to="/technician" class="back-link">
      ← Torna ai miei ticket
    </router-link>

    <div class="card max-w-lg mx-auto">
      <div class="detail-header mb-2">
        <div>
          <h1 class="page-title mb-1">Ticket #{{ ticket.id }}</h1>
          <p class="text-secondary">{{ ticket.stationName }} - {{ ticket.locationName }}</p>
        </div>
        <div class="text-right">
          <span class="badge mb-1" :class="priorityClass">Priorità {{ ticket.priority }}</span><br>
          <span class="badge" :class="statusClass">{{ ticket.status.replace('_', ' ') }}</span>
        </div>
      </div>
      
      <div class="bg-secondary p-3 rounded mb-3">
        <h3 class="text-sm text-muted uppercase tracking-wide mb-1">Descrizione Problema</h3>
        <p class="text-primary">{{ ticket.description }}</p>
      </div>
      
      <div class="detail-grid mb-3">
        <div class="detail-item">
          <div class="detail-label">Aperto il</div>
          <div class="detail-value">{{ formatDateTime(ticket.createdAt) }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Tempo trascorso</div>
          <div class="detail-value">{{ formatTimeAgo(ticket.createdAt) }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Ultimo aggiornamento</div>
          <div class="detail-value">{{ formatDateTime(ticket.updatedAt) }}</div>
        </div>
      </div>

      <div class="border-t pt-3" data-cy="status-change-section">
        <h3 class="section-title mb-2">Aggiorna Stato Intervento</h3>
        
        <div v-if="updateSuccess" class="bg-success-light text-success p-2 rounded mb-2 text-sm text-center">
          Stato aggiornato con successo!
        </div>

        <div class="flex gap-2 items-end">
          <div class="form-group mb-0 flex-1">
            <label class="form-label" for="status">Nuovo Stato</label>
            <select id="status" v-model="newStatus" class="form-select" data-cy="status-select">
              <option value="risolto">Risolto</option>
              <option value="assistenza_necessaria">Assistenza Necessaria (2° livello)</option>
              <option value="falso_allarme">Falso Allarme</option>
            </select>
          </div>
          <button @click="handleUpdateStatus" class="btn btn-primary" data-cy="update-status-btn">
            Aggiorna Stato
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-3">
    Caricamento ticket...
  </div>
</template>

<style scoped>
.max-w-lg { max-width: 48rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.bg-secondary { background-color: var(--bg-secondary); }
.p-3 { padding: 1.5rem; }
.p-2 { padding: 0.75rem; }
.rounded { border-radius: var(--radius-md); }
.uppercase { text-transform: uppercase; }
.tracking-wide { letter-spacing: 0.05em; }
.text-right { text-align: right; }
.border-t { border-top: 1px solid var(--border-color); }
.pt-3 { padding-top: 1.5rem; }
.items-end { align-items: flex-end; }
.flex-1 { flex: 1; }
.mb-0 { margin-bottom: 0; }
.bg-success-light { background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); }
.text-success { color: var(--accent-green); }
</style>
