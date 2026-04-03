<template>
  <div class="ride-form-card">
    <button class="back-link" @click="$emit('goBack')">← Back to dashboard</button>

    <div class="form-header">
      <h2>{{ isEditMode ? 'Edit Ride Details' : 'Post a New Ride' }}</h2>
      <p>{{ isEditMode ? 'Update your trip info' : 'Offer a seat to fellow Eagles' }}</p>
    </div>

    <form @submit.prevent="handleRideSubmit">
      <div class="input-group">
        <label>Destination</label>
        <input v-model="ride.destination" type="text" placeholder="e.g. State College">
      </div>

      <div class="row">
        <div class="input-group">
          <label>Date (date_)</label>
          <input v-model="ride.date_" type="date">
        </div>
        <div class="input-group">
          <label>Time (departureTime)</label>
          <input v-model="ride.departureTime" type="time">
        </div>
      </div>

      <div class="action-footer">
        <AppButton size="large">
          {{ isEditMode ? 'Edit Ride Offer' : 'Publish Ride Offer' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppButton from './common/AppButton.vue';

const props = defineProps({
  mode: { type: String, default: 'create' },
  initialRideData: Object // Loaded from DB when editing
});

const isEditMode = computed(() => props.mode === 'edit');

// Initializing with DB column names
const ride = ref({
  destination: props.initialRideData?.destination || '',
  date_: props.initialRideData?.date_ || '',
  departureTime: props.initialRideData?.departureTime || '',
  availableSeats: props.initialRideData?.availableSeats || 1,
  price: props.initialRideData?.price || 0
});
</script>

<style scoped>
.ride-form-card {
  background-color: var(--white);
  padding: 40px;
  border-radius: 15px;
}
.back-link {
  color: var(--juniata-gold);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-main);
}
</style>
