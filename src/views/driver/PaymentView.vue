<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/stores/sessions'
import { formatTimeAgo } from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()

const sessionId = parseInt(route.params.sessionId)
const session = computed(() => sessionStore.getSessionById(sessionId))

const paymentMethods = ['Mastercard', 'Visa', 'PayPal', 'Klarna', 'Satispay', 'SumUp']
const selectedMethod = ref(null)
const paymentSuccess = ref(false)

const duration = computed(() => {
  if (!session.value || !session.value.endTime) return 'Sconosciuta'
  const diffMinutes = Math.floor((session.value.endTime.getTime() - session.value.startTime.getTime()) / 60000)
  return `${diffMinutes} minuti`
})

const handlePayment = () => {
  if (selectedMethod.value) {
    const success = sessionStore.processPayment(sessionId, selectedMethod.value)
    if (success) {
      paymentSuccess.value = true
      setTimeout(() => {
        router.push('/driver')
      }, 3000)
    }
  }
}
</script>

<template>
  <div v-if="session">
    <router-link to="/driver" class="back-link">
      ← Torna alle colonnine
    </router-link>

    <div v-if="paymentSuccess" class="card text-center py-4" data-cy="payment-success">
      <div class="success-icon mb-2">✅</div>
      <h2 class="page-title mb-2 text-success">Pagamento Completato</h2>
      <p class="text-secondary">Grazie per aver utilizzato ChargeGrid.</p>
      <p class="text-sm text-muted mt-2">Verrai reindirizzato alla dashboard...</p>
    </div>

    <div v-else class="card max-w-md mx-auto">
      <h1 class="page-title text-center mb-3">Riepilogo Ricarica</h1>
      
      <div class="bg-secondary p-3 rounded mb-3">
        <div class="flex-between mb-2">
          <span class="text-secondary">Colonnina</span>
          <span class="font-bold">{{ session.stationName }}</span>
        </div>
        <div class="flex-between mb-2">
          <span class="text-secondary">Durata</span>
          <span>{{ duration }}</span>
        </div>
        <div class="flex-between mb-2">
          <span class="text-secondary">Energia erogata</span>
          <span>{{ session.kWh }} kW</span>
        </div>
        <div class="flex-between border-t pt-2 mt-2" data-cy="payment-total">
          <span class="text-lg font-bold">Totale da pagare</span>
          <span class="text-xl font-bold text-primary">€{{ session.totalCost.toFixed(2) }}</span>
        </div>
      </div>

      <h3 class="section-title mb-2">Scegli metodo di pagamento</h3>
      <div class="payment-grid mb-3" data-cy="payment-methods">
        <div 
          v-for="method in paymentMethods" 
          :key="method"
          class="payment-method"
          :class="{ 'selected': selectedMethod === method }"
          @click="selectedMethod = method"
          :data-cy="`payment-method-${method.toLowerCase()}`"
        >
          {{ method }}
        </div>
      </div>

      <button 
        @click="handlePayment" 
        class="btn btn-success w-full text-lg py-2" 
        :disabled="!selectedMethod"
        data-cy="pay-btn"
      >
        Paga Ora (€{{ session.totalCost.toFixed(2) }})
      </button>
    </div>
  </div>
  <div v-else class="text-center py-3">
    Caricamento sessione...
  </div>
</template>

<style scoped>
.max-w-md { max-width: 32rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.bg-secondary { background-color: var(--bg-secondary); }
.p-3 { padding: 1.5rem; }
.py-4 { padding-top: 2rem; padding-bottom: 2rem; }
.rounded { border-radius: var(--radius-md); }
.font-bold { font-weight: 700; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.5rem; }
.text-primary { color: var(--accent-blue); }
.text-success { color: var(--accent-green); }
.border-t { border-top: 1px solid var(--border-color); }
.pt-2 { padding-top: 1rem; }
.mt-2 { margin-top: 1rem; }
.py-2 { padding-top: 1rem; padding-bottom: 1rem; }
.success-icon { font-size: 4rem; }
</style>
