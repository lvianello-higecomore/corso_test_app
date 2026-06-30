<script setup>
import { ref, watch } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()
const toasts = ref([])
let toastId = 0

watch(() => notificationStore.notifications.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    const latestNotification = notificationStore.notifications[0]
    const id = toastId++
    
    toasts.value.push({
      id,
      message: latestNotification.message
    })
    
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 5000)
  }
})
</script>

<template>
  <div class="toast-container">
    <transition-group name="slide">
      <div v-for="toast in toasts" :key="toast.id" class="toast" data-cy="notification-toast">
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 2rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toast {
  position: static;
  animation: none;
}
</style>
