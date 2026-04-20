<template>
  <!-- <DashboardLayout> -->
    <div class="edit-profile-view">

      <nav class="navigation-header">
        <button @click="$router.push('/dashboard')" class="back-button">
          <span class="arrow">←</span> Back to Profile
        </button>
      </nav>

      <div class="form-card">
        <UserForm
          v-if="user || mode === 'create'"
          :key="user.goldCardNumber"
          mode="edit"
          :initialData="fullUserData"
          @save="handleSave"
        />
        <div v-else class="loading-state">Loading profile...</div>
      </div>

    </div>
  <!-- </DashboardLayout> -->
</template>

<script setup>
import { computed, ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { vehicleService, userService } from '@/api';
import UserForm from '@/components/UserForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const fullUserData = ref(null);
const isLoading = ref(true);

const loadData = async () => {
  try {
    const userId = authStore.user?.goldCardNumber;
    if (!userId) return;

    const [userRes, vehicleRes] = await Promise.all([
      authStore.user,
      vehicleService.getByUser(userId)
    ]);

    fullUserData.value = {
      ...userRes,
      vehicle: vehicleRes
    };
  } catch (error) {
    console.error("Failed to load profile data", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadData);

const handleSave = async ({ user: updatedUser, vehicle: updatedVehicle }) => {
  try {
    const userId = authStore.user.goldCardNumber;

    const [userResult, vehicleResult] = await Promise.all([
      userService.updateProfile(userId, updatedUser),
      vehicleService.update(userId, updatedVehicle)
    ]);

    authStore.user = { ...authStore.user, ...userResult };

    localStorage.setItem('user', JSON.stringify(authStore.user));

    console.log("Profile and Vehicle updated successfully!");

    router.push('/dashboard');

  } catch (error) {
    console.error('Update failed:', error);
  }
};
</script>

<style scoped>
.edit-profile-view {
  max-width: 1200px;
  margin: 0 auto;
}

.navigation-header {
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  color: var(--light-grey);
  font-family: var(--font-main);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-button:hover {
  color: var(--juniata-blue);
}

.form-card {
  background: var(--white);
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-title {
  color: var(--text-dark);
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.form-subtitle {
  color: var(--light-grey);
  font-size: 16px;
}

.loading-state {
  text-align: center;
  padding: 50px;
  color: var(--light-grey);
}
</style>
