<template>
  <div class="ride-form-wrapper">
    <nav class="nav-header">
      <router-link to="/dashboard" class="back-link">
        <span class="arrow">←</span> Back to dashboard
      </router-link>
    </nav>

    <div class="header-section">
      <h1 class="title">{{ pageTitle }}</h1>
      <p class="subtitle">{{ pageSubtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      
      <div class="input-group full-width">
        <label for="destination">Destination</label>
        <input 
          type="text" 
          id="destination" 
          v-model="form.destination" 
          placeholder="e.g State College" 
        />
      </div>

      <div class="input-row">
        <div class="input-group">
          <label for="date">Date</label>
          <div class="input-with-icon">
            <input type="date" id="date" v-model="form.date" />
          </div>
        </div>

        <div class="input-group">
          <label for="time">Time</label>
          <div class="input-with-icon">
            <input type="time" id="time" v-model="form.time" />
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="input-group">
          <label for="seats">Available Seats</label>
          <select id="seats" v-model="form.seats">
            <option v-for="n in 6" :key="n" :value="n">
              {{ n }} seat{{ n > 1 ? 's' : '' }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <label for="price">Price per Seat</label>
          <div class="price-input-wrapper">
            <span class="currency-symbol">$</span>
            <input 
              type="number" 
              id="price" 
              step="0.01" 
              v-model="form.price" 
              placeholder="0.00" 
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <AppButton size="large" type="submit" class="submit-button">
          {{ buttonLabel }}
        </AppButton>
        
        <p v-if="mode === 'create'" class="disclaimer">
          By publishing, you agree to show your car details and preferences to interested passengers.
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value)
  },
  ride: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['submit']);

const form = ref({
  destination: '',
  date: '',
  time: '',
  seats: 1,
  price: null
});

const isEdit = computed(() => props.mode === 'edit');

const pageTitle = computed(() => 
  isEdit.value ? 'Edit Ride Details' : 'Post a New Ride'
);

const pageSubtitle = computed(() => 
  isEdit.value 
    ? 'Update your trip information and seat availability' 
    : 'Fill in the details to offer a seat to fellow Eagles'
);

const buttonLabel = computed(() => 
  isEdit.value ? 'Edit Ride Offer' : 'Publish Ride Offer'
);

const updateForm = (rideData) => {
  if (rideData) {
    form.value.destination = rideData.destination || '';
    form.value.seats = rideData.seats || 1;
    form.value.price = rideData.price || null;

    if (rideData.date) {
      const dateObj = new Date(rideData.date);
      if (!isNaN(dateObj)) {
        form.value.date = dateObj.toISOString().split('T')[0];
      }
    }

    if (rideData.time) {
      const timeParts = rideData.time.match(/(\d{2}:\d{2})/);
      if (timeParts) {
        form.value.time = timeParts[0];
      } else {
         form.value.time = rideData.time;
      }
    }
  }
};

onMounted(() => {
  if (isEdit.value) {
    updateForm(props.ride);
  }
});

watch(() => props.ride, (newRide) => {
  if (isEdit.value) {
    updateForm(newRide);
  }
});

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

<style scoped>
.ride-form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #374151;
}

.nav-header {
  margin-bottom: 40px;
}

.back-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-link:hover {
  color: #6b7280;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.input-row {
  display: flex;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.full-width {
  width: 100%;
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

input[type="text"],
input[type="date"],
input[type="time"],
input[type="number"],
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #6b7280;
  outline: none;
  box-sizing: border-box;
  background-color: #ffffff;
}

input::placeholder {
  color: #9ca3af;
}

input:focus, select:focus {
  border-color: #6b7280;
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 16px;
  color: #6b7280;
  font-size: 14px;
}

.price-input-wrapper input {
  padding-left: 32px;
}

/* Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  gap: 16px;
}

.submit-button {
  width: 400px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #1e40af;
}

.disclaimer {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 0;
}
</style>