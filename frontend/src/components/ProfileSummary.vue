<template>
  <div class="profile-card">
    <div class="card-header"></div>

    <div class="card-content">
      <div class="avatar-container">
        <div class="avatar-circle">
          {{ userInitial }}
        </div>
      </div>

      <div class="identity-section">
        <h2 class="user-name">{{ user.fullName }}</h2>
        <p class="user-email">{{ user.email }}</p>
        
        <div v-if="user.isVerified" class="verified-badge">
          <span class="icon">🛡️</span> verified Juniata student
        </div>
      </div>

      <hr class="divider" />

      <ul class="prefs-list">
        <li v-for="(pref, index) in formattedPreferences" :key="index">
          {{ pref }}
        </li>
      </ul>

      <div class="button-container">
        <button class="btn-outline" @click="$emit('edit')">
          Edit Profile Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      fullName: 'Kai Sterling',
      email: 'sterling@juniata.edu',
      isVerified: true,
      preferences: {
        animals: false,
        music: '80s Rock',
        conversation: true,
        smoking: false
      },
      vehicle: { model: 'Toyota Camry', color: 'White' }
    })
  }
});

defineEmits(['edit']);

/* English: Get the first letter of the name for the avatar */
const userInitial = computed(() => props.user.fullName.charAt(0).toUpperCase());

/* English: Map boolean preferences to readable English sentences */
const formattedPreferences = computed(() => {
  const p = props.user.preferences;
  const list = [];
  
  if (p.animals === false) list.push("I prefer not to travel in the company of animals");
  if (p.music) list.push(`Music: ${p.music} preferred`);
  if (p.conversation) list.push("I'm always up for a good conversation");
  if (p.smoking === false) list.push("No cigarettes, please");
  if (props.user.vehicle) list.push(`Drive a ${props.user.vehicle.model} (${props.user.vehicle.color})`);
  
  return list;
});
</script>

<style scoped>
.profile-card {
  background-color: var(--white);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
}

.card-header {
  background-color: var(--juniata-blue);
  height: 100px;
}

.card-content {
  padding: 0 30px 30px 30px;
  position: relative;
  text-align: center;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-top: -45px;
  margin-bottom: 15px;
}

.avatar-circle {
  width: 90px;
  height: 90px;
  background-color: #F9FAFB;
  border: 4px solid var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #9CA3AF;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.user-name {
  color: var(--juniata-blue);
  font-size: 22px;
  margin: 0;
}

.user-email {
  color: #9CA3AF;
  font-size: 14px;
  margin: 5px 0 15px;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--juniata-gold);
  color: var(--juniata-gold);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  background-color: rgba(168, 153, 104, 0.05);
}

.divider {
  border: none;
  border-top: 1px solid #E5E7EB;
  margin: 25px 0;
}

.prefs-list {
  list-style: none;
  padding: 0;
  text-align: left;
  margin-bottom: 30px;
}

.prefs-list li {
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 12px;
  padding-left: 20px;
  position: relative;
}

.button-container {
  margin-top: 20px;
}

/* English: Custom outline button to match the mockup */
.btn-outline {
  width: 100%;
  background-color: var(--white);
  color: var(--juniata-blue);
  border: 1px solid #D1D5DB;
  padding: 12px;
  border-radius: 12px;
  font-family: var(--font-main);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: var(--light-gray);
  border-color: var(--juniata-blue);
}
</style>
