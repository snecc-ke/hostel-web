export const API_BASE_URL = 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  // Public
  HOSTELS: {
    LIST: '/hostels',
    DETAIL: (id) => `/hostels/${id}`,
    SEARCH: '/hostels/search',
  },
  // Student
  STUDENT: {
    BOOKINGS: '/student/bookings',
    PAYMENTS: '/student/payments',
    MESSAGES: '/student/messages',
  },
  // Landlord
  LANDLORD: {
    DASHBOARD: '/landlord/dashboard',
    HOSTELS: '/landlord/hostels',
    ROOMS: '/landlord/rooms',
    BOOKINGS: '/landlord/bookings',
    MESSAGES: '/landlord/messages',
    PAYMENTS: '/landlord/payments',
    REVIEWS: '/landlord/reviews',
    ANALYTICS: '/landlord/analytics',
    PROFILE: '/landlord/profile',
  },
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    VERIFICATIONS: '/admin/verifications',
    USERS: '/admin/users',
    DISPUTES: '/admin/disputes',
  },
};