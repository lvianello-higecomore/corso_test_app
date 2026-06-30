<script setup>
import { formatTimeAgo, users } from '@/data/mockData'
import { computed } from 'vue'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const priorityClass = computed(() => {
  switch (props.ticket.priority) {
    case 'alta': return 'priority-alta'
    case 'media': return 'priority-media'
    case 'bassa': return 'priority-bassa'
    default: return 'badge-neutral'
  }
})

const statusClass = computed(() => {
  switch (props.ticket.status) {
    case 'aperto': return 'badge-danger'
    case 'assegnato': return 'badge-warning'
    case 'risolto': return 'badge-success'
    case 'assistenza_necessaria': return 'badge-purple'
    case 'falso_allarme': return 'badge-neutral'
    default: return 'badge-neutral'
  }
})

const assignedTechName = computed(() => {
  if (!props.ticket.assignedTo) return null
  const tech = users.find(u => u.id === props.ticket.assignedTo)
  return tech ? tech.name : 'Sconosciuto'
})
</script>

<template>
  <div class="card" @click="$emit('click')" style="cursor: pointer;" :data-cy="`ticket-card-${ticket.id}`">
    <div class="card-header">
      <h3 class="section-title">Ticket #{{ ticket.id }}</h3>
      <span class="badge" :class="priorityClass" :data-cy="`ticket-priority-${ticket.id}`">
        Priorità {{ ticket.priority }}
      </span>
    </div>
    <div class="card-body">
      <p class="text-sm font-medium mb-1">{{ ticket.stationName }} - {{ ticket.locationName }}</p>
      <p class="text-sm text-secondary mb-3 description-truncate">{{ ticket.description }}</p>
      <div class="flex-between mt-2 pt-2 border-t">
        <span class="badge" :class="statusClass" :data-cy="`ticket-status-${ticket.id}`">
          {{ ticket.status.replace('_', ' ') }}
        </span>
        <span class="text-xs text-muted">{{ formatTimeAgo(ticket.createdAt) }}</span>
      </div>
      <div v-if="assignedTechName" class="mt-2 text-xs text-muted text-right">
        Assegnato a: {{ assignedTechName }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-medium { font-weight: 500; }
.description-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.border-t {
  border-top: 1px solid var(--border-color);
}
.pt-2 {
  padding-top: 0.5rem;
}
</style>
