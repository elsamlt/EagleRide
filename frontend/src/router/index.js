import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // --- MAIN LAYOUT ---
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/HomeView.vue') }
    ]
  },

  // --- PROFILE LAYOUT ---
  {
    path: '/dashboard',
    component: () => import('@/layouts/ProfileLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', name: 'Profile', component: () => import('@/views/ProfileView.vue') },
      { path: 'my-drives', name: 'MyDrives', component: () => import('@/views/MyDrives.vue') },
      { path: 'post-ride', name: 'PostRide', component: () => import('@/views/PostRideView.vue') },
      { path: 'edit-ride/:id', name: 'EditRide', component: () => import('@/views/EditRideView.vue') }
    ]
  },

  // --- AUTH LAYOUT ---
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      { path: 'login', name: 'Login', component: () => import('@/views/LoginView.vue') },
      { path: 'register', name: 'Register', component: () => import('@/views/RegisterView.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isLoggedIn) {
    next('/auth/login')
  } else if (to.matched.some(record => record.meta.guestOnly) && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
