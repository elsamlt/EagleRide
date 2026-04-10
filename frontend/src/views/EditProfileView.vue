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
          mode="edit"
          :initialData="userData"
          @success="onUpdateSuccess"
        />
      </div>

    </div>
  <!-- </DashboardLayout> -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserForm from '@/components/UserForm.vue';

const router = useRouter();
const userData = ref(null);

onMounted(async () => {
  try {
    // Replace with your actual API call:
    // const response = await axios.get('/api/user/profile');
    // userData.value = response.data;

    // Mock Data for UI Testing:
    userData.value = {
      fullName: 'Ben Harrison',
      email: 'harrisb@juniata.edu',
      dob: '2002-12-03',
      phone: '814-555-0192',
      prefs: { music: true, chat: true, smoking: false, pets: true },
      driverInfo: {
        license: 'PA-9928374',
        model: 'Honda Civic',
        color: 'Silver',
        plate: 'ABC-1234'
      }
    };
  } catch (error) {
    console.error("Error loading profile:", error);
  }
});

const onUpdateSuccess = () => {
  // Trigger a success notification here if you have a snackbar/toast component
  console.log("Account updated successfully!");
  router.push('/dashboard/profile');
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
