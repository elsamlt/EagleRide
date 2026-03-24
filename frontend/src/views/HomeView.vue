<script setup>
import SearchForm from '@/components/SearchForm.vue'
import RideCard from '@/components/RideCard.vue'
import { ref, onMounted } from 'vue'
import { rideService } from '@/api'

const rides = ref([]) // Team will populate this with API data
</script>

<template>
  <div class="home-container">
    <section class="search-section">
      <SearchForm />
    </section>

    <section class="results-section">
      <h2>Available Rides</h2>
      <div class="rides-list">
        <RideCard v-for="ride in rides" :key="ride.rideID" :ride="ride" />
        <p v-if="rides.length === 0">No rides available yet.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container { display: flex; gap: 3rem; flex-wrap: wrap; }
.search-section { flex: 1; min-width: 300px; }
.results-section { flex: 2; min-width: 400px; }
h2 { color: var(--juniata-blue); margin-bottom: 1.5rem; }
</style>
