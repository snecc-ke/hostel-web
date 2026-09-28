import {
  mockAdminStats,
  mockVerifications,
  mockUsers,
  mockBookings,
  mockDisputes,
  mockPayments,
  mockReviews,
  mockAnalytics,
  mockHostels,
  mockLandlords,
} from './mockApi';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const adminService = {
  async getDashboard() {
    await delay();
    return mockAdminStats;
  },

  async getVerifications() {
    await delay();
    return mockVerifications;
  },

  async approveHostel(id) {
    await delay();
    const h = mockHostels.find((x) => x.id === Number(id));
    if (h) h.status = 'verified';
    return { message: 'Approved' };
  },

  async rejectHostel(id) {
    await delay();
    const h = mockHostels.find((x) => x.id === Number(id));
    if (h) h.status = 'rejected';
    return { message: 'Rejected' };
  },

  async getUsers() {
    await delay();
    return mockUsers;
  },

  async getBookings() {
    await delay();
    return mockBookings;
  },

  async getDisputes() {
    await delay();
    return mockDisputes;
  },

  async getPayments() {
    await delay();
    return mockPayments;
  },

  async getReviews() {
    await delay();
    return mockReviews;
  },

  async getAnalytics() {
    await delay();
    return mockAnalytics;
  },

  async getLandlordDetails(landlordId) {
    await delay(200);
    return mockLandlords[landlordId] || null;
  },

  async getLandlordHostels(landlordId) {
    await delay(200);
    return mockHostels.filter(
      (h) => h.owner_id === landlordId && h.status === 'verified'
    );
  },
};