<template>
  <div class="driver-card">
    <div class="card-header">
      <div class="avatar-circle">
        {{ driver.name.charAt(0) }}
      </div>
      <div class="driver-info">
        <h3 class="driver-name">{{ driver.name }}</h3>
        <div class="rating-row">
          <span class="star">★</span>
          <span class="rating-text">{{ driver.rating }} ({{ driver.reviews }} Reviews)</span>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <ul class="prefs-list">
      <li class="pref-item">
        <span class="icon">🚗</span>
        Drive a {{ driver.vehicle.model }} ({{ driver.vehicle.color }})
      </li>

      <li class="pref-item" :class="{ 'disabled': !driver.prefs.allowPets }">
        <span class="icon">{{ driver.prefs.allowPets ? '🐾' : '🚫🐾' }}</span>
        {{ driver.prefs.allowPets ? "I'm okay to travel with animals" : "I prefer not to travel in the company of animals" }}
      </li>

      <li class="pref-item" :class="{ 'disabled': !driver.prefs.allowMusic }">
        <span class="icon">{{ driver.prefs.allowMusic ? '🎵' : '🔇' }}</span>
        {{ driver.prefs.allowMusic ? `Music: ${driver.prefs.musicGenre} preferred` : "No music during the drive" }}
      </li>

      <li class="pref-item" :class="{ 'disabled': !driver.prefs.allowChat }">
        <span class="icon">🗣️</span>
        {{ driver.prefs.allowChat ? "I'm always up for a good conversation" : "I don't speak a lot" }}
      </li>

      <li class="pref-item" :class="{ 'disabled': !driver.prefs.allowSmoking }">
        <span class="icon">{{ driver.prefs.allowSmoking ? '🚬' : '🚭' }}</span>
        {{ driver.prefs.allowSmoking ? "You can smoke" : "No cigarettes, please" }}
      </li>
    </ul>
  </div>
</template>

<script setup>
/* English: Define props to receive driver data from the database/API */
defineProps({
  driver: {
    type: Object,
    required: true
    /* Example Object Structure:
       {
         name: 'Kai Sterling',
         rating: 4.8,
         reviews: 42,
         vehicle: { model: 'Toyota Camry', color: 'White' },
         prefs: { allowPets: false, allowMusic: true, musicGenre: '80s Rock', allowChat: true, allowSmoking: false }
       }
    */
  }
});
</script>

<style scoped>
.driver-card {
  background: var(--white);
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background-color: var(--juniata-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.driver-name {
  color: var(--juniata-blue);
  margin: 0;
  font-size: 18px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--juniata-gold);
  font-size: 14px;
}

.divider {
  border: none;
  border-top: 1px solid #F3F4F6;
  margin-bottom: 20px;
}

.prefs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pref-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6B7280; /* Standard Gray */
  font-size: 15px;
}

/* English: Visual style for negative preferences (V1 vs V2) */
.pref-item.disabled {
  color: #9CA3AF; /* Lighter Gray for 'No' options */
}

.icon {
  width: 20px;
  text-align: center;
}
</style>
