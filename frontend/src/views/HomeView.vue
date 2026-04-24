<template>
  <div class="home-container">
    <div class="content-grid">

      <aside class="search-sidebar">
        <SearchForm @search="handleSearch" />
      </aside>

      <section class="rides-main">
        <h1 class="main-title">Available Rides for the Community</h1>

        <div v-if="isLoading" class="status-message">
          Loading amazing journeys...
        </div>

        <div v-else-if="groupedRides.length === 0" class="status-message no-results">
          <p>No rides found. Try another search or check back later!</p>
        </div>

        <div v-else v-for="group in groupedRides" :key="group.date" class="date-group">
          <h2 class="date-header">{{ formatGroupDate(group.date) }}</h2>

          <div class="cards-stack">
            <RideCard
              v-for="ride in group.rides"
              :key="ride.rideID"
              :ride="ride"
              @view-details="openDetails(ride.rideID)"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import SearchForm from '@/components/SearchForm.vue';
import RideCard from '@/components/RideCard.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { rideService } from '@/api';

const rawRides = ref([]);
const isLoading = ref(true);
const router = useRouter();

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);

const groupedRides = computed(() => {
  const groups = rawRides.value.reduce((acc, ride) => {
    const date = ride.date_;
    if (!acc[date]) acc[date] = [];
    acc[date].push(ride);
    return acc;
  }, {});

  return Object.keys(groups).sort().map(date => ({
    date,
    rides: groups[date]
  }));
});

const fetchRides = async (filters = {}) => {
  isLoading.value = true;
  try {
    const params = {
      ...filters,
      userId: currentUser.value?.goldCardNumber
    };

    const response = await rideService.getAll(params);
    rawRides.value = response.data;
  } catch (error) {
    console.error("Error fetching rides:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatGroupDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) return 'Today';

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

const handleSearch = (criteria) => {
  fetchRides(criteria);
};

const openDetails = (id) => {
  router.push(`ride-details/${id}`)
};

onMounted(() => {
  fetchRides();
});
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 40px;
}

.main-title {
  color: var(--juniata-blue);
  font-family: var(--font-main);
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
}

.date-header {
  color: var(--juniata-blue);
  font-size: 18px;
  font-weight: 700;
  margin: 30px 0 15px;
}

.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-message {
  text-align: center;
  padding: 50px;
  color: var(--light-grey);
  background: var(--white);
  border-radius: 15px;
}

/* Responsive adjustment */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
