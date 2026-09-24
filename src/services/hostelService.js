import { mockHostels } from './mockApi';

const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const hostelService = {
  async list(params = {}) {
    await delay();
    let result = mockHostels.filter((h) => h.status === 'verified');
    if (params.city) result = result.filter((h) => h.city.toLowerCase().includes(params.city.toLowerCase()));
    if (params.min_price) result = result.filter((h) => h.price_per_month >= params.min_price);
    if (params.max_price) result = result.filter((h) => h.price_per_month <= params.max_price);
    if (params.limit) result = result.slice(0, params.limit);
    return result;
  },

  async get(id) {
    await delay();
    const hostel = mockHostels.find((h) => h.id === Number(id));
    if (!hostel) throw new Error('Hostel not found');
    return hostel;
  },

  async search(filters = {}) {
    await delay();
    let result = mockHostels.filter((h) => h.status === 'verified');
    if (filters.city) result = result.filter((h) => h.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.min_price) result = result.filter((h) => h.price_per_month >= Number(filters.min_price));
    if (filters.max_price) result = result.filter((h) => h.price_per_month <= Number(filters.max_price));
    if (filters.amenities?.length) {
      result = result.filter((h) => filters.amenities.every((a) => h.amenities.includes(a)));
    }
    return result;
  },
};