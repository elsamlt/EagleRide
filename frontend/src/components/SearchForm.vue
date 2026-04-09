<template>
  <div class="search-form">
    <h3>Find a Journey</h3>
    <form @submit.prevent="onSearch">
      <div class="input-group">
        <label>To where?</label>
        <input type="text" v-model="destination" placeholder="Walmart, State College...">
      </div>

      <div class="input-group">
        <label>When?</label>
        <input
          type="text"
          v-model="date"
          placeholder="MM/DD/YYYY"
          onfocus="(this.type='date')"
          onblur="if(!this.value)this.type='text'"
          :min="today"
        >
      </div>
      <AppButton size="full" type="submit">Search now</AppButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
const today = new Date().toISOString().split('T')[0]
const emit = defineEmits(['search'])

const destination = ref('')
const date = ref('')

const onSearch = () => {
    emit('search', {destination: destination.value,date: date.value})
}
</script>

<style scoped>
.search-form {
  background: var(--white);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

h3 { color: var(--juniata-blue); margin-top: 0; }

.input-group { margin-bottom: 1.5rem; }

label { color: black; font-size: 15px;}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

input::placeholder {
  color: var(--light-grey);
  opacity: 1;
}
</style>
