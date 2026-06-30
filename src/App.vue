<script setup>
import AppHeader from '@/components/AppHeader.vue'
import NotificationBanner from '@/components/NotificationBanner.vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div class="app-container">
    <AppHeader v-if="authStore.isAuthenticated" />
    <NotificationBanner />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>
