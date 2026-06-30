import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getInitialTariffs } from '@/data/mockData'
import { useSessionStore } from '@/stores/sessions'

export const useTariffStore = defineStore('tariffs', () => {
  const tariffs = ref(getInitialTariffs())

  function getTariffByLocation(locationName) {
    return tariffs.value.find(t => t.locationName === locationName)
  }

  function getCurrentTariffSlot(locationName) {
    const tariff = getTariffByLocation(locationName)
    if (!tariff) return null

    const currentHour = new Date().getHours()
    
    // Intentionally using <= instead of < which creates an overlap bug at the boundary hour
    for (const slot of tariff.timeSlots) {
      if (slot.startHour < slot.endHour) {
        if (currentHour >= slot.startHour && currentHour <= slot.endHour) {
          return slot
        }
      } else {
        // Handle overnight slots (e.g., 22-07)
        if (currentHour >= slot.startHour || currentHour <= slot.endHour) {
          return slot
        }
      }
    }
    
    return tariff.timeSlots[0] // fallback
  }

  function getEstimatedCost(locationName, kWh) {
    const slot = getCurrentTariffSlot(locationName)
    if (!slot) return 0
    return Number((kWh * slot.pricePerKWh).toFixed(2))
  }

  function updateTariff(tariffId, newTimeSlots) {
    const tariff = tariffs.value.find(t => t.id === tariffId)
    if (tariff) {
      tariff.timeSlots = newTimeSlots
      
      // Intentionally buggy behavior: updating total cost for ALL sessions including completed ones
      const sessionStore = useSessionStore()
      sessionStore.sessions.forEach(session => {
        if (session.stationName && session.stationName) {
            // Find if this session's station belongs to this tariff's location
            // Actually it's complex to get location from session. We'll just recalculate using the new tariff
            // if we somehow match it. We'll simulate the bug by updating all sessions.
            if (session.totalCost > 0) {
               session.totalCost = Number((session.kWh * newTimeSlots[0].pricePerKWh).toFixed(2))
            }
        }
      })
    }
  }

  return {
    tariffs,
    getTariffByLocation,
    getCurrentTariffSlot,
    getEstimatedCost,
    updateTariff
  }
})
