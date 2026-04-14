x <template>
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
          <input v-model="user.name" type="text" placeholder="John Doe">
        </div>

        <div class="input-group">
          <label>Juniata Email</label>
          <input v-model="user.email" type="email" placeholder="example@juniata.edu" :disabled="isEditMode" :class="{'disabled-input': isEditMode}">
        </div>

        <div class="input-group">
          <label>Password</label>
          <input
            v-model="user.password"
            type="password"
            placeholder="******"
            :disabled="isEditMode"
            :class="{'disabled-input': isEditMode}"
          >
        </div>

        <div class="input-group">
          <label>Gold Card Number</label>
          <input v-model="user.goldCardNumber" type="text" placeholder="0013*******" :disabled="isEditMode" :class="{'disabled-input': isEditMode}">
        </div>

        <div class="input-group">
          <label>Date of Birth</label>
          <input
            type="text"
            v-model="user.dateOfBirth"
            placeholder="MM/DD/YYYY"
            onfocus="(this.type='date')"
            onblur="if(!this.value)this.type='text'"
          >
        </div>

        <div class="input-group">
          <label>Phone Number</label>
          <input v-model="user.phoneNumber" type="tel" placeholder="814-XXX-XXXX">
        </div>
      </section>

      <section class="form-section">
        <h3 class="section-title">Ride Preferences</h3>
        <p class="section-desc">How do you like to ride? Tap the preferences that describe you best.</p>

        <div class="prefs-flex">
          <div
            v-for="p in availablePrefs"
            :key="p.id"
            @click="togglePref(p.id)"
            :class="['pref-card', user[p.key] === 'yes' ? 'active' : '']"
          >
            <i class="material-icons">{{ p.icon }}</i>
            <span class="pref-label">{{ p.label }}</span>
            <span class="pref-sub">{{ p.sub }}</span>
          </div>
        </div>

        <h3 class="section-title" id="driver">Driver Information (Optional)</h3>

        <div class="input-group">
          <label>Driver's License Number</label>
          <input v-model="user.driverLicense" type="text" placeholder="PA-XXXXXX">
        </div>

        <div class="input-group">
          <label>Vehicle Model</label>
          <input v-model="vehicle.model" type="text" placeholder="Toyota Camry">
        </div>

        <div class="input-group">
          <label>Vehicle Color</label>
          <input v-model="vehicle.color" type="text" placeholder="White">
        </div>

        <div class="input-group">
          <label>License Plate</label>
          <input v-model="vehicle.plateNumber" type="text" placeholder="ABC-1234">
        </div>

      </section>

      <div class="submit-area">
        <AppButton size="full" type="submit">
          {{ isEditMode ? 'Save Changes' : 'Create Account' }}
        </AppButton>
        <p v-if="!isEditMode" class="login-prompt">
          Already have an account? <router-link to="/auth/login">Login here</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps({
  mode: { type: String, default: 'create' },
  initialData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['save']);

const isEditMode = computed(() => props.mode === 'edit');

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

watch(
  () => props.initialData,
  (data) => {
    if (!data) return;

    user.value = {
      name: data.name || data.fullName || '',
      email: data.email || '',
      password: '',
      goldCardNumber: data.goldCardNumber || '',
      dateOfBirth: data.dateOfBirth || data.dob || '',
      phoneNumber: data.phoneNumber || data.phone || '',
      driverLicense: data.driverLicense || data.driverInfo?.license || '',
      prefersMusic: data.prefersMusic || 'no',
      prefersConversation: data.prefersConversation || 'no',
      prefersSmoke: data.prefersSmoke || 'no',
      prefersPets: data.prefersPets || 'no'
    };

    vehicle.value = {
      model: data.vehicle?.model || data.driverInfo?.model || '',
      color: data.vehicle?.color || data.driverInfo?.color || '',
      plateNumber: data.vehicle?.plateNumber || data.driverInfo?.plate || ''
    };
  },
  { immediate: true }
);

const availablePrefs = [
  { id: 'music', key: 'prefersMusic', label: 'Music', icon: 'music_note', sub: 'Okay during ride?' },
  { id: 'chat', key: 'prefersConversation', label: 'Conversation', icon: 'forum', sub: 'Like to chat?' },
  { id: 'smoke', key: 'prefersSmoke', label: 'Non-Smoking', icon: 'smoke_free', sub: 'Strictly no smoke?' },
  { id: 'pets', key: 'prefersPets', label: 'Pets', icon: 'pets', sub: 'Allows animals?' }
];

const togglePref = (id) => {
  const pref = availablePrefs.find(p => p.id === id);
  user.value[pref.key] = user.value[pref.key] === 'yes' ? 'no' : 'yes';
};

const submitUser = () => {
  emit('save', {
    user: user.value,
    vehicle: vehicle.value
  });
};
</script>

<style scoped>
.user-form-container {
  max-width: 1100px;
  margin: 0 auto;
  background-color: var(--white);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 2.5rem;
  color: var(--light-grey);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--light-grey);
  font-size: 1.1rem;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--light-grey);
  text-decoration: none;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0rem 2rem;
}

.section-title {
  color: var(--juniata-blue);
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: 10px;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: left;
}

.section-title#driver {
  margin-top: 0rem;
  margin-bottom: 1.3rem;
}

.section-desc {
  font-size: 0.85rem;
  color: var(--light-grey);
  margin-bottom: 1rem;
  margin-top: 0rem;
  text-align: left;
}

/* Inputs */
.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  font-size: 0.95rem;
  margin-bottom: 8px;
  color: var(--text-dark);
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--white-hover);
  border-radius: 10px;
  font-size: 1rem;
  box-sizing: border-box;
  color: var(--text-dark);
}

input::placeholder {
  color: var(--light-gray);
}

input:focus {
  border-color: var(--light-grey);
  color: var(--light-grey);
  outline: none;
}

.disabled-input {
  background: var(--light-gray);
  color: var(--text-dark);
  cursor: not-allowed;
}

.disabled-input::placeholder {
  color: var(--light-grey);
  cursor: not-allowed;
}

/* Preferences Cards */
.prefs-flex {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.pref-card {
  flex: 1;
  max-width: 110px;
  border: 1px solid var(--white-hover);
  border-radius: 12px;
  padding: 10px 5px;
  text-align: center;
  cursor: pointer;
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.pref-card i {
  color: var(--juniata-blue);
  font-size: 1.3rem;
}

.pref-label {
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--text-dark);
}

.pref-sub {
  font-size: 0.6rem;
  color: var(--light-grey);
}

.pref-card.active {
  background-color: var(--white-hover);
  border-color: var(--light-grey);
}

/* Submit Area */
.submit-area {
  grid-column: span 2;
  text-align: center;
}

.login-prompt {
  margin-top: 1.2rem;
  color: var(--light-grey);
}

.login-prompt a {
  color: var(--juniata-blue);
  font-weight: 600;
  text-decoration: underline;
}

.size-full {
  margin-top: 10px;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .submit-area {
    grid-column: span 1;
  }
  .prefs-flex {
    flex-wrap: wrap;
  }
  .pref-card {
    flex: none;
    width: calc(50% - 10px);
  }
}
</style>
