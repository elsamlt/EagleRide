<template>
  <div class="offer-card">
    <div class="offer-header gray-bg">
      <div class="offer-info">
        <h3>{{ offer.origin }} → {{ offer.destination }}</h3>
        <p class="offer-meta">
          {{ offer.date }} at {{ offer.time }} -
          <span class="seats-count">{{ offer.availableSeats }} seats left</span>
        </p>
      </div>
      <div class="offer-actions">
        <AppButton size="standard" variant="primary" @click="$emit('edit', offer.rideID)">
          Edit
        </AppButton>
        <AppButton class="cancel" size="standard" variant="grey" @click="$emit('cancel', offer.rideID)">
          Cancel
        </AppButton>
      </div>
    </div>

    <hr class="section-divider" />

    <div class="section-container white-bg">
      <p class="section-label">PENDING REQUESTS</p>

      <template v-if="offer.pendingRequests && offer.pendingRequests.length > 0">
        <div v-for="req in offer.pendingRequests" :key="req.id" class="passenger-card">
          <div class="user-profile">
            <div class="avatar">{{ req.name.charAt(0) }}</div>
            <div class="user-details">
              <span class="user-name">{{ req.name }}</span>
              <span class="user-stats">★ {{ req.rating }} ({{ req.reviews }} Reviews)</span>
            </div>
          </div>
          <div class="action-buttons">
            <AppButton size="standard" variant="primary" @click="$emit('approve', req.bookingID)">
              Accept
            </AppButton>
            <AppButton size="standard" variant="grey" @click="$emit('decline', req.bookingID)">
              Decline
            </AppButton>
          </div>
        </div>
      </template>

      <div v-else class="no-requests">
        <p class="no-passengers">No pending requests at the moment.</p>
      </div>
    </div>

    <div class="section-container confirmed-section gray-bg border-top">
      <p class="section-label">CONFIRMED PASSENGERS</p>
      <div class="confirmed-avatars">
        <div
          v-for="p in offer.confirmedPassengers"
          :key="p.id"
          class="avatar mini"
          :title="p.name"
        >
          {{ p.name.charAt(0) }}
        </div>
        <span v-if="!offer.confirmedPassengers?.length" class="no-passengers">No passengers yet</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import App from '@/App.vue';
import AppButton from '@/components/AppButton.vue';

defineProps({
  offer: { type: Object, required: true }
});
defineEmits(['edit', 'cancel', 'approve', 'decline']);
</script>

<style scoped>
.offer-card {
  background: var(--white);
  border: 1px solid var(--light-grey);
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
}

.gray-bg {
  background-color: var(--light-gray);
}

.white-bg {
  background-color: var(--white);
}

.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px 15px 20px;
  border-radius: 20px 20px 0 0;
}

.offer-info h3 {
  margin: 0;
  font-size: 18px;
  color: var(--juniata-blue);
  font-weight: 800;
  text-align: left;
}

.offer-meta {
  margin: 4px 0 0;
  color: var(--text-dark);
  font-size: 14px;
  text-align: left;
}

.seats-count {
  color: var(--juniata-blue);
}

/* Buttons */
.cancel {
  background-color: var(--white);
}

.action-buttons, .offer-actions {
  display: flex;
  gap: 8px;
}

/* Separators */
.section-divider {
  border: 0;
  border-top: 1px solid var(--light-grey);
  margin: 0;
}

.border-top {
  border-top: 1px solid var(--light-grey);
}

/* Sections */
.section-container {
  padding: 0 20px 0 20px;
  border-radius: 0 0 20px  20px;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 16px;
  text-align: left;
  letter-spacing: 0.5px;
}

/* Passenger Request Box */
.passenger-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--white);
  border: 1px solid var(--white-hover);
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 12px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 44px;
  height: 44px;
  background: var(--juniata-blue);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.user-details { display: flex; flex-direction: column; text-align: left; }
.user-name { font-weight: 700; color: var(--juniata-blue); font-size: 16px; }
.user-stats { font-size: 12px; color: var(--light-grey); }

/* Confirmed Passengers avatars */
.confirmed-avatars { display: flex; gap: 8px; justify-content: flex-start; padding-bottom: 15px ; }
.avatar.mini { width: 34px; height: 34px; font-size: 14px; }
.no-passengers { font-size: 13px; color: var(--light-grey);}
</style>
