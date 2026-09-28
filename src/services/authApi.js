import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

/* ─────────────────────────────────────────────
   MOCK MODE
   Set USE_MOCK = false when the real backend is ready.
   ───────────────────────────────────────────── */
const USE_MOCK = true;

const MOCK_USERS = {
  'tenant@test.com': {
    password: 'Test1234!',
    user: { id: 1, name: 'Test Tenant', email: 'tenant@test.com', role: 'tenant' },
  },
  'landlord@test.com': {
    password: 'Test1234!',
    user: { id: 2, name: 'Test Landlord', email: 'landlord@test.com', role: 'landlord' },
  },
  'admin@test.com': {
    password: 'Test1234!',
    user: { id: 3, name: 'Test Admin', email: 'admin@test.com', role: 'admin' },
  },
};

const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = MOCK_USERS[email.toLowerCase()];
      if (!record) return reject(new Error('No account found for that email'));
      if (record.password !== password) return reject(new Error('Incorrect password'));
      resolve({
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
        token_type: 'bearer',
        expires_in: 900,
        user: record.user,
      });
    }, 700);
  });
};

export const authApi = {
  login: async (email, password) => {
    if (USE_MOCK) {
      const data = await mockLogin(email, password);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => !!localStorage.getItem('access_token'),
};