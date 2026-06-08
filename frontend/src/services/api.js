import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  adminLogin: (data) => api.post('/auth/admin/login', data),
}

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  checkAvailability: (id, date, timeSlot) =>
    api.get(`/services/${id}/availability`, { params: { date, time_slot: timeSlot } }),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
}

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getByRef: (ref) => api.get(`/bookings/${ref}`),
  pay: (ref, data) => api.post(`/bookings/${ref}/pay`, data),
  getTimeSlots: () => api.get('/bookings/time-slots'),
}

export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  bookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
  customers: () => api.get('/admin/customers'),
  analytics: () => api.get('/admin/analytics'),
}

export default api
