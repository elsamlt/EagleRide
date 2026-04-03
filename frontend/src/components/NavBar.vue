<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="logo" @click="router.push('/')" style="cursor: pointer;">EagleRide</div>
    <div class="links">
      <router-link to="/">Home</router-link>

      <template v-if="authStore.isLoggedIn">
        <router-link to="/my-drives">My Drives</router-link>
        <router-link to="/profile">Profile</router-link>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </template>

      <template v-else>
        <router-link to="/auth/login">Login</router-link>
        <router-link to="/auth/register">Sign Up</router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: var(--juniata-blue);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.links {
  display: flex;
  align-items: center;
}

.links a {
  color: white;
  margin-left: 15px;
  text-decoration: none;
}

.logout-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
  margin-left: 15px;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  font-family: inherit;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
