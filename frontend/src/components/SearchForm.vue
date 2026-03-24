<template>
  <div class="search-form">
    <h3>Find a Ride</h3>
    <form @submit.prevent="onSearch">
      <div class="input-group">
        <label>To where?</label>
        <input type="text" v-model="destination" placeholder="Enter destination">
      </div>

      <div class="input-group">
        <label>When?</label>
        <input type="date" v-model="date">
      </div>

      <button type="submit" class="btn-search">Search</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// English: Reactive variables for the search criteria
const destination = ref('')
const date = ref('')

const onSearch = () => {
  console.log('Searching for:', destination.value, 'on', date.value)
  // Team will link this to rideService.getAll() later
}
</script>

<style scoped>
.search-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

h3 { color: var(--juniata-blue); margin-top: 0; }

.input-group { margin-bottom: 1.5rem; }

label { display: block; margin-bottom: 0.5rem; font-weight: bold; }

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.btn-search {
  width: 100%;
  background-color: var(--juniata-gold);
  color: var(--juniata-blue);
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-search:hover {
  background-color: #e0a51d;
}
</style>
