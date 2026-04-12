<template>
  <div class="ride-form-wrapper">

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
              <i class="material-icons">calendar_today</i>
              <input
                type="text"
                id="date"
                v-model="form.date"
                placeholder="Select date"
                onfocus="(this.type='date')"
                onblur="if(!this.value)this.type='text'"
              />
          </div>
        </div>

        <div class="input-group">
          <label for="time">Time</label>
          <div class="input-with-icon">
            <i class="material-icons">schedule</i>
            <input
              type="text"
              id="time"
              v-model="form.time"
              placeholder="Select time"
              onfocus="(this.type='time')"
              onblur="if(!this.value)this.type='text'"
            />
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
        <AppButton size="large" type="submit">
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
  color: var(--text-dark);
}

.nav-header {
  margin-bottom: 40px;
}

.back-link {
  color: var(--light-grey);
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-link:hover {
  color: var(--text-dark);
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  color: var(--light-grey);
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
  color: black;
}

input[type="text"],
input[type="date"],
input[type="time"],
input[type="number"],
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--light-grey);
  border-radius: 8px;
  font-size: 14px;
  color: var(--light-grey);
  outline: none;
  box-sizing: border-box;
  background-color: var(--white);
}

input::placeholder {
  color: var(--light-grey);
}

input:focus, select:focus {
  border-color: var(--text-dark);
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 16px;
  color: var(--light-grey);
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

.disclaimer {
  font-size: 12px;
  color: var(--light-grey);
  text-align: center;
  margin: 0;
}

.size-large {
  margin: 0rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i {
  position: absolute;
  left: 12px;
  font-size: 18px;
  color: var(--light-grey);
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 40px !important;
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

input[type="date"]::-moz-calendar-picker-indicator {
  display: none;
}
</style>
