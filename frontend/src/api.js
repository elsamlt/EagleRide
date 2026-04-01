import axios from 'axios'

const api = axios.create({
  // 1. Corrected baseURL (removed /api if your routes are direct in Express)
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 2. INTERCEPTOR: Automatically attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Standard format: "Bearer <token>"
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- API ROUTES DEFINITION ---

export const userService = {
  // Get one specific profile (using goldCardNumber)
  getProfile: (id) => api.get(`/users/${id}`),
  // Register a new user
  register: (data) => api.post('/auth/register', data),
  // Login
  login: (credentials) => api.post('/auth/login', credentials)
}

export const rideService = {
  getAll: (params) => api.get('/rides', { params }),
  create: (data) => api.post('/rides', data),
  getReviews: (rideId) => api.get(`/rides/${rideId}/reviews`)
}

export const bookingService = {
  book: (data) => api.post('/bookings', data),
  getUserBookings: (userId) => api.get(`/users/${userId}/bookings`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status })
}

export const vehicleService = {
  getByUser: (userId) => api.get(`/users/${userId}/vehicles`),
  add: (data) => api.post('/vehicles', data)
}

export default api
