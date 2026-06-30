<script setup>
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="app-logo" data-cy="header-logo">⚡ ChargeGrid</div>
    <nav class="header-nav">
      <template v-if="authStore.currentUser?.role === 'automobilista'">
        <router-link to="/driver" class="nav-link" data-cy="nav-colonnine">Colonnine</router-link>
      </template>
      <template v-if="authStore.currentUser?.role === 'tecnico'">
        <router-link to="/technician" class="nav-link" data-cy="nav-ticket">I Miei Ticket</router-link>
      </template>
      <template v-if="authStore.currentUser?.role === 'operatore'">
        <router-link to="/operator" class="nav-link" data-cy="nav-dashboard">Dashboard</router-link>
        <router-link to="/operator/tariffs" class="nav-link" data-cy="nav-tariffe">Tariffe</router-link>
        <router-link to="/operator/tickets" class="nav-link" data-cy="nav-ticket">Ticket</router-link>
        <router-link to="/operator/notifications" class="nav-link" data-cy="nav-notifiche">Notifiche</router-link>
      </template>
    </nav>
    <div class="header-nav">
      <template v-if="authStore.currentUser?.role === 'operatore'">
        <router-link to="/operator/notifications" class="notification-bell" data-cy="notification-bell">
          🔔
          <span v-if="notificationStore.unreadCount > 0" class="notification-count">{{ notificationStore.unreadCount }}</span>
        </router-link>
      </template>
      <div class="flex-center gap-2">
        <span class="text-sm text-secondary" data-cy="user-name">
          {{ authStore.currentUser?.name }} 
          <span class="badge badge-neutral ml-1">{{ authStore.currentUser?.role }}</span>
        </span>
        <button @click="logout" class="btn btn-ghost btn-sm" data-cy="logout-btn">Esci</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.ml-1 { margin-left: 0.5rem; }
</style>
