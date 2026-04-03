// src/stores/auth.js
import { defineStore } from 'pinia'
import { userService } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async login(email, password) {
      try {
        // Use the service method
        const response = await userService.login({ email, password });

        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error || "Login failed" };
      }
    },

    async register(userData) {
      try {
        const response = await userService.register(userData);
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error: error.response?.data?.error };
      }
    }
  }
})
