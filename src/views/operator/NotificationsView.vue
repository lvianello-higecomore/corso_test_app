<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notifications'
import { formatTimeAgo } from '@/data/mockData'

const notificationStore = useNotificationStore()

const sortedNotifications = computed(() => {
  return [...notificationStore.notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
})

const getIconForType = (type) => {
  switch (type) {
    case 'guasto': return '🔴'
    case 'offline': return '🔵'
    case 'ticket_update': return '🟢'
    default: return '⚪'
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto" data-cy="notifications-view">
    <div class="flex-between mb-3">
      <div class="flex items-center gap-2">
        <h1 class="page-title">Notifiche di Sistema</h1>
        <span v-if="notificationStore.unreadCount > 0" class="badge badge-danger">
          {{ notificationStore.unreadCount }} nuove
        </span>
      </div>
      <button v-if="notificationStore.unreadCount > 0" 
              @click="notificationStore.markAllAsRead()" 
              class="btn btn-ghost btn-sm"
              data-cy="mark-all-read">
        Segna tutte come lette
      </button>
    </div>
    
    <div class="card p-0 overflow-hidden">
      <div v-if="sortedNotifications.length > 0">
        <div v-for="notification in sortedNotifications" 
             :key="notification.id" 
             class="notification-item flex gap-3 p-3 border-b cursor-pointer transition"
             :class="{ 'unread': !notification.read }"
             @click="notificationStore.markAsRead(notification.id)"
             :data-cy="`notification-item-${notification.id}`">
          
          <div class="notification-icon">
            {{ getIconForType(notification.type) }}
          </div>
          
          <div class="flex-1">
            <div class="flex-between mb-1">
              <span class="font-bold text-sm" :class="{ 'text-primary': !notification.read }">
                {{ notification.type === 'ticket_update' ? 'Aggiornamento Ticket' : 'Allarme Rete' }}
              </span>
              <span class="text-xs text-muted">{{ formatTimeAgo(notification.timestamp) }}</span>
            </div>
            <p class="text-sm" :class="notification.read ? 'text-secondary' : 'text-primary'">
              {{ notification.message }}
            </p>
          </div>
          
          <div v-if="!notification.read" class="flex-center">
            <span class="unread-dot"></span>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-muted p-4">
        Nessuna notifica presente.
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-w-3xl { max-width: 48rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.items-center { align-items: center; }
.p-0 { padding: 0; }
.p-3 { padding: 1.5rem; }
.p-4 { padding: 2rem; }
.overflow-hidden { overflow: hidden; }
.border-b { border-bottom: 1px solid var(--border-color); }
.border-b:last-child { border-bottom: none; }
.cursor-pointer { cursor: pointer; }
.transition { transition: var(--transition); }
.flex-1 { flex: 1; }
.font-bold { font-weight: 700; }
.text-primary { color: var(--text-primary); }
.notification-item:hover { background: var(--bg-card-hover); }
.notification-item.unread { background: rgba(59, 130, 246, 0.05); }
.notification-icon { font-size: 1.5rem; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 50%; }
.unread-dot { width: 8px; height: 8px; background-color: var(--accent-blue); border-radius: 50%; }
</style>
