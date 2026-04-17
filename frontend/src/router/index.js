import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/HomeView.vue') },
      { path: 'profile', name: 'Profile', component: () => import('@/views/ProfileView.vue') },
      { path: 'my-drives', name: 'MyDrives', component: () => import('@/views/MyDrives.vue') },
      { path: 'edit-ride/:id', name: 'EditRide', component: () => import('@/views/EditRideView.vue') },
      { path: 'post-ride', name: 'PostRide', component: () => import('@/views/PostRideView.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
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

export default router
