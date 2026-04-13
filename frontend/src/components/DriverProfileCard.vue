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

    <div class="preferences">
      <div class="pref-item" v-if="driver.vehicle">
        <i class="material-icons">directions_car</i>
        <p>Drive a {{ driver.vehicle.model }} ({{ driver.vehicle.color }})</p>
      </div>

      <div class="pref-item">
        <i class="material-icons pet-icon">pets</i>
        <p>
          {{ driver.prefs.allowPets ? "I'm okay to travel in the company of animals" : "I prefer not to travel in the company of animals" }}
        </p>
      </div>

      <div class="pref-item">
        <i v-if="driver.prefs.allowMusic" class="material-icons">music_note</i>
        <i v-else class="material-icons">music_off</i>
        <p>
          {{ driver.prefs.allowMusic ? `Music: ${driver.prefs.musicGenre} preferred` : "No music during the drive" }}
        </p>
      </div>

      <div class="pref-item">
        <i v-if="driver.prefs.allowChat" class="material-icons">mic</i>
        <i v-else class="material-icons">mic_off</i>
        <p>
          {{ driver.prefs.allowChat ? "I'm always up for a good conversation" : "I don't speak a lot" }}
        </p>
      </div>

      <div class="pref-item">
        <i v-if="driver.prefs.allowSmoking" class="material-icons">smoking_rooms</i>
        <i v-else class="material-icons">smoke_free</i>
        <p>
          {{ driver.prefs.allowSmoking ? "You can smoke" : "No cigarettes, please" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #eee;
  margin-bottom: 15px;
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
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  border-top: 1px solid var(--light-gray);
  margin-bottom: 20px;
}

.preferences {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pref-item {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text-gray);
  font-size: 15px;
}

.pref-item p {
  margin: 0;
  line-height: 1.4;
  color: var(--light-grey);
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 20px;
  min-width: 24px;
  text-align: center;
  color: var(--light-grey);
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}

.icon {
  width: 20px;
  text-align: center;
}
</style>
