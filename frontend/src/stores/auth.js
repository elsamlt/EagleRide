// src/stores/auth.js
import { defineStore } from 'pinia'
import { userService } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Load initial state from localStorage
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        // We call the API service
        const response = await userService.login(credentials);

        // Since your api.js already does .then(res => res.data),
        // 'response' IS already the data object { token, user, message }
        this.token = response.token;
        this.user = response.user;

        // Save to LocalStorage
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        return { success: true };
      } catch (error) {
        console.error("Store Login Error:", error);
        return {
          success: false,
          error: error.response?.data?.error || "Invalid credentials"
        };
      }
    },

    async fetchUserProfile() {
      try {
        // On suppose que tu as une méthode dans ton api.js pour GET /users/:id
        const updatedUser = await userService.getUserProfile(this.user.goldCardNumber);

        this.user = updatedUser; // On met à jour Pinia
        localStorage.setItem('user', JSON.stringify(this.user)); // On met à jour le cache
      } catch (error) {
        console.error("Erreur refresh profil:", error);
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
})
