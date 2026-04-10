<script setup>
import { ref } from 'vue'
import { userService } from '@/api'
import UserForm from '@/components/UserForm.vue'

const email = ref('')
const password = ref('')

const handleLogin = () => {
  // Team will implement login logic here
}
</script>

<template>
  <div class="register-profile-view">

      <div class="form-card">
        <UserForm
          mode="create"
          @success="handleLogin"
        />
      </div>

    </div>
</template>

<style scoped>

.register-profile-view {
  max-width: 1200px; /* Slightly wider to accommodate two columns in UserForm */
  margin: 0 auto;
}

.form-card {
  background: var(--white);
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
</style>
