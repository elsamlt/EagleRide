<template>
  <div class="dashboard-page">
    <div class="header-actions">
      <h1 class="page-title">My Drives</h1>
      <AppButton size="standard" @click="$router.push('/dashboard/post-ride')">
        + Post a new ride
      </AppButton>
    </div>

    <div class="tabs-container">
      <button :class="{ active: currentTab === 'joined' }" @click="currentTab = 'joined'">Joined Drives</button>
      <button :class="{ active: currentTab === 'offers' }" @click="currentTab = 'offers'">My Offers</button>
    </div>

    <div class="tab-content">
      <div v-if="currentTab === 'joined'">
        <p v-if="joinedRides.length === 0">You have no upcoming rides as a passenger. <a href="/">Search for one?</a></p>
        <RideCard v-for="ride in joinedRides" :key="ride.id" :ride="ride" />
      </div>

      <div v-else>
        <p v-if="myOffers.length === 0">You have no upcoming rides as a driver. <a href="#" @click="$router.push('/dashboard/post-ride')">Add one?</a></p>
        <RideCard v-for="ride in myOffers" :key="ride.id" :ride="ride" mode="driver" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppButton from '@/components/common/AppButton.vue';
import RideCard from '@/components/cards/RideCard.vue';

const currentTab = ref('joined');
const joinedRides = ref([]); // Fetch from API
const myOffers = ref([]);    // Fetch from API
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { color: var(--juniata-blue); font-size: 24px; font-weight: 700; }
.tabs-container { border-bottom: 1px solid #ddd; margin-bottom: 20px; display: flex; gap: 20px; }
.tabs-container button { padding: 10px 0; background: none; border: none; cursor: pointer; color: #666; }
.tabs-container button.active { color: var(--juniata-blue); border-bottom: 2px solid var(--juniata-blue); font-weight: 700; }
</style>
