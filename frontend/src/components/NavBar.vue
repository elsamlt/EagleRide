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
    <div class="logo" @click="router.push('/')" style="cursor: pointer;">
      <img src="@/assets/logo.png" alt="EagleRide Logo" class="logo-icon" />
      <p>EagleRide</p>
    </div>
    <div class="links">

      <template v-if="authStore.useAuthStore">
        <router-link class="link" to="/">Home</router-link>
        <router-link class="link" to="/profile">Profile</router-link>

        <div class="avatar-circle">
          {{ authStore.user?.name?.charAt(0).toUpperCase() || 'F' }}
        </div>

        <button @click="handleLogout" class="btn">Logout</button>
      </template>

      <template v-else>
        <router-link to="/auth/login" class="btn-login">Login</router-link>
        <router-link to="/auth/register" class="btn">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: var(--juniata-blue);
  color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--white);
}

.logo-icon {
  height: 60px;
  width: auto;
  object-fit: contain;
}

.links {
  display: flex;
  align-items: center;
}

.link{
  color: var(--white);
  transition: all 0.3s ease-in-out;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
}

.link:hover{
  color: var(--white-hover);
  border-bottom: 1px solid var(--white-hover);
}

.links a {
  margin-left: 15px;
  text-decoration: none;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-circle {
  width: 30px;
  height: 30px;
  background-color: var(--white);
  color: var(--juniata-blue);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  cursor: default;
  margin-left: 15px;
  margin-right: 15px;
}

.btn-login {
  text-decoration: none;
  color: var(--white);
  background-color: transparent;
  border: 1px solid var(--white);
  padding: 6px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-login:hover {
  background-color: var(--juniata-blue-hover);
  transform: translateY(-1px);
}

.btn {
  appearance: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  background-color: var(--white);
  color: var(--juniata-blue);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: var(--white-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px var(--juniata-blue-hover);
}
</style>
