import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import the store to check authentication state

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    // Meta: All nested routes in this layout require the user to be logged in
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Home', component: () => import('@/views/HomeView.vue') },
      { path: 'profile', name: 'Profile', component: () => import('@/views/ProfileView.vue') },
      { path: 'my-drives', name: 'MyDrives', component: () => import('@/views/MyDrives.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    // Meta: These routes are only accessible to guests (not logged in)
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
// This function runs before every route change to check permissions
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. If the route (or its parent layout) requires auth and the user is NOT logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isLoggedIn) {
    // Redirect to the login page
    next('/auth/login')
  }
  // 2. If the user is ALREADY logged in but tries to access Login or Register pages
  else if (to.matched.some(record => record.meta.guestOnly) && authStore.isLoggedIn) {
    // Redirect them back to the Home page
    next('/')
  }
  // 3. Otherwise, allow the navigation to proceed
  else {
    next()
  }
})

export default router
