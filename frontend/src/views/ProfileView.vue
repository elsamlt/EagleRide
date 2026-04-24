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

    <div :class="[
      { 'tab-content': (activeTab === 'joined' && joinedRides.length === 0) ||
                    (activeTab === 'offers' && myOffers.length === 0) }
    ]">
      <div v-if="activeTab === 'joined'">
        <div v-if="joinedRides.length === 0" class="empty-state">
          <p>You have no upcoming rides as a passenger.</p>
          <router-link to="/" class="accent-link">Search for one?</router-link>
        </div>

        <div v-else class="rides-list">
          <div v-for="(category, key) in organizedJoinedRides" :key="key" class="status-group">
            <h2 class="status-title" :class="key">{{ category.label }}</h2>

            <div v-for="ride in category.rides" :key="ride.bookingID" class="ride-wrapper">
              <RideCard :ride="ride" />
            </div>
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
            :key="offer.rideID"
            :offer="offer"
            @edit="editOffer(offer.rideID)"
            @cancel="cancelOffer(offer.rideID)"
            @approve="approve"
            @decline="decline"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { bookingService, userService, rideService } from '@/api';
import { useAuthStore } from '@/stores/auth';
import OfferCard from '@/components/OfferCard.vue';
import RideCard from '@/components/RideCard.vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const joinedRides = ref([]);
const myOffers = ref([]);
const isLoading = ref(true);
const router = useRouter();

const editOffer = (id) => {
  router.push(`/dashboard/edit-ride/${id}`);
};

const cancelOffer = async (id) => {
  if (!confirm("Are you sure you want to delete this ride offer? This action cannot be undone.")) {
    return;
  }

  try {
    await rideService.delete(id);

    await fetchDashboardData();
  } catch (error) {
    console.error("Error deleting ride:", error);
    alert("Could not delete the ride. It might have confirmed passengers.");
  }
};

const approve = (id) => {
  bookingService.updateStatus(id, "confirmed")
    .then(() => {
      fetchDashboardData();
    })
    .catch(error => {
      console.error("Error approving offer:", error);
    });
};

const decline = async (bookingId, rideId) => {
  try {
    await bookingService.updateStatus(bookingId, "rejected");

    await rideService.incrementSeats(rideId);

    fetchDashboardData();
  } catch (error) {
    console.error("Error declining:", error);
  }
};

const activeTab = ref('joined');

const fetchDashboardData = async () => {
  if (!user.value?.goldCardNumber) return;

  isLoading.value = true;

  try {
    const userId = user.value.goldCardNumber;
    const dataJoined = await bookingService.getUserBookings(userId);
    const dataOffers = await userService.getOffers(userId);

    joinedRides.value = dataJoined.data;

    myOffers.value = dataOffers.map(offer => ({
      ...offer,
      time: offer.departureTime
    }));

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};

const organizedJoinedRides = computed(() => {
  const categories = {
    pending: { label: 'Pending Requests', rides: [] },
    confirmed: { label: 'Confirmed Rides', rides: [] },
    rejected: { label: 'Rejected Requests', rides: [] },
    cancelled: { label: 'Cancelled Rides', rides: [] }
  };

  joinedRides.value.forEach(ride => {
    const status = ride.status?.toLowerCase() || 'pending';
    if (categories[status]) {
      categories[status].rides.push(ride);
    }
  });

  return Object.keys(categories)
    .filter(key => categories[key].rides.length > 0)
    .reduce((obj, key) => {
      obj[key] = categories[key];
      return obj;
    }, {});
});

onMounted(() => {
  fetchDashboardData();
});

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

.tab-content {
  background-color: var(--white);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
}

.tab-content p {
  margin-top: 0;
}

.status-group {
  margin-bottom: 30px;
}

.status-title {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  margin-bottom: 15px;
  padding-left: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Couleurs par statut */
.status-title.confirmed { color: #2ecc71; border-left: 4px solid #2ecc71; padding-left: 10px; }
.status-title.pending { color: var(--juniata-gold); border-left: 4px solid var(--juniata-gold); padding-left: 10px; }
.status-title.rejected { color: #e74c3c; border-left: 4px solid #e74c3c; padding-left: 10px; }
.status-title.cancelled { color: #95a5a6; border-left: 4px solid #95a5a6; padding-left: 10px; }

.ride-wrapper {
  margin-bottom: 12px;
}
</style>
