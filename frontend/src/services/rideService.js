import api from './api';

export default {
  getDetails(rideId) {
    return api.get(`/rides/${rideId}`);
  },
  edit(rideId, data) {
    return api.put(`/rides/${rideId}`, data);
  },
  create(data) {
    return api.post('/rides', data);
  }
};