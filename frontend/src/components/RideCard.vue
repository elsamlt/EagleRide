<template>
  <div class="ride-card">
    <div class="card-body">
      <div class="info-section">
        <h3 class="route-title">
          {{ ride.origin }} <span class="arrow">→</span> {{ ride.destination }}
        </h3>
        <p class="metadata">
          {{ ride.dateText }} at {{ ride.departureTime }} - {{ ride.availableSeats }} seats left
        </p>
        
        <div class="driver-row">
          <div class="avatar">{{ driverInitial }}</div>
          <span class="driver-name">by {{ ride.driverName }}</span>
        </div>
      </div>

      <div class="actions-section">
        <button 
          v-if="viewMode === 'dashboard'" 
          class="btn-cancel"
          @click="$emit('cancel', ride.id)"
        >
          Cancel
        </button>

        <AppButton size="standard" @click="$emit('view-details', ride.id)">
          Details
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppButton from '@/components/common/AppButton.vue';

const props = defineProps({
  ride: { type: Object, required: true },
  // 'home' (just Details) or 'dashboard' (Cancel + Details)
  viewMode: { 
    type: String, 
    default: 'home' 
  }
});

defineEmits(['view-details', 'cancel']);

const driverInitial = computed(() => {
  return props.ride.driverName ? props.ride.driverName.charAt(0).toUpperCase() : '?';
});
</script>

<style scoped>
.ride-card {
  background: var(--white);
  border-radius: 16px;
  position: relative;
  border: 1px solid #eee;
  padding: 20px;
  /* The gold bar on the left */
  border-left: 8px solid var(--juniata-gold); 
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.route-title {
  color: var(--juniata-blue);
  margin: 0 0 8px 0;
  font-size: 20px;
}

.metadata {
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
}

.driver-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 24px;
  height: 24px;
  background: var(--juniata-gold);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.driver-name {
  color: var(--juniata-gold);
  font-size: 14px;
}

.actions-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Style for the Cancel button */
.btn-cancel {
  background: #F3F4F6; /* Light gray background like your photo */
  color: var(--juniata-blue);
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: var(--font-main);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #E5E7EB;
}
</style>
