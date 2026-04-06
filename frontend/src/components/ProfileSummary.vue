<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { vehicleService } from '@/api'
import { useRouter } from 'vue-router';
import AppButton from './AppButton.vue';

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const vehicle = ref(null)

// Get user initial for the avatar
const initial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'U')

const goToEditProfile = () => {
  if (user.value?.goldCardNumber) {
    router.push(`/edit-profile/${user.value.goldCardNumber}`);
  }
};

onMounted(async () => {
  // Only fetch if the user has a driver license
  if (user.value?.goldCardNumber && user.value?.driverLicense) {
    try {
      const data = await vehicleService.getByUser(user.value.goldCardNumber)
      vehicle.value = data
    } catch (error) {
      console.error("Vehicle fetch error:", error)
      vehicle.value = null
    }
  }
})
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
        <i class="material-symbols-outlined">verified_user</i>
        <span>verified Juniata student</span>
      </div>
    </div>

    <hr class="divider" />

    <div class="preferences">

      <div class="pref-item">
        <i class="material-icons">pets</i>

        <p>
          {{ user.prefersPets === 'yes' ? 'I\'m okay to travel with pets' : 'I prefer not to travel with animals' }}
        </p>
      </div>

      <div class="pref-item">
        <i v-if="user.prefersMusic === 'yes'" class="material-icons">music_note</i>

        <i v-else class="material-icons">music_off</i>

        <p>
          {{ user.prefersMusic === 'yes' ? 'We can put on a good playlist' : 'No music during the drive' }}
        </p>
      </div>

      <div class="pref-item">
        <i v-if="user.prefersConversation === 'yes'" class="material-icons">mic</i>

        <i v-else class="material-icons">mic_off</i>

        <p>
          {{ user.prefersConversation === 'yes' ? "I'm always up for a good conversation" : 'I don\'t speak a lot' }}
        </p>
      </div>

      <div class="pref-item">
        <i v-if="user.prefersSmoke === 'yes'" class="material-icons">smoking_rooms</i>

        <i v-else class="material-icons">smoke_free</i>

        <p>
          {{ user.prefersSmoke === 'yes' ? 'Smoking allowed' : 'No cigarettes, please' }}
        </p>
      </div>

      <div class="pref-item" v-if="user.driverLicense && vehicle">
        <i class="material-icons">directions_car</i>
        <p>Drives a {{ vehicle.model }} ({{ vehicle.color }})</p>
      </div>
    </div>

    <AppButton
      variant="outline"
      size="large"
      @click="goToEditProfile"
    >
      Edit Profile Settings
    </AppButton>
  </div>
</template>

<style scoped>
.profile-card {
  background: var(--white);
  width: 100%;
  max-width: 500px;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
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
  background: var(--light-gray);
  border: 4px solid var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--text-dark);
  font-weight: bold;
}

.user-name {
  color: var(--juniata-blue);
  margin-top: 1rem;
  font-size: 1.5rem;
}

.user-email {
  color: var(--text-dark);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.badge-verified {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--light-gray);
  padding: 4px 15px;
  border-radius: 20px;
  color: var(--juniata-gold);
  font-size: 0.8rem;
}

.divider {
  margin: 2rem auto;
  width: 85%;
  border: 0;
  border-top: 1px solid var(--light-gray);
}

p{
  font-size: 15px;
}

.preferences {
  text-align: left;
  padding: 0 60px;
}

.pref-item {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--text-dark);
  transition: all 0.3s ease;
}

.pref-item svg {
  width: 20px;
  font-size: 1.1rem;
  color: var(--text-dark);
}
</style>0
