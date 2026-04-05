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
          <p>No rides found for this destination or date.</p>
          <AppButton size="standard" @click="resetSearch">View All Rides</AppButton>
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
import SearchForm from '@/components/forms/SearchForm.vue';
import RideCard from '@/components/cards/RideCard.vue';
import AppButton from '@/components/common/AppButton.vue';

// --- Reactive State ---
const rawRides = ref([]); // Data from SQL API
const isLoading = ref(true);
const filterCriteria = ref(null);

// --- Logic: Grouping Rides by Date ---
const groupedRides = computed(() => {
  let filtered = rawRides.value;

  // Apply search filtering if criteria exists
  if (filterCriteria.value) {
    filtered = filtered.filter(r => 
      r.destination.toLowerCase().includes(filterCriteria.value.destination.toLowerCase())
    );
  }

  // Grouping process
  const groups = filtered.reduce((acc, ride) => {
    const date = ride.date_; // Format: YYYY-MM-DD
    if (!acc[date]) acc[date] = [];
    acc[date].push(ride);
    return acc;
  }, {});

  // Sort dates and return as an array
  return Object.keys(groups).sort().map(date => ({
    date,
    rides: groups[date]
  }));
});

// --- Helper: Format Group Headers ---
const formatGroupDate = (dateStr) => {
  const today = new Date().toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  
  const options = { day: 'numeric', month: 'long' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
};

// --- API Interactions ---
const fetchRides = async () => {
  isLoading.value = true;
  try {
    // Replace with your actual Axios call: await axios.get('/api/rides')
    // rawRides.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching rides:", error);
  }
};

const handleSearch = (criteria) => {
  filterCriteria.value = criteria;
};

const resetSearch = () => {
  filterCriteria.value = null;
};

const openDetails = (id) => {
  console.log("Navigating to ride details:", id);
};

onMounted(fetchRides);
</script>

<style scoped>
/* Using your CSS variables for consistency */
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
  color: #6B7280;
  background: white;
  border-radius: 15px;
}

/* Responsive adjustment */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
