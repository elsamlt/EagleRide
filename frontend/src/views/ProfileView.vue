<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <h1 class="page-title">My Drives</h1>
      <button
        v-if="user?.driverLicense && user.driverLicense !== 'NULL'"
        class="btn-post-ride"
        @click="$router.push('/dashboard/post-ride')"
      >
        + Post a new ride
      </button>
    </div>

    <div v-if="user?.driverLicense && user.driverLicense !== 'NULL'" class="tabs-nav">
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
             </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'offers'">
        <div v-if="myOffers.length === 0" class="empty-state">
          <p>You have no upcoming rides as a driver.</p>
          <router-link to="/dashboard/post-ride" class="accent-link">Add one?</router-link>
        </div>

        <div v-else class="offers-list">
          <OfferCard
            v-for="offer in myOffers"
            :key="offer.id"
            :offer="offer"
            @edit="handleEdit"
            @cancel="handleCancel"
            @approve="handleApprove"
            @decline="handleDecline"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import OfferCard from '@/components/OfferCard.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const activeTab = ref('joined');

// Données fictives pour correspondre à ta maquette "My Offers"
const joinedRides = ref([]);
const myOffers = ref([
  {
    id: 1,
    origin: 'Huntingdon',
    destination: 'State College',
    date: '03/18',
    time: '6:00 PM',
    availableSeats: 2,
    pendingRequests: [
      { id: 10, name: 'Luna Morales', rating: 4.8, reviews: 42 },
      { id: 11, name: 'Emily Parker', rating: 5.0, reviews: 3 }
    ],
    confirmedPassengers: [
      { id: 20, name: 'Alice' }
    ]
  }
]);

const editOffer = (id) => console.log("Edit", id);
const cancelOffer = (id) => console.log("Cancel", id);
const approve = (id) => console.log("Approved", id);
const decline = (id) => console.log("Declined", id);
</script>

<style scoped>
/* Layout */
.dashboard-view { width: 100%; max-width: 900px; margin: 0 auto; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; }
.page-title { color: var(--juniata-blue); font-weight: 800; }

.btn-post-ride {
  background-color: var(--juniata-gold);
  color: var(--white); border: none; padding: 10px 24px;
  border-radius: 25px; font-weight: 700; cursor: pointer;
}

/* Tabs */
.tabs-nav { display: flex; gap: 20px; border-bottom: 1px solid var(--light-grey); margin-bottom: 30px; }
.tab-link {
  background: none; border: none; padding: 10px 0;
  color: var(--text-dark); cursor: pointer; font-size: 14px;
}
.tab-link.active {
  color: var(--juniata-blue); border-bottom: 3px solid var(--juniata-blue);;
}

.accent-link {
  color: var(--juniata-gold);
}
</style>
