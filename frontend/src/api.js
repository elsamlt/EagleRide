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
  getProfile: (id) => api.get(`/users/${id}`).then(res => res.data),
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  dcnjdk: (payload) => api.patch('/users/profile', payload).then(res => res.data),
  updateProfile: (id, data) => api.put(`/users/${id}`, data).then(res => res.data),
  getReviews: (rideId) => api.get(`/rides/${rideId}/reviews`),
  submitReview: (rideId, data) => api.post(`/rides/${rideId}/reviews`, data),
  getOffers: (userId) => api.get(`/users/${userId}/offers`).then(res => res.data)
}

export const rideService = {
  getAll: (params) => api.get('/rides', { params }),
  getDetails: (rideId) => api.get(`/rides/${rideId}`).then(res => res.data),
  getReviews: (rideId) => api.get(`/rides/${rideId}/reviews`).then(res => res.data),
  create: (data) => api.post('/rides', data),
  getDetails: (rideId) => api.get(`/rides/${rideId}`),
  edit: (data) => api.put(`/rides/${data.id}`, data),
}

export const bookingService = {
  book: (rideID, goldCardNumber) => api.post('/bookings', { rideID, goldCardNumber }).then(res => res.data),
  getUserBookings: (userId) => api.get(`/users/${userId}/bookings`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status })
}

export const vehicleService = {
  getByUser: (userId) => api.get(`/users/${userId}/vehicle`).then(res => res.data),
  add: (data) => api.post('/vehicles', data),
  update: (idUser, data) => api.put(`/vehicles/${idUser}`, data)
}

export default api
