import api from './api.js';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('kisansetu_token', res.data.token);
      localStorage.setItem('kisansetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('kisansetu_token', res.data.token);
      localStorage.setItem('kisansetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async googleLogin(data) {
    const res = await api.post('/auth/google-login', data);
    if (res.data?.token) {
      localStorage.setItem('kisansetu_token', res.data.token);
      localStorage.setItem('kisansetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async phoneLogin(data) {
    const res = await api.post('/auth/phone-login', data);
    if (res.data?.token) {
      localStorage.setItem('kisansetu_token', res.data.token);
      localStorage.setItem('kisansetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    if (res.data) {
      localStorage.setItem('kisansetu_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async updateProfile(updates) {
    const res = await api.put('/auth/profile', updates);
    if (res.data?.user) {
      localStorage.setItem('kisansetu_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async changePassword(passwords) {
    const res = await api.put('/auth/password', passwords);
    return res.data;
  },

  async getAllUsers() {
    const res = await api.get('/users');
    return res.data;
  },

  async updateUserRole(userId, role) {
    const res = await api.put(`/users/${userId}/role`, { role });
    return res.data;
  },

  async updateUserStatus(userId, isOnline, status) {
    const res = await api.put(`/users/${userId}/status`, { isOnline, status });
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('kisansetu_token');
      localStorage.removeItem('kisansetu_user');
    }
  },
};

export default authService;
