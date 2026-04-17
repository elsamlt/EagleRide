<template>
  <div class="ride-card">
    <div class="card-body">
      <div class="info-section">
        <h3 class="route-title">
          {{ ride.origin }} <span class="arrow">→</span> {{ ride.destination }}
        </h3>
        <p class="metadata">
           {{ ride.date }} at {{ ride.departureTime }} - {{ ride.availableSeats }} seats left
        </p>

        <div class="driver-row">
          <div class="avatar">S</div>
          <span class="driver-name">by {{ ride.driverName }}</span>
        </div>
      </div>

      <div class="actions-section">
        <AppButton v-if="viewMode === 'dashboard'" size="standard" variant="grey"
          @click="$emit('cancel', ride.id)">
          Cancel
        </AppButton>
        <AppButton size="standard"">
          Details
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AppButton from '@/components/AppButton.vue';

// const props = defineProps({
//   ride: { type: Object, required: true },
//   // 'home' (just Details) or 'dashboard' (Cancel + Details)
//   viewMode: {
//     type: String,
//     default: 'home'
//   }
// });
const props = defineProps({
  ride: { type: Object, required: true }
});

defineEmits(['view-details', 'cancel']);

// const driverInitial = computed(() => {
//   return props.ride.driverName ? props.ride.driverName.charAt(0).toUpperCase() : '?';
// });
</script>

<style scoped>
.ride-card {
  background: var(--white);
  border-radius: 16px;
  position: relative;
  border: 1px solid #eee;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 8px solid var(--juniata-gold);
  margin-bottom: 10px;
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
  color: var(--text-dark);
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
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
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

</style>
