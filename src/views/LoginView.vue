<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (!username.value || !password.value) {
    authStore.loginError = 'Inserisci sia nome utente che password'
    return
  }
  
  const success = authStore.login(username.value, password.value)
  if (success) {
    const role = authStore.currentUser.role
    if (role === 'automobilista') router.push('/driver')
    else if (role === 'tecnico') router.push('/technician')
    else if (role === 'operatore') router.push('/operator')
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">
        <h1 class="page-title mb-1">⚡ ChargeGrid</h1>
        <p class="text-secondary">Accedi alla piattaforma</p>
      </div>
      
      <div v-if="authStore.loginError" class="login-error" data-cy="login-error">
        {{ authStore.loginError }}
      </div>
      
      <form @submit.prevent="handleLogin" data-cy="login-form">
        <div class="form-group">
          <label class="form-label" for="username">Nome utente</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            class="form-input" 
            data-cy="login-username"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="form-input" 
            data-cy="login-password"
          />
        </div>
        
        <button type="submit" class="btn btn-primary w-full mt-2" data-cy="login-submit">
          Accedi
        </button>
      </form>
    </div>
  </div>
</template>
