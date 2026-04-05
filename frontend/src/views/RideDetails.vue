<template>
  <div class="ride-details-page">
    <nav class="top-nav">
      <button @click="$router.back()" class="back-link">← Back to search</button>
    </nav>

    <h1 class="page-title">Ride details</h1>

    <div class="details-grid">
      <main class="info-column">
        
        <section class="card route-card">
          <div class="route-visual">
            <div class="stop">
              <span class="time">{{ ride.departureTime }}</span>
              <span class="city">{{ ride.origin }}</span>
            </div>
            <div class="duration-line">
              <span class="duration-text">35 min</span>
            </div>
            <div class="stop">
              <span class="time">{{ ride.arrivalTime }}</span>
              <span class="city">{{ ride.destination }}</span>
            </div>
          </div>
        </section>

        <DriverProfileCard :driver="driver" />

        <section class="card reviews-card">
          <h3 class="section-title">Passenger Reviews</h3>
          
          <div v-if="reviews.length === 0" class="empty-msg">
            No review for the moment
          </div>
          
          <div v-else class="reviews-list">
            <ReviewItem 
              v-for="review in reviews" 
              :key="review.id" 
              :review="review" 
            />
          </div>
        </section>
      </main>

      <aside class="sidebar-column">
        <div class="sticky-card">
          <div class="date-header">
            <h3>{{ formatDate(ride.date_) }}</h3>
            <p>{{ ride.origin }} to {{ ride.destination }}</p>
          </div>

          <hr class="divider" />

          <div class="booking-info">
            <div class="seats-left">{{ ride.availableSeats }} seats left</div>
            <div class="price">{{ ride.price }}$</div>
          </div>

          <AppButton size="large" @click="handleBooking">
            Book now
          </AppButton>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DriverProfileCard from '@/components/cards/DriverProfileCard.vue';
import ReviewItem from '@/components/cards/ReviewItem.vue';
import AppButton from '@/components/common/AppButton.vue';

const route = useRoute();

// Mock Data (Replace with API calls)
const ride = ref({
  origin: 'Huntingdon',
  destination: 'State College',
  departureTime: '6:00 pm',
  arrivalTime: '6:35 pm',
  date_: '2026-03-18',
  availableSeats: 2,
  price: 10.29
});

const driver = ref({
  name: 'Kai Sterling',
  rating: 4.8,
  reviews: 42,
  vehicle: { model: 'Toyota Camry', color: 'White' },
  prefs: { allowPets: false, allowMusic: true, musicGenre: '80s Rock', allowChat: true, allowSmoking: false }
});

const reviews = ref([
  { id: 1, passengerName: 'Alice Waster', rating: 5, comment: 'Super punctual!' },
  { id: 2, passengerName: 'Sarah Jenkins', rating: 5, comment: 'Great conversation.' }
]);

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
};

const handleBooking = () => {
  console.log("Booking logic for ride ID:", route.params.id);
};
</script>

<style scoped>
.ride-details-page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { color: var(--juniata-blue); margin: 20px 0; font-size: 32px; }

.details-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #eee;
}

/* Sidebar Styling */
.sticky-card {
  position: sticky;
  top: 100px;
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.booking-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  font-weight: bold;
}

.price { color: var(--text-dark); font-size: 20px; }

.back-link { background: none; border: none; color: #9CA3AF; cursor: pointer; }
</style>
