import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// --- API ROUTES DEFINITION ---

export const userService = {
  // Get all users (for testing)
  getAll: () => api.get('/users'),
  // Get one specific profile
  getProfile: (id) => api.get(`/users/${id}`),
  // Register a new user
  register: (data) => api.post('/auth/register', data),
  // Login
  login: (credentials) => api.post('/auth/login', credentials)
}

export const rideService = {
  // Fetch all available rides
  getAll: (params) => api.get('/rides', { params }), // params can be { destination: 'Paris' }
  // Create a new ride
  create: (data) => api.post('/rides', data),
  // Get reviews for a specific ride
  getReviews: (rideId) => api.get(`/rides/${rideId}/reviews`)
}

export const bookingService = {
  // Book a seat
  book: (data) => api.post('/bookings', data),
  // Get bookings for a specific user
  getUserBookings: (userId) => api.get(`/users/${userId}/bookings`),
  // Update booking status (Confirm/Cancel)
  updateStatus: (id, status) => api.patch(`/bookings/${id}`, { status })
}

export const vehicleService = {
  // Get vehicle by plate or user
  getByUser: (userId) => api.get(`/users/${userId}/vehicles`),
  // Add a new vehicle
  add: (data) => api.post('/vehicles', data)
}

export default api
