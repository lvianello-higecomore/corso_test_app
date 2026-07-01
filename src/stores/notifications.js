import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getInitialNotifications } from '@/data/mockData'
import { useStationStore } from '@/stores/stations'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref(getInitialNotifications())
  const nextId = ref(5)

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read)
  })

  function addNotification(notification) {
    notifications.value.unshift({
      id: nextId.value++,
      ...notification,
      timestamp: new Date(),
      read: false
    })
  }

  function markAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
  }

  function checkOfflineStations() {
    const stationStore = useStationStore()
    const now = Date.now()
    const threshold = 5 * 60 * 1000; // 5 minuti
    
    stationStore.stations.forEach(station => {
      if ((station.status === 'offline' || station.status === 'guasta') && station.offlineSince) {
        if (now - station.offlineSince.getTime() > threshold) {
          // Check if notification already exists
          const existing = notifications.value.find(
            n => n.stationId === station.id && n.type === 'offline' && !n.read
          )
          
          if (!existing) {
            addNotification({
              type: 'offline',
              message: `${station.name} offline/guasta da oltre 5 minuti`,
              stationId: station.id
            })
          }
        }
      }
    })
  }

  return {
    notifications,
    unreadCount,
    unreadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    checkOfflineStations
  }
})
