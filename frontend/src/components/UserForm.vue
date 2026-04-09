<template>
  <div class="user-form-card">
    <button v-if="authStore.isLoggedIn" class="back-link" @click="goBack">
      ← Back to Profile
    </button>

  <div class="form-header">
    <h2>{{ authStore.isLoggedIn ? 'Edit Your Account' : 'Create Your Account' }}</h2>
    <p>{{  authStore.isLoggedIn ? 'Keep your information up to date' : 'Join EagleRide Community' }}</p>
  </div>

  <form @submit.prevent="handleSubmit" class="form-layout">
    <div class="column-container">
      <section class="form-section">
        <h3>Personal details</h3>
        <div class="input-group">
          <label>Full Name</label>
          <input v-model="formData.fullName" type="text" placeholder="">
        </div>
      </section>

<div class="input-group">
  <label>Juniata Email</label>
  <input v-model="formData.email" type="email"
  :readonly="authStore.isLoggedIn"
  :class="{ 'field-readonly': authStore.isLoggedIn }"
>
</div>

<div class="input-group">
  <label>Password</label>
  <input v-model="formData.password" type="password"
  :readonly="authStore.isLoggedIn"
  :class="{ 'field-readonly': authStore.isLoggedIn }"
>
</div>

<div class="input-group">
  <label>Gold Card Number</label>
  <input v-model="formData.goldCardNumber" type="text"
  :readonly="authStore.isLoggedIn"
  :class="{ 'field-readonly': authStore.isLoggedIn }"
>
</div>
<div class="row">
  <div class="input-group">
    <label>Date of Birth</label>
    <input v-model="formData.dob" type="date">
  </div>

  <div class="input-group">
    <label>Phone Number</label>
    <input v-model="formData.phone" type="tel" placeholder="814-XXX-XXXX">
    </div>
  </div>
 </section>

 <section class="form-section">
          <h3>Ride Preferences</h3>
          <h3 class="mt-4">Driver Information (Optional)</h3>
          <div class="input-group">
            <label>Driver's License Number</label>
            <input v-model="formData.licenseNumber" type="text" placeholder="PA-XXXXXX">
          </div>
          <div class="input-group">
            <label>Vehicle Model</label>
            <input v-model="formData.vehicleModel" type="text" placeholder="Toyota Camry">
          </div>
          <div class="input-group">
            <label>Vehicle Color</label>
            <input v-model="formData.vehicleColor" type="text" placeholder="White">
          </div>
          <div class="input-group">
            <label>License Plate</label>
            <input v-model="formData.licensePlate" type="text" placeholder="ABC-1234">
          </div>
          </section>
      </div>

<div class="form-footer">
  <AppButton size="large" type="submit">
    {{ authStore.isLoggedIn ? 'Save Changes' : 'Create Account' }}
  </AppButton>
  <p v-if="!authStore.isLoggedIn" class="login-redirect">
    Already have an account? <router-link to="/login">Login Here </router-link>
  </p>
</div>
</template>

<script setup>
import {ref, watchEffect } from 'vue';
import { useAuthStore } from '../stores/authStore';
import AppButton from './AppButton.vue';

const authStore = useAuthStore();

//initialize formData with empty values
const formData = ref({
  fullName: '',
  email: '',
  password: '',
  goldCardNumber: '',
  dob: '',
  phone: '',
  licenseNumber: '',
  vehicleModel: '',
  vehicleColor: '',
  licensePlate: ''
});

//(logged in) prefill form when user status becomes "logged in"
watchEffect(() => {
  if(authStore.isLoggedIn && authStore.user){
    formData.value = {...authStore.user};
  } else {
    //reset to empty if user is logged out or guest
    formData.value = {fullName: '', email: '', password: '', /*...rest */};
  }
});

const handleSubmity = () => {
  if(authStore.isLoggedIn){
    console.log("Saving changes...", formData.value);
  } else {
    console.log("Creating account...", formData.value);
  }
};
</script>

<style scoped>
.form-layout {
  display: flex;
  flex-direction: column;
}

.column-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.field-readonly {
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #ccc;
  cursor: not-allowed;
}

.back-link {
  color:  var(--juniata-blue);
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
}

.form-footer {
  text-align: center;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}
</style>

