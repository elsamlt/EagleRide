<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Get user initial for the avatar
const initial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'U')
</script>

<template>
  <div class="profile-card" v-if="user">
    <div class="header-banner"></div>

    <div class="avatar-container">
      <div class="avatar-circle">{{ initial }}</div>
    </div>

    <div class="user-info">
      <h2 class="user-name">{{ user.name }}</h2>
      <p class="user-email">{{ user.email }}</p>

      <div class="badge-verified">
        <font-awesome-icon icon="user-shield" class="badge-icon" />
        <span>verified Juniata student</span>
      </div>
    </div>

    <hr class="divider" />

    <div class="preferences">

      <div class="pref-item" :class="{ 'is-disabled': !user.prefersPets }">
        <font-awesome-icon icon="paw" />
        <p>{{ user.prefersPets ? 'I\'m okay to travel with pets' : 'I prefer not to travel with animals' }}</p>
      </div>

      <div class="pref-item" :class="{ 'is-disabled': !user.prefersMusic }">
        <font-awesome-icon icon="music" />
        <p>{{ user.prefersMusic ? 'We can put on a good playlist' : 'No music during the drive' }}</p>
      </div>

      <div class="pref-item" :class="{ 'is-disabled': !user.prefersConversation }">
        <font-awesome-icon icon="microphone" />
        <p>{{ user.prefersConversation ? "I'm always up for a good conversation" : 'I don\'t speak a lot' }}</p>
      </div>

      <div class="pref-item" :class="{ 'is-negative': !user.prefersSmoke }">
        <font-awesome-icon icon="smoking-ban" />
        <p>{{ user.prefersSmoke ? 'Smoking allowed' : 'No cigarettes, please' }}</p>
      </div>

      <div class="pref-item" v-if="user.driverLicense">
        <font-awesome-icon icon="car-side" />
        <p>Drive a Toyota Camry (White)</p>
      </div>
    </div>

    <button class="btn-edit">Edit Profile Settings</button>
  </div>
</template>

<style scoped>
.profile-card {
  background: white;
  width: 100%;
  max-width: 580px;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 2rem auto;
}

.header-banner {
  background-color: var(--juniata-blue);
  height: 100px;
}

.avatar-container {
  margin-top: -55px;
  display: flex;
  justify-content: center;
}

.avatar-circle {
  width: 110px;
  height: 110px;
  background: #f8f9fa;
  border: 4px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #a0a0a0;
  font-weight: bold;
}

.user-name {
  color: var(--juniata-blue);
  margin-top: 1rem;
  font-size: 1.5rem;
}

.user-email {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.badge-verified {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e0e0e0;
  padding: 4px 15px;
  border-radius: 20px;
  color: #c5a059; /* Gold color */
  font-size: 0.8rem;
}

.divider {
  margin: 2rem auto;
  width: 85%;
  border: 0;
  border-top: 1px solid #eee;
}

.preferences {
  text-align: left;
  padding: 0 40px;
}

.pref-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 1rem;
  color: #555;
  transition: all 0.3s ease;
}

.pref-item svg {
  width: 20px;
  font-size: 1.1rem;
  color: #666;
}

/* --- DYNAMIC STATES --- */

/* If preference is False: we fade the item */
.is-disabled {
  opacity: 0.4;
}

/* Specifically for smoking ban when it's "No Smoking" */
.is-negative svg {
  color: #d93025; /* Red icon */
}

.btn-edit {
  margin: 2rem 0;
  width: 85%;
  padding: 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  color: var(--juniata-blue);
  font-weight: 600;
  cursor: pointer;
}

.btn-edit:hover {
  background: #fcfcfc;
  border-color: var(--juniata-blue);
}
</style>0
