<script setup>
import { ref } from 'vue'
import { useTariffStore } from '@/stores/tariffs'
import { formatDateTime } from '@/data/mockData'

const tariffStore = useTariffStore()
const editMode = ref({})
const editedSlots = ref({})
const lastModified = ref(new Date())

const enterEditMode = (tariff) => {
  editMode.value[tariff.id] = true
  // Create a deep copy for editing
  editedSlots.value[tariff.id] = JSON.parse(JSON.stringify(tariff.timeSlots))
}

const cancelEdit = (tariffId) => {
  editMode.value[tariffId] = false
  delete editedSlots.value[tariffId]
}

const saveTariff = (tariffId) => {
  tariffStore.updateTariff(tariffId, editedSlots.value[tariffId])
  editMode.value[tariffId] = false
  lastModified.value = new Date()
}
</script>

<template>
  <div data-cy="tariff-config">
    <div class="flex-between mb-3">
      <h1 class="page-title">Configurazione Tariffe</h1>
      <div class="text-sm text-muted">
        Ultima modifica: {{ formatDateTime(lastModified) }}
      </div>
    </div>
    
    <div class="grid-2">
      <div v-for="tariff in tariffStore.tariffs" :key="tariff.id" class="card">
        <div class="card-header border-b pb-2 mb-2">
          <h2 class="section-title">{{ tariff.locationName }}</h2>
          <button v-if="!editMode[tariff.id]" 
                  @click="enterEditMode(tariff)" 
                  class="btn btn-ghost btn-sm"
                  :data-cy="`edit-tariff-${tariff.id}`">
            Modifica
          </button>
          <div v-else class="flex gap-1">
            <button @click="cancelEdit(tariff.id)" class="btn btn-ghost btn-sm">Annulla</button>
            <button @click="saveTariff(tariff.id)" class="btn btn-primary btn-sm" :data-cy="`save-tariff-${tariff.id}`">Salva</button>
          </div>
        </div>
        
        <div class="card-body">
          <div v-if="!editMode[tariff.id]">
            <div v-for="(slot, index) in tariff.timeSlots" :key="index" class="flex-between mb-2">
              <div>
                <span class="font-bold">{{ slot.label }}</span>
                <div class="text-xs text-muted">{{ slot.startHour }}:00 - {{ slot.endHour }}:00</div>
              </div>
              <div class="text-lg text-primary font-bold">
                €{{ slot.pricePerKWh.toFixed(2) }}<span class="text-xs text-secondary font-normal">/kW</span>
              </div>
            </div>
          </div>
          
          <div v-else>
            <div v-for="(slot, index) in editedSlots[tariff.id]" :key="index" class="mb-3 p-2 bg-secondary rounded">
              <div class="font-bold mb-1">{{ slot.label }}</div>
              <div class="flex gap-2">
                <div class="flex-1">
                  <label class="form-label text-xs">Prezzo / kW (€)</label>
                  <input type="number" 
                         v-model="slot.pricePerKWh" 
                         class="form-input p-1 h-auto" 
                         step="0.01" min="0.01"
                         :data-cy="`tariff-price-${tariff.id}-${index}`" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-b { border-bottom: 1px solid var(--border-color); }
.pb-2 { padding-bottom: 0.75rem; }
.mb-2 { margin-bottom: 0.75rem; }
.font-bold { font-weight: 700; }
.text-lg { font-size: 1.125rem; }
.text-primary { color: var(--accent-blue); }
.font-normal { font-weight: 400; }
.bg-secondary { background-color: var(--bg-secondary); }
.p-2 { padding: 0.75rem; }
.p-1 { padding: 0.25rem 0.5rem; }
.h-auto { height: auto; }
.rounded { border-radius: var(--radius-sm); }
.flex-1 { flex: 1; }
</style>
