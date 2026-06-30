<script setup>
import { formatTimeAgo } from '@/data/mockData'

const props = defineProps({
  station: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const statusBadgeClass = (status) => {
  switch (status) {
    case 'disponibile': return 'badge-success'
    case 'occupata': return 'badge-warning'
    case 'guasta': return 'badge-danger'
    case 'offline': return 'badge-neutral'
    default: return 'badge-neutral'
  }
}
</script>

<template>
  <div class="card" @click="$emit('click')" style="cursor: pointer;" :data-cy="`station-card-${station.id}`">
    <div class="card-header">
      <div class="flex-center gap-1">
        <span class="status-dot" :class="station.status"></span>
        <h3 class="section-title">{{ station.name }}</h3>
      </div>
      <span class="badge" :class="statusBadgeClass(station.status)" :data-cy="`station-status-${station.id}`">
        {{ station.status }}
      </span>
    </div>
    <div class="card-body">
      <p class="text-sm mb-1">{{ station.location }}</p>
      <p class="text-xs text-muted mb-2">{{ station.address }}</p>
      <div class="flex-between mt-2">
        <span class="text-sm font-medium">{{ station.power }} kW</span>
        <span class="text-sm text-secondary">{{ station.connector }}</span>
      </div>
      <div class="mt-3 text-xs text-muted">
        <div v-if="station.offlineSince" :data-cy="`station-offline-duration-${station.id}`" class="text-danger mb-1">
          Offline da: {{ formatTimeAgo(station.offlineSince) }}
        </div>
        <div>
          Ultimo segnale: {{ formatTimeAgo(station.lastTelemetry) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-medium { font-weight: 500; }
.text-danger { color: var(--accent-red); }
</style>
