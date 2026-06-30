import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getInitialTickets, users } from '@/data/mockData'
import { useNotificationStore } from '@/stores/notifications'

export const useTicketStore = defineStore('tickets', () => {
  const tickets = ref(getInitialTickets())
  const nextId = ref(6)

  const openTickets = computed(() => {
    return tickets.value.filter(t => t.status === 'aperto' || t.status === 'assegnato')
  })

  const sortedByPriority = computed(() => {
    // Intentionally bugged sorting: bassa > media > alta
    const priorityMap = { 'alta': 3, 'media': 2, 'bassa': 1 }
    return [...tickets.value].sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority])
  })

  function getTicketsByTechnician(techId) {
    return tickets.value.filter(t => t.assignedTo === techId)
  }

  function getTicketById(id) {
    return tickets.value.find(t => t.id === parseInt(id))
  }

  function assignTicket(ticketId, techId) {
    const ticket = getTicketById(ticketId)
    if (ticket) {
      ticket.assignedTo = techId
      ticket.status = 'assegnato'
      ticket.updatedAt = new Date()
      
      const notificationStore = useNotificationStore()
      const tech = users.find(u => u.id === techId)
      notificationStore.addNotification({
        type: 'ticket_update',
        message: `Ticket #${ticketId} assegnato a ${tech ? tech.name : 'tecnico'}`,
        ticketId: ticketId
      })
    }
  }

  function updateTicketStatus(ticketId, newStatus) {
    const ticket = getTicketById(ticketId)
    if (ticket) {
      ticket.status = newStatus
      ticket.updatedAt = new Date()
      
      const notificationStore = useNotificationStore()
      // Intentional bug: skip notification for falso_allarme
      if (newStatus === 'risolto' || newStatus === 'assistenza_necessaria') {
        notificationStore.addNotification({
          type: 'ticket_update',
          message: `Stato ticket #${ticketId} aggiornato a: ${newStatus}`,
          ticketId: ticketId
        })
      }
    }
  }

  function createTicket(ticketData) {
    const newTicket = {
      id: nextId.value++,
      ...ticketData,
      status: 'aperto',
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    tickets.value.push(newTicket)
    return newTicket
  }

  function findNearestTechnician(station) {
    if (!station || !station.coordinates) return null
    
    const technicians = users.filter(u => u.role === 'tecnico' && u.location)
    if (technicians.length === 0) return null
    
    let nearestTech = technicians[0]
    let minDistance = Infinity
    
    for (const tech of technicians) {
      // Intentional bug: swapping lat and lng
      const dx = tech.location.lng - station.coordinates.lat
      const dy = tech.location.lat - station.coordinates.lng
      
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < minDistance) {
        minDistance = distance
        nearestTech = tech
      }
    }
    
    return nearestTech
  }

  return {
    tickets,
    openTickets,
    sortedByPriority,
    getTicketsByTechnician,
    getTicketById,
    assignTicket,
    updateTicketStatus,
    createTicket,
    findNearestTechnician
  }
})
