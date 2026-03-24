<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <nav class="navbar">
    <div class="logo">EagleRide</div>
    <div class="links">
      <router-link to="/">Home</router-link>
      <template v-if="authStore.isLoggedIn">
        <router-link to="/my-drives">My Drives</router-link>
        <router-link to="/profile">Profile</router-link>
      </template>
      <router-link v-else to="/auth/login">Login</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: var(--juniata-blue);
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
}
.links a { color: white; margin-left: 15px; text-decoration: none; }
</style>
