<template>
  <div class="user-form-container">
    <div class="form-header">
      <h1>{{ isEditMode ? 'Edit Your Account' : 'Create Your Account' }}</h1>
      <p class="subtitle">
        {{ isEditMode ? 'Keep your information up to date' : 'Join the EagleRide community' }}
      </p>
    </div>

    <form @submit.prevent="submitUser" class="form-grid">
      <section class="form-section">
        <h3 class="section-title">Personal details</h3>

        <div class="input-group">
          <label>Full Name</label>
          <input v-model="user.name" type="text" placeholder="John Doe" required>
        </div>

        <div class="input-group">
          <label>Juniata Email</label>
          <input v-model="user.email" type="email" placeholder="example@juniata.edu" :disabled="isEditMode" :class="{'disabled-input': isEditMode}" required>
        </div>

        <div class="input-group">
          <label>Password</label>
          <input v-model="user.password" type="password" placeholder="******" :disabled="isEditMode" :class="{'disabled-input': isEditMode}" required>
        </div>

        <div class="input-group">
          <label>Gold Card Number</label>
          <input v-model="user.goldCardNumber" type="text" placeholder="0013*******" :disabled="isEditMode" :class="{'disabled-input': isEditMode}" required>
        </div>

        <div class="input-group">
          <label>Date of Birth</label>
          <input v-model="user.dateOfBirth" type="date" required>
        </div>

        <div class="input-group">
          <label>Phone Number</label>
          <input v-model="user.phoneNumber" type="tel" placeholder="814-XXX-XXXX" required>
        </div>
      </section>

      <section class="form-section">
        <h3 class="section-title">Ride Preferences</h3>
        <p class="section-desc">How do you like to ride? Tap to toggle.</p>

        <div class="prefs-flex">
          <div
            v-for="p in availablePrefs"
            :key="p.id"
            @click="togglePref(p.id)"
            :class="['pref-card', user[p.key] === 'yes' ? 'active' : '']"
          >
            <i class="material-icons">{{ p.icon }}</i>
            <span class="pref-label">{{ p.label }}</span>
          </div>
        </div>

        <h3 class="section-title">Driver Information (Optional)</h3>

        <div class="input-group">
          <label>Driver's License Number</label>
          <input v-model="user.driverLicense" type="text" placeholder="PA-XXXXXX">
        </div>

        <div class="input-group">
          <label>Vehicle Model</label>
          <input v-model="vehicle.model" type="text" placeholder="e.g. Honda Civic">
        </div>

        <div class="input-group">
          <label>Vehicle Color</label>
          <input v-model="vehicle.color" type="text" placeholder="e.g. Blue">
        </div>

        <div class="input-group">
          <label>License Plate</label>
          <input v-model="vehicle.plateNumber" type="text" placeholder="ABC-1234">
        </div>
      </section>

      <div class="submit-area">
        <AppButton size="full" type="submit" :disabled="loading">
          {{ loading ? 'Processing...' : (isEditMode ? 'Save Changes' : 'Create Account') }}
        </AppButton>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <p v-if="!isEditMode" class="login-prompt">
          Already have an account? <router-link to="/auth/login">Login here</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppButton from './AppButton.vue';
import { userService, vehicleService } from '@/api';

const props = defineProps({
  mode: { type: String, default: 'create' },
  initialData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['save', 'success']);
const router = useRouter();

const isEditMode = computed(() => props.mode === 'edit');
const errorMessage = ref('');
const loading = ref(false);

const user = ref({
  name: '',
  email: '',
  password: '',
  goldCardNumber: '',
  dateOfBirth: '',
  phoneNumber: '',
  driverLicense: '',
  prefersMusic: 'no',
  prefersConversation: 'no',
  prefersSmoke: 'no',
  prefersPets: 'no'
});

const vehicle = ref({
  model: '',
  color: '',
  plateNumber: ''
});

watch(() => props.initialData, (data) => {
  if (!data || Object.keys(data).length === 0) return;
  const cleanDate = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '';
  user.value = { ...user.value, ...data, dateOfBirth: cleanDate };
  if (data.vehicle) vehicle.value = { ...data.vehicle };
}, { immediate: true, deep: true });

const availablePrefs = [
  { id: 'music', key: 'prefersMusic', label: 'Music', icon: 'music_note' },
  { id: 'chat', key: 'prefersConversation', label: 'Conversation', icon: 'forum' },
  { id: 'smoke', key: 'prefersSmoke', label: 'Non-Smoking', icon: 'smoke_free' },
  { id: 'pets', key: 'prefersPets', label: 'Pets', icon: 'pets' }
];

const togglePref = (id) => {
  const pref = availablePrefs.find(p => p.id === id);
  user.value[pref.key] = user.value[pref.key] === 'yes' ? 'no' : 'yes';
};

const submitUser = async () => {
  if (isEditMode.value) {
    emit('save', user.value);
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  try {
    const registeredUser = await userService.register(user.value);
    if (vehicle.value.model || vehicle.value.plateNumber) {
      await vehicleService.add({ ...vehicle.value, goldCardNumber: user.value.goldCardNumber });
    }
    emit('success', registeredUser);
    router.push('/auth/login');
  } catch (error) {
    errorMessage.value = error?.response?.data?.error || 'Registration failed.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.user-form-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.form-header { text-align: center; margin-bottom: 2rem; }
.form-header h1 { color: #153154; margin-bottom: 0.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.section-title { color: #153154; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 1.5rem; font-size: 1.1rem; }
.input-group { margin-bottom: 1.2rem; }
.input-group label { display: block; font-weight: 600; margin-bottom: 5px; color: #444; }
.input-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
.prefs-flex { display: flex; gap: 10px; margin-bottom: 2rem; flex-wrap: wrap; }
.pref-card { padding: 10px; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; text-align: center; min-width: 80px; display: flex; flex-direction: column; align-items: center; }
.pref-card.active { background: #153154; color: white; border-color: #153154; }
.submit-area { grid-column: span 2; text-align: center; margin-top: 20px; }
.form-error { color: #d93025; margin-top: 10px; }
.login-prompt { margin-top: 15px; }
.login-prompt a { color: #153154; font-weight: bold; }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .submit-area { grid-column: span 1; }
}
</style>