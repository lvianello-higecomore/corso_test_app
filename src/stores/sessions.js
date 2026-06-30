import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getInitialSessions } from '@/data/mockData'
import { useStationStore } from '@/stores/stations'
import { useTariffStore } from '@/stores/tariffs'

export const useSessionStore = defineStore('sessions', () => {
  const sessions = ref(getInitialSessions())
  const nextId = ref(4)

  const activeSessions = computed(() => {
    return sessions.value.filter(s => s.status === 'in_corso')
  })

  function getSessionsByUser(userId) {
    return sessions.value.filter(s => s.userId === userId)
  }

  function getSessionById(id) {
    return sessions.value.find(s => s.id === parseInt(id))
  }

  function startSession(stationId, userId) {
    const stationStore = useStationStore()
    const tariffStore = useTariffStore()
    
    const station = stationStore.getStationById(stationId)
    if (!station) return null

    const currentTariffSlot = tariffStore.getCurrentTariffSlot(station.location)
    
    const newSession = {
      id: nextId.value++,
      stationId: station.id,
      stationName: station.name,
      userId: userId,
      startTime: new Date(),
      endTime: null,
      kWh: 0,
      tariffAtStart: currentTariffSlot ? { pricePerKWh: currentTariffSlot.pricePerKWh, label: currentTariffSlot.label } : { pricePerKWh: 0.5, label: 'Standard' },
      totalCost: 0,
      paid: false,
      paymentMethod: null,
      status: 'in_corso'
    }
    
    sessions.value.push(newSession)
    stationStore.updateStationStatus(stationId, 'occupata')
    
    return newSession
  }

  function endSession(sessionId) {
    const session = getSessionById(sessionId)
    if (session) {
      session.endTime = new Date()
      session.status = 'completata'
      session.kWh = Math.floor(Math.random() * 41) + 10 // 10-50 kWh
      session.totalCost = Number((session.kWh * session.tariffAtStart.pricePerKWh).toFixed(2))
      
      const stationStore = useStationStore()
      stationStore.updateStationStatus(session.stationId, 'disponibile')
    }
  }

  function processPayment(sessionId, paymentMethod) {
    const session = getSessionById(sessionId)
    if (session) {
      session.paid = true
      session.paymentMethod = paymentMethod
      return true
    }
    return false
  }

  return {
    sessions,
    activeSessions,
    getSessionsByUser,
    getSessionById,
    startSession,
    endSession,
    processPayment
  }
})
