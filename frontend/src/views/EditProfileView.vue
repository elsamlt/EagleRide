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
          :initialData="user"
          @save="handleSave"
        />
        <div v-else class="loading-state">Loading profile...</div>
      </div>

    </div>
  <!-- </DashboardLayout> -->
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { userService } from '@/api';
import UserForm from '@/components/UserForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const handleSave = async ({ user: updatedUser, vehicle }) => {
  try {
    const result = await userService.dcnjdk({ user: updatedUser, vehicle });
    authStore.user = result;
    localStorage.setItem('user', JSON.stringify(result));
    console.log("Account updated successfully!");
    router.push('/dashboard/profile');
  } catch (error) {
    console.error('Update failed', error);
  }
};
</script>

<style scoped>
.edit-profile-view {
  max-width: 1200px; /* Slightly wider to accommodate two columns in UserForm */
  margin: 0 auto;
}

.navigation-header {
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  color: #9CA3AF;
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
  color: #6B7280;
  font-size: 16px;
}

.loading-state {
  text-align: center;
  padding: 50px;
  color: #9CA3AF;
}
</style>
