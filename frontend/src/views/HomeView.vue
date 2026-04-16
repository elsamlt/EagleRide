<script setup>
import SearchForm from '@/components/SearchForm.vue'
import RideCard from '@/components/RideCard.vue'
import { ref, onMounted, computed } from 'vue'
import { rideService } from '@/api'

const rides = ref([]) // Team will populate this with API data
//fill rides using rideService.getAll()
onMounted(async () => {
  const today = new Date().toISOString().split('T')[0]
  rides.value = await rideService.getAll({ date_: today})
})
//sort rides by date
const searchCriteria = ref({ destination: '', travelDate: ''})
const groupedRides = computed(() => {
  return [...rides.value].sort((a, b) => new Date(a.date_)
  - new Date(b.date_)).filter(ride => {
    const matchDest = !searchCriteria.value.destination ||
    ride.destination.toLowerCase().includes(searchCriteria.value.destination.toLowerCase())
    const matchDate = !searchCriteria.value.travelDate ||
    ride.date_ === searchCriteria.value.travelDate
    return matchDest && matchDate
  })
})
//filtering logic (triggering get request with destination + date)
const handleSearch = async (criteria) => {
  searchCriteria.value = criteria
}
</script>

<template>
  <div class="home-container">
    <section class="search-section">
      <SearchForm @search="handleSearch" />
    </section>

    <section class="results-section">
      <h2>Available Rides</h2>
      <div class="rides-list">
        <RideCard v-for="ride in searchRides" :key="ride.rideID" :ride="ride" />
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
