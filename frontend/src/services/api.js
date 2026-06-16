import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — clear session and redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('atm_token');
      localStorage.removeItem('atm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// ─── ATM ────────────────────────────────────────────────────────────────────
export const atmAPI = {
  getBalance: () => API.get('/atm/balance'),
  deposit: (data) => API.post('/atm/deposit', data),
  withdraw: (data) => API.post('/atm/withdraw', data),
  getHistory: (page = 1, limit = 20) =>
    API.get(`/atm/history?page=${page}&limit=${limit}`),
  getProfile: () => API.get('/atm/profile'),
};

export default API;
