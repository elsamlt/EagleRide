<template>
  <div class="ride-details-page">
    <nav class="top-nav">
      <button @click="$router.back()" class="back-link">← Back to search</button>
    </nav>

    <h1 class="page-title">Ride details</h1>

    <div class="details-grid" v-if="!isLoading && ride">
      <main class="info-column">

        <section class="card route-card">
          <div class="route-container">
            <div class="stop">
              <span class="city">{{ ride.origin || 'Origin' }}</span>
              <span class="time">{{ ride.departureTime }}</span>
            </div>

            <div class="visual-indicator">
              <div class="line"></div>
              <div class="duration-badge">35 min</div>
            </div>

            <div class="stop">
              <span class="city">{{ ride.destination }}</span>
              <span class="time">{{ ride.arrivalTime || 'TBD' }}</span>
            </div>
          </div>
        </section>

        <DriverProfileCard :driver="driver" :car="car" />

        <section class="card reviews-card">
          <h3 class="section-title">Passenger Reviews</h3>
          <div v-if="reviews.length === 0" class="empty-msg">No review for the moment</div>
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
            <p class="route-summary">{{ ride.origin || 'Origin' }}</p>
            <div class="mini-visual">
               <span>{{ ride.departureTime }}</span>
               <div class="visual-indicator">
                  <div class="line"></div>
                  <div class="duration-badge">35 min</div>
               </div>
            </div>
            <p class="route-summary">{{ ride.destination }}</p>
            <div class="mini-visual">
               <span>{{ ride.arrivalTime || 'TBD' }}</span>
            </div>
          </div>

          <hr class="divider" />

          <div class="card-header">
            <div class="avatar-circle">
              {{ driver.name?.charAt(0) || '' }}
            </div>
            <div class="driver-info">
              <h3 class="driver-name">{{ driver.name }}</h3>
              <div class="rating-row">
                <span class="star">★</span>
                <span class="rating-text">{{ driver.rating }} ({{ driver.reviewCount }} Reviews)</span>
              </div>
            </div>
          </div>

          <hr class="divider" />

          <div class="booking-info">
            <div class="seats-left">{{ ride.availableSeats }} seats left</div>
            <div class="price">{{ ride.price }}$</div>
          </div>

          <AppButton size="full" @click="handleBooking" variant="primary">
            Book now
          </AppButton>
          <div v-if="successMessage" class="status success">{{ successMessage }}</div>
          <div v-if="errorMessage" class="status error">{{ errorMessage }}</div>
        </div>
      </aside>
    </div>

    <div v-if="isLoading" class="loading-state">Loading ride details...</div>
    <div v-if="!isLoading && errorMessage && !ride" class="error-state">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { vehicleService, bookingService, rideService, userService } from '@/api';
import DriverProfileCard from '@/components/DriverProfileCard.vue';
import ReviewItem from '@/components/ReviewItem.vue';
import AppButton from '@/components/AppButton.vue';

const route = useRoute();
const authStore = useAuthStore();
const rideId = computed(() => route.params.id);

const ride = ref(null);
const driver = ref({
  name: '',
  rating: 0,
  reviewCount: 0,
  prefs: {
    allowPets: false,
    allowMusic: false,
    musicGenre: 'No preference',
    allowChat: false,
    allowSmoking: false
  }
});
const car = ref(null);
const reviews = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
};

const normalizeReview = (review) => ({
  id: review.reviewID || review.id || `${rideId.value}-${review.passengerName || review.reviewer_name || 'review'}`,
  passengerName: review.passengerName || review.reviewer_name || 'Passenger',
  rating: review.stars ?? review.rating ?? 0,
  comment: review.comment || review.review || ''
});

