<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/AppButton.vue'
import { userService } from '@/api'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await userService.login({
      email: email.value,
      password: password.value
    })

    // Store user data and token in Pinia/LocalStorage
    authStore.login(response.user, response.token)

    router.push('/auth/login')
  } catch (error) {
    errorMessage.value = "Invalid email or password"
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-card">
    <h2>Welcome back</h2>
    <p class="subtitle">Login with you Juniata ID</p>

    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <input
          type="email"
          placeholder="Email @juniata.edu"
          v-model="email"
          required
        />
      </div>

      <div class="input-group">
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          required
        />
      </div>

      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

      <AppButton
        type="submit"
        size="large"
        class="full-width-btn"
        :loading="isLoading"
      >
        Login
      </AppButton>
    </form>

    <p class="footer-text">
      Don't have an account?
      <router-link to="/auth/register">Register here</router-link>
    </p>
  </div>
</template>

<style scoped>
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  width: 100%;
  max-width: 450px;
  text-align: center;
  box-sizing: border-box;
}

h2 {
  color: var(--text-dark);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-size: 0.95rem;
  opacity: 0.7;
}

.input-group {
  margin-bottom: 1.2rem;
  width: 100%;
}

input {
  width: 100%;
  /* Ensures padding doesn't increase width beyond 100% */
  box-sizing: border-box;
  padding: 12px 15px;
  border: 1px solid var(--light-grey);
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  color: var(--text-dark);
}

input::placeholder {
  color: var(--text-dark);
  opacity: 0.5;
}

input:focus {
  border-color: var(--juniata-blue);
}

/* Forces AppButton component to match input width */
.full-width-btn {
  width: 100%;
  margin-top: 1rem;
  box-sizing: border-box;
}

.error-msg {
  color: #d93025;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: left;
}

.footer-text {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-dark);
}

.footer-text a {
  color: var(--juniata-blue);
  font-weight: 600;
  text-decoration: underline;
}
</style>
