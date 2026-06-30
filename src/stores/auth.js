import { defineStore } from 'pinia'
import { ref } from 'vue'
import { users } from '@/data/mockData'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  const loginError = ref('')

  function login(username, password) {
    const user = users.find(u => u.username === username)
    
    if (user && user.password.trim() === password) {
      currentUser.value = user
      isAuthenticated.value = true
      loginError.value = ''
      return true
    } else {
      loginError.value = 'Credenziali non valide'
      return false
    }
  }

  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
    loginError.value = ''
  }

  return {
    currentUser,
    isAuthenticated,
    loginError,
    login,
    logout
  }
})
