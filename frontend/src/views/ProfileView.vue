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
          <div v-for="offer in myOffers" :key="offer.id" class="offer-card">

            <div class="offer-header">
              <div class="offer-info">
                <h3>{{ offer.origin }} → {{ offer.destination }}</h3>
                <p>{{ offer.date }} at {{ offer.time }} - <span class="seats">{{ offer.availableSeats }} seats left</span></p>
              </div>
              <div class="offer-actions">
                <button class="btn-edit-small" @click="editOffer(offer.id)">Edit</button>
                <button class="btn-cancel-small" @click="cancelOffer(offer.id)">Cancel</button>
              </div>
            </div>

            <div class="requests-section">
              <p class="section-label">PENDING REQUESTS</p>
              <div v-for="req in offer.pendingRequests" :key="req.id" class="request-row">
                <div class="user-info">
                  <div class="avatar">{{ req.name.charAt(0) }}</div>
                  <div class="details">
                    <span class="name">{{ req.name }}</span>
                    <span class="rating">⭐ {{ req.rating }} ({{ req.reviews }} Reviews)</span>
                  </div>
                </div>
                <div class="action-buttons">
                  <button class="btn-accept" @click="approve(req.id)">Accept</button>
                  <button class="btn-decline" @click="decline(req.id)">Decline</button>
                </div>
              </div>
            </div>

            <div class="confirmed-section">
              <p class="section-label">CONFIRMED PASSENGERS</p>
              <div class="passengers-avatars">
                <div v-for="p in offer.confirmedPassengers" :key="p.id" class="avatar mini" :title="p.name">
                  {{ p.name.charAt(0) }}
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
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

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
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { color: var(--juniata-blue); font-weight: 800; }

.btn-post-ride {
  background-color: #B3A369; /* Ta couleur gold */
  color: white; border: none; padding: 12px 24px;
  border-radius: 25px; font-weight: 700; cursor: pointer;
}

/* Tabs */
.tabs-nav { display: flex; gap: 20px; border-bottom: 1px solid #eee; margin-bottom: 30px; }
.tab-link {
  background: none; border: none; padding: 10px 0;
  color: #9CA3AF; cursor: pointer; font-size: 16px;
}
.tab-link.active {
  color: var(--juniata-blue); border-bottom: 3px solid var(--juniata-blue); font-weight: 700;
}

/* Offer Card (Maquette) */
.offer-card {
  background: white; border: 1px solid #eee; border-radius: 16px; padding: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02); margin-bottom: 20px;
}

.offer-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.offer-info h3 { margin: 0; color: var(--juniata-blue); font-size: 20px; }
.offer-info p { margin: 5px 0 0; color: #6B7280; }
.seats { font-weight: 700; color: var(--juniata-blue); }

.btn-edit-small, .btn-cancel-small {
  padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-left: 10px;
}
.btn-edit-small { background: var(--juniata-blue); color: white; border: none; }
.btn-cancel-small { background: white; border: 1px solid #eee; color: #6B7280; }

/* Sections */
.section-label { font-size: 12px; font-weight: 700; color: #9CA3AF; margin-bottom: 15px; }

.request-row {
  display: flex; justify-content: space-between; align-items: center;
  border: 1px solid #eee; border-radius: 16px; padding: 12px 20px; margin-bottom: 10px;
}

.user-info { display: flex; align-items: center; gap: 15px; }
.avatar {
  width: 40px; height: 40px; background: var(--juniata-blue); color: white;
  border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;
}
.details { display: flex; flex-direction: column; }
.name { font-weight: 700; color: var(--juniata-blue); }
.rating { font-size: 12px; color: #9CA3AF; }

.btn-accept { background: var(--juniata-blue); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; margin-right: 8px; font-weight: 600;}
.btn-decline { background: white; border: 1px solid #eee; color: #6B7280; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;}

.passengers-avatars { display: flex; gap: 8px; }
.avatar.mini { width: 32px; height: 32px; font-size: 12px; }

.empty-state {
  text-align: center; padding: 60px; background: white; border-radius: 16px; border: 1px solid #eee; color: #9CA3AF;
}
</style>
