import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/LoginView.vue'), meta: { guest: true } },
  { path: '/driver', component: () => import('@/views/driver/DriverDashboard.vue'), meta: { requiresAuth: true, role: 'automobilista' } },
  { path: '/driver/station/:id', component: () => import('@/views/driver/StationDetail.vue'), meta: { requiresAuth: true, role: 'automobilista' } },
  { path: '/driver/payment/:sessionId', component: () => import('@/views/driver/PaymentView.vue'), meta: { requiresAuth: true, role: 'automobilista' } },
  { path: '/technician', component: () => import('@/views/technician/TechDashboard.vue'), meta: { requiresAuth: true, role: 'tecnico' } },
  { path: '/technician/ticket/:id', component: () => import('@/views/technician/TicketDetail.vue'), meta: { requiresAuth: true, role: 'tecnico' } },
  { path: '/operator', component: () => import('@/views/operator/OperatorDashboard.vue'), meta: { requiresAuth: true, role: 'operatore' } },
  { path: '/operator/tariffs', component: () => import('@/views/operator/TariffConfig.vue'), meta: { requiresAuth: true } },
  { path: '/operator/tickets', component: () => import('@/views/operator/TicketAssignment.vue'), meta: { requiresAuth: true, role: 'operatore' } },
  { path: '/operator/notifications', component: () => import('@/views/operator/NotificationsView.vue'), meta: { requiresAuth: true, role: 'operatore' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }
  
  if (to.meta.role && authStore.currentUser?.role !== to.meta.role) {
    const role = authStore.currentUser?.role
    if (role === 'automobilista') return next('/driver')
    if (role === 'tecnico') return next('/technician')
    if (role === 'operatore') return next('/operator')
  }
  
  if (to.path === '/login' && authStore.isAuthenticated) {
    const role = authStore.currentUser?.role
    if (role === 'automobilista') return next('/driver')
    if (role === 'tecnico') return next('/technician')
    if (role === 'operatore') return next('/operator')
  }
  
  next()
})

export default router
