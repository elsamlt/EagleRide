<template>
<<<<<<< HEAD
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
=======
  <div class="ride-form-card">
    <button class="back-link" @click="$emit('goBack')">← Back to dashboard</button>

    <div class="form-header">
      <h2>{{ isEditMode ? 'Edit Ride Details' : 'Post a New Ride' }}</h2>
      <p>{{ isEditMode ? 'Update your trip info' : 'Offer a seat to fellow Eagles' }}</p>
    </div>

    <form @submit.prevent="handleRideSubmit">
      <div class="input-group">
        <label>Destination</label>
        <input v-model="ride.destination" type="text" placeholder="e.g. State College">
      </div>

      <div class="row">
        <div class="input-group">
          <label>Date (date_)</label>
          <input v-model="ride.date_" type="date">
        </div>
        <div class="input-group">
          <label>Time (departureTime)</label>
          <input v-model="ride.departureTime" type="time">
        </div>
      </div>

      <div class="action-footer">
        <AppButton size="large">
          {{ isEditMode ? 'Edit Ride Offer' : 'Publish Ride Offer' }}
        </AppButton>
>>>>>>> ab959bc5676b8d6aff70d8971496c3b392cc6350
      </div>
    </form>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref, computed, onMounted } from 'vue';
import AppButton from './AppButton.vue'; // Adjust path as necessary

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value)
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['submit']);

// Form State
const form = ref({
  destination: '',
  date: '',
  time: '',
  seats: 1,
  price: null
});

// --- Computed Properties for Dynamic Content ---
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

// --- Hydration & Formatting ---
onMounted(() => {
  if (isEdit.value && props.initialData) {
    form.value.destination = props.initialData.destination || '';
    form.value.seats = props.initialData.seats || 1;
    form.value.price = props.initialData.price || null;

    // Format Date to YYYY-MM-DD for <input type="date">
    if (props.initialData.date) {
      const dateObj = new Date(props.initialData.date);
      if (!isNaN(dateObj)) {
        form.value.date = dateObj.toISOString().split('T')[0];
      }
    }

    // Format Time to HH:mm for <input type="time">
    if (props.initialData.time) {
      // Assuming initial time might come in as a full ISO string or another format.
      // If it's already HH:mm, this just passes it through.
      const timeParts = props.initialData.time.match(/(\d{2}:\d{2})/);
      if (timeParts) {
        form.value.time = timeParts[0];
      } else {
         form.value.time = props.initialData.time; // Fallback
      }
    }
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
=======
import { ref, computed } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps({
  mode: { type: String, default: 'create' },
  initialRideData: Object // Loaded from DB when editing
});

const isEditMode = computed(() => props.mode === 'edit');

// Initializing with DB column names
const ride = ref({
  destination: props.initialRideData?.destination || '',
  date_: props.initialRideData?.date_ || '',
  departureTime: props.initialRideData?.departureTime || '',
  availableSeats: props.initialRideData?.availableSeats || 1,
  price: props.initialRideData?.price || 0
});
</script>

<style scoped>
.ride-form-card {
  background-color: var(--white);
  padding: 40px;
  border-radius: 15px;
}
.back-link {
  color: var(--juniata-gold);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-main);
}
</style>
>>>>>>> ab959bc5676b8d6aff70d8971496c3b392cc6350
