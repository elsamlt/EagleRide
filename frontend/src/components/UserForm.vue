<template>
  <div class="user-form-container">
    <div class="form-header">
      <h1>{{ isEditMode ? 'Edit Your Account' : 'Create Your Account' }}</h1>
      <p>{{ isEditMode ? 'Keep your information up to date' : 'Join the EagleRide community' }}</p>
    </div>

    <form @submit.prevent="submitUser" class="grid-layout">
      <section class="form-section">
        <h3 class="section-title">Personal details</h3>

        <div class="input-group">
          <label>Full Name</label>
          <input v-model="user.fullName" type="text" placeholder="John Doe">
        </div>

        <div class="input-group">
          <label>Juniata Email</label>
          <input v-model="user.email" type="email" :disabled="isEditMode" class="disabled-input">
        </div>

        </section>

      <section class="form-section">
        <h3 class="section-title">Ride Preferences</h3>
        <div class="prefs-grid">
           <div
             v-for="p in availablePrefs"
             :key="p.id"
             @click="togglePref(p.id)"
             :class="['pref-card', user.prefs.includes(p.id) ? 'active' : '']"
           >
             {{ p.label }}
           </div>
        </div>
      </section>

      <div class="submit-area">
        <AppButton size="large">
          {{ isEditMode ? 'Save Changes' : 'Create Account' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppButton from './common/AppButton.vue';

const props = defineProps({ mode: String }); // 'create' or 'edit'
const isEditMode = computed(() => props.mode === 'edit');

// Reactive data linked to SQL table columns
const user = ref({
  fullName: '',
  email: '',
  prefs: [],
  // ... other fields
});

const availablePrefs = [
  { id: 'music', label: 'Music' },
  { id: 'chat', label: 'Conversation' }
];

const togglePref = (id) => {
  const i = user.value.prefs.indexOf(id);
  i > -1 ? user.value.prefs.splice(i, 1) : user.value.prefs.push(id);
};
</script>

<style scoped>
.section-title {
  color: var(--juniata-blue);
  border-bottom: 2px solid var(--light-gray);
  padding-bottom: 10px;
}
.pref-card.active {
  border: 2px solid var(--juniata-blue);
  background-color: var(--white);
}
/* Use your grid and layout styles here */
</style>