const loadRideDetails = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (!rideId.value) {
      throw new Error('Ride ID is missing from the route.');
    }

    const rideData = await rideService.getDetails(rideId.value);
    ride.value = rideData;
  } catch (error) {
    console.error('Ride fetch failed', error);
    errorMessage.value = error.response?.data?.error || error.message || 'Unable to load ride details.';
    isLoading.value = false;
    return;
  }

  try {
    const driverData = await userService.getProfile(ride.value.goldCardNumber);

    driver.value = {
      ...driverData,
      rating: driverData.numberStars ?? 0,
      reviewCount: 0,
      reviews: 0,
      prefs: {
        allowPets: driverData.prefersPets ?? false,
        allowMusic: driverData.prefersMusic ?? false,
        musicGenre: driverData.musicGenre || 'No preference',
        allowChat: driverData.prefersConversation ?? false,
        allowSmoking: driverData.prefersSmoke ?? false
      }
    };
  } catch (error) {
    console.warn('Driver fetch failed', error);
    errorMessage.value = 'Ride loaded, but driver profile could not be loaded.';
  }

  try {
    car.value = await vehicleService.getByUser(ride.value.goldCardNumber);
  } catch (error) {
    console.warn('Vehicle fetch failed', error);
    car.value = null;
  }

  try {
    const rawReviews = await rideService.getReviews(rideId.value);
    reviews.value = Array.isArray(rawReviews)
      ? rawReviews.map(normalizeReview)
      : [];
  } catch (error) {
    console.warn('Reviews fetch failed', error);
    reviews.value = [];
  }

  if (reviews.value.length) {
    const averageFromReviews = +(reviews.value.reduce((sum, review) => sum + review.rating, 0) / reviews.value.length).toFixed(1);
    driver.value.rating = driver.value.rating || averageFromReviews;
    driver.value.reviewCount = reviews.value.length;
    driver.value.reviews = reviews.value.length;
  }

  isLoading.value = false;
};

const handleBooking = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!authStore.user?.goldCardNumber) {
    errorMessage.value = 'You must be logged in to book this ride.';
    return;
  }

  try {
    await bookingService.book(rideId.value, authStore.user.goldCardNumber);
    successMessage.value = 'Your booking is confirmed. Thank you!';

    if (ride.value?.availableSeats !== undefined) {
      ride.value.availableSeats = Math.max(0, ride.value.availableSeats - 1);
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response?.data?.error || 'Booking failed. Please try again.';
  }
};

onMounted(loadRideDetails);
</script>

<style scoped>
.ride-details-page { max-width: 1200px; margin: 0 auto; padding: 20px 40px; }
.page-title { color: var(--juniata-blue); margin: 20px 0 10px 0; font-size: 36px; font-weight: 800; }

.details-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
}

.empty-msg{
  text-align: center;
  color: var(--light-grey);
}

.card {
  background: var(--white);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: var(--juniata-blue);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.driver-name {
  color: var(--juniata-blue);
  margin: 0;
  font-size: 18px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--juniata-gold);
  font-size: 14px;
}

/* Route Visual Design */
.route-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 20px;
}

.stop { display: flex; flex-direction: column; }
.stop .city { font-weight: 700; font-size: 18px; color: var(--juniata-blue); }
.stop .time { font-size: 14px; color: var(--text-dark); }

.visual-indicator {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 5px 0;
  height: 60px;
}

.line {
  width: 2px;
  height: 100%;
  background: var(--light-gray);
  margin-left: 10px;
  position: relative;
}

.duration-badge {
  font-size: 13px;
  color: var(--text-dark);
  background: var(--light-gray);
  padding: 4px 12px;
  border-radius: 20px;
}

/* Sidebar Styling */
.sticky-card {
  position: sticky;
  top: 40px;
  background: var(--white);
  padding: 30px;
  border-radius: 24px;
  border: 1px solid #eee;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.date-header h3 { font-size: 28px; color: var(--juniata-blue); margin: 0px; }
.route-summary { font-weight: 600; color: var(--text-dark); margin-bottom: 0px; }

.mini-visual {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: var(--text-dark);
  gap: 2px;
}

.mini-line { display: flex; align-items: center; gap: 10px; color: var(--light-grey); }
.mini-duration { color: var(--light-grey); font-size: 12px; }

.sidebar-driver {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.mini-avatar {
  width: 45px;
  height: 45px;
  background: var(--juniata-blue);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.mini-driver-info { display: flex; flex-direction: column; }
.mini-driver-info .name { font-weight: 700; color: var(--juniata-blue); }
.mini-driver-info .rating { font-size: 13px; color: var(--text-dark); }

.divider { border: 0; border-top: 1px solid var(--light-gray); margin: 20px 0; }

.booking-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0;
}

.seats-left { color: var(--light-grey); font-size: 16px; }
.price { color: var(--light-grey); font-size: 16px; font-weight: 700;}

.back-link {
  background: none;
  border: none;
  color: var(--light-grey);
  cursor: pointer;
  font-size: 15px;
  margin-bottom: 10px;
}

.section-title { color: var(--juniata-blue); margin-top:0; margin-bottom: 25px; font-size: 22px; font-weight: 700; }

</style>
