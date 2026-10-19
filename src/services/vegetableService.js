import api from './api.js';

export const vegetableService = {
  async getVegetables(params = {}) {
    const res = await api.get('/vegetables', { params });
    return res.data;
  },

  async getVegetableById(id) {
    const res = await api.get(`/vegetables/${id}`);
    return res.data;
  },

  async createVegetable(vegData) {
    const res = await api.post('/vegetables', vegData);
    return res.data;
  },

  async updateVegetable(id, vegData) {
    const res = await api.put(`/vegetables/${id}`, vegData);
    return res.data;
  },

  async deleteVegetable(id) {
    const res = await api.delete(`/vegetables/${id}`);
    return res.data;
  },

  async getPriceHistory(id) {
    const url = id ? `/vegetables/${id}/history` : '/vegetables/history';
    const res = await api.get(url);
    return res.data;
  },
};

export default vegetableService;
