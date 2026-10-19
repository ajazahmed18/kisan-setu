import api from './api.js';

export const cropService = {
  async getLots(params = {}) {
    const res = await api.get('/lots', { params });
    return res.data;
  },

  async getLotById(id) {
    const res = await api.get(`/lots/${id}`);
    return res.data;
  },

  async createLot(lotData) {
    const res = await api.post('/lots', lotData);
    return res.data;
  },

  async updateLot(id, lotData) {
    const res = await api.put(`/lots/${id}`, lotData);
    return res.data;
  },

  async deleteLot(id) {
    const res = await api.delete(`/lots/${id}`);
    return res.data;
  },

  async checkQualityWithAI(imageBase64, cropType) {
    const res = await api.post('/ai/quality-check', { imageBase64, cropType });
    return res.data;
  },

  async getRecommendations(crop, location) {
    const res = await api.get('/recommendations', { params: { crop, location } });
    return res.data;
  },

  async getPriceTrends(crop, days) {
    const res = await api.get('/prices/trends', { params: { crop, days } });
    return res.data;
  },

  async getMandiPrices(crop) {
    const res = await api.get('/markets/prices', { params: { crop } });
    return res.data;
  },
};

export default cropService;
