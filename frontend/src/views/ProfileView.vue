<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <h1 class="page-title">My Drives</h1>
      <button class="btn-post-ride" @click="$router.push('/dashboard/post-ride')">
        + Post a new ride
      </button>
    </div>

    <div class="tabs-nav">
      <button
        :class="['tab-link', activeTab === 'joined' ? 'active' : '']"
        @click="activeTab = 'joined'"
      >
        Joined Drives ({{ joinedRides.length }})
      </button>
      <button
        :class="['tab-link', activeTab === 'offers' ? 'active' : '']"
        @click="activeTab = 'offers'"
      >
        My Offers ({{ myOffers.length }})
      </button>
    </div>

    <div class="tab-content">

      <div v-if="activeTab === 'joined'">
        <div v-if="joinedRides.length === 0" class="empty-state">
          <p>You have no upcoming rides as a passenger.</p>
          <router-link to="/" class="accent-link">Search for one?</router-link>
        </div>

        <div v-else class="rides-list">
          <div v-for="ride in joinedRides" :key="ride.id" class="ride-wrapper">
            <span :class="['status-badge', ride.status]">{{ ride.status.toUpperCase() }}</span>
            <RideCard :ride="ride" viewMode="dashboard" @cancel="cancelJoinedRide" />
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'offers'">
        <div v-if="myOffers.length === 0" class="empty-state">
          <p>You have no upcoming rides as a driver.</p>
          <router-link to="/dashboard/post-ride" class="accent-link">Add one?</router-link>
        </div>

        <div v-else class="rides-list">
          <div v-for="offer in myOffers" :key="offer.id" class="offer-container">
            <RideCard :ride="offer" viewMode="driver" @edit="editOffer" />

            <div v-if="offer.pendingRequests?.length > 0" class="requests-box">
              <p class="request-label">PENDING REQUESTS</p>
              <div v-for="req in offer.pendingRequests" :key="req.id" class="request-item">
                <div class="passenger-info">
                  <span class="avatar">{{ req.name.charAt(0) }}</span>
                  <span>{{ req.name }} ({{ req.rating }}★)</span>
                </div>
                <div class="request-actions">
                  <button class="btn-accept" @click="approvePassenger(req.id)">Accept</button>
                  <button class="btn-decline" @click="declinePassenger(req.id)">Decline</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RideCard from '@/components/RideCard.vue';

const activeTab = ref('joined'); // 'joined' or 'offers'

// Mock Data - In real life, fetch this onMounted
const joinedRides = ref([
  { id: 101, origin: 'Huntingdon', destination: 'State College', departureTime: '6:00 PM', status: 'confirmed', driverName: 'Kai Sterling' }
]);

const myOffers = ref([]); // Empty to test empty state

const cancelJoinedRide = (id) => {
  console.log("Cancelling booking:", id);
};
</script>

<style scoped>
.dashboard-view {
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: var(--juniata-blue);
  font-weight: 700;
  margin: 0;
}

/* Gold Button Style from screenshot */
.btn-post-ride {
  background-color: var(--juniata-gold);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.tabs-nav {
  display: flex;
  gap: 30px;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 25px;
}

.tab-link {
  background: none;
  border: none;
  padding: 10px 5px;
  cursor: pointer;
  color: #9CA3AF;
  font-weight: 500;
}

.tab-link.active {
  color: var(--juniata-blue);
  border-bottom: 3px solid var(--juniata-blue);
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6B7280;
  background: white;
  border-radius: 16px;
  border: 1px solid #E5E7EB;
}

.accent-link {
  color: var(--juniata-gold);
  text-decoration: underline;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  font-size: 10px;
  padding: 4px 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  border: 1px solid;
}

.status-badge.confirmed { color: #3B82F6; border-color: #3B82F6; background: #EFF6FF; }
.status-badge.pending { color: #F59E0B; border-color: #F59E0B; background: #FFFBEB; }
</style>
