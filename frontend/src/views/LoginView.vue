<script setup>
import { ref } from 'vue'
import { userService } from '@/api'

const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Team will implement login logic here
}
</script>

<template>
  <div class="login-view">
    <h2>Welcome back</h2>
    <p>Log in with your Juniata ID</p>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <button class="btn-primary">Log in</button>
    </form>
  </div>
</template>

<style scoped>
/* Scoped styles for this page only */
input { display: block; width: 100%; margin: 10px 0; padding: 10px; }
</style>
