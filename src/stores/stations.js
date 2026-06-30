import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getInitialStations } from '@/data/mockData'

export const useStationStore = defineStore('stations', () => {
  const stations = ref(getInitialStations())

  const availableStations = computed(() => {
    return stations.value.filter(s => s.status === 'disponibile')
  })

  const stationsByLocation = computed(() => {
    return stations.value.reduce((acc, station) => {
      if (!acc[station.location]) {
        acc[station.location] = []
      }
      acc[station.location].push(station)
      return acc
    }, {})
  })

  function getStationById(id) {
    return stations.value.find(s => s.id === parseInt(id))
  }

  function updateStationStatus(id, newStatus) {
    const station = getStationById(id)
    if (station) {
      station.status = newStatus
      if (newStatus === 'guasta' || newStatus === 'offline') {
        station.offlineSince = new Date()
      } else if (newStatus === 'disponibile' || newStatus === 'occupata') {
        station.offlineSince = null
        station.lastTelemetry = new Date()
      }
    }
  }

  function simulateOffline(id) {
    const station = getStationById(id)
    if (station) {
      station.status = 'offline'
      station.offlineSince = new Date()
    }
  }

  function simulateOnline(id) {
    const station = getStationById(id)
    if (station) {
      station.status = 'disponibile'
      station.offlineSince = null
      station.lastTelemetry = new Date()
    }
  }

  return {
    stations,
    availableStations,
    stationsByLocation,
    getStationById,
    updateStationStatus,
    simulateOffline,
    simulateOnline
  }
})
