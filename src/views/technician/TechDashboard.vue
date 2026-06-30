<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTicketStore } from '@/stores/tickets'
import TicketCard from '@/components/TicketCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const ticketStore = useTicketStore()

const currentFilter = ref('tutti')

// Note: ticketStore.sortedByPriority is used implicitly via the array returned, 
// though we filter it to just this technician's tickets
const myTickets = computed(() => {
  if (!authStore.currentUser) return []
  return ticketStore.getTicketsByTechnician(authStore.currentUser.id)
})

const filteredTickets = computed(() => {
  let filtered = myTickets.value
  
  if (currentFilter.value === 'aperti') {
    filtered = myTickets.value.filter(t => t.status === 'aperto' || t.status === 'assegnato')
  } else if (currentFilter.value === 'risolti') {
    filtered = myTickets.value.filter(t => t.status === 'risolto' || t.status === 'falso_allarme' || t.status === 'assistenza_necessaria')
  }
  
  // Apply sorting - bug: sortedByPriority logic from store is recreated here if we want it sorted
  // We'll just sort it identically to the bugged logic: bassa > media > alta
  const priorityMap = { 'alta': 3, 'media': 2, 'bassa': 1 }
  return filtered.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority])
})

const openTicketCount = computed(() => {
  return myTickets.value.filter(t => t.status === 'aperto' || t.status === 'assegnato').length
})

const navigateToTicket = (id) => {
  router.push(`/technician/ticket/${id}`)
}
</script>

<template>
  <div data-cy="tech-dashboard">
    <div class="flex-between mb-3">
      <h1 class="page-title">I Miei Ticket</h1>
      
      <div class="flex gap-1">
        <button @click="currentFilter = 'tutti'" class="btn btn-sm" :class="currentFilter === 'tutti' ? 'btn-primary' : 'btn-ghost'" data-cy="filter-tutti">Tutti</button>
        <button @click="currentFilter = 'aperti'" class="btn btn-sm" :class="currentFilter === 'aperti' ? 'btn-warning' : 'btn-ghost'" data-cy="filter-aperti">Aperti / Assegnati</button>
        <button @click="currentFilter = 'risolti'" class="btn btn-sm" :class="currentFilter === 'risolti' ? 'btn-success' : 'btn-ghost'" data-cy="filter-risolti">Chiusi / Risolti</button>
      </div>
    </div>
    
    <div class="mb-3 text-secondary">
      Hai <strong>{{ openTicketCount }}</strong> ticket attivi in coda. I ticket sono ordinati per priorità.
    </div>

    <div class="grid-3" v-if="filteredTickets.length > 0">
      <TicketCard 
        v-for="ticket in filteredTickets" 
        :key="ticket.id" 
        :ticket="ticket" 
        @click="navigateToTicket(ticket.id)"
      />
    </div>
    <div v-else class="text-center text-muted py-4 card">
      Nessun ticket trovato con i filtri attuali.
    </div>
  </div>
</template>

<style scoped>
.py-4 { padding-top: 2rem; padding-bottom: 2rem; }
</style>
